/**
 * MongoDB Connection Verification Script
 * This script tests the connection to MongoDB using the same
 * connection logic as the application. Used for pre-deployment testing.
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

// Validate environment variables
if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI environment variable is not set');
  process.exit(1);
}

// MongoDB connection URI from environment
const uri = process.env.MONGODB_URI;

// Connection options
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
};

async function verifyConnection() {
  let client;
  
  try {
    console.log('Connecting to MongoDB...');
    
    // Create and connect to the MongoDB client
    client = new MongoClient(uri, options);
    await client.connect();
    
    // Test the connection with a ping
    await client.db().command({ ping: 1 });
    
    // Get server information
    const adminDb = client.db('admin');
    const serverInfo = await adminDb.command({ serverStatus: 1 });
    
    console.log('✅ MongoDB connection successful!');
    console.log(`MongoDB server version: ${serverInfo.version}`);
    
    // List available databases
    const databases = await client.db().admin().listDatabases();
    console.log('\nAvailable databases:');
    databases.databases.forEach(db => {
      console.log(`- ${db.name} (${Math.round(db.sizeOnDisk / 1024 / 1024 * 100) / 100} MB)`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:');
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to any MongoDB servers.');
      console.error('Please check:');
      console.error('1. Your MongoDB connection string is correct');
      console.error('2. Your MongoDB server is running');
      console.error('3. Network connectivity and firewall settings');
    } else if (error.name === 'MongoError' && error.code === 18) {
      console.error('Authentication failed. Check username and password in your connection string.');
    } else {
      console.error(error);
    }
    
    return false;
  } finally {
    if (client) {
      console.log('Closing MongoDB connection...');
      await client.close();
    }
  }
}

// Run the verification if this is the main module
if (require.main === module) {
  verifyConnection()
    .then(success => {
      if (!success) {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { verifyConnection }; 
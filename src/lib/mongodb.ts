import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  retryReads: true,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    
    // Test the connection
    await client.db().command({ ping: 1 });
    
    const db = client.db();
    return { client, db };
  } catch (error) {
    console.error('[PRODUCTION] MongoDB connection error:', error);
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('connection')) {
        throw new Error('Database connection failed - please check network or credentials');
      } else if (error.message.includes('authentication')) {
        throw new Error('Database authentication failed - please check credentials');
      }
    }
    
    throw new Error('Failed to connect to MongoDB');
  }
}

export default clientPromise; 
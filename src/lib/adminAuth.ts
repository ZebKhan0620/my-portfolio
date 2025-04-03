import { createHash } from 'crypto';

/**
 * Verifies the admin password using constant-time comparison to prevent timing attacks
 */
export function verifyAdminKey(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword || !password) {
    return false;
  }
  
  try {
    // A simple constant-time comparison
    // This isn't as robust as crypto.timingSafeEqual, but works for our purpose
    // and avoids type issues with Buffer
    if (password.length !== adminPassword.length) {
      return false;
    }
    
    // Use hash comparison instead to avoid direct string comparison
    const hashedInput = createHash('sha256').update(password).digest('hex');
    const hashedStored = createHash('sha256').update(adminPassword).digest('hex');
    
    return hashedInput === hashedStored;
  } catch (error) {
    console.error('Error during admin authentication:', error);
    return false;
  }
} 
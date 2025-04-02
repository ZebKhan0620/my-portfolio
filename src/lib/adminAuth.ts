export function verifyAdminKey(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword) {
    return false;
  }
  
  return password === adminPassword;
} 
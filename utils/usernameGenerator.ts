/**
 * Utility functions for generating usernames from email addresses
 */

/**
 * Generates a unique username by appending a random number if needed
 * @param email - The email address to generate username from
 * @param existingUsernames - Array of existing usernames to check against
 * @returns A unique username
 */
export function generateUniqueUsernameFromEmail(
  email: string, 
  existingUsernames: string[] = []
): string {
  // Remove domain part and special characters
  const localPart = email.split('@')[0];
  
  // Remove special characters and replace with underscores
  let username = localPart
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
  
  // Ensure username is not empty
  if (!username) {
    username = 'user';
  }
  
  // Limit length to 30 characters (common username length limit)
  if (username.length > 30) {
    username = username.substring(0, 30);
  }
  
  // Ensure it starts with a letter or number
  if (!/^[a-zA-Z0-9]/.test(username)) {
    username = 'user_' + username;
  }
  
  username = username.toLowerCase();
  
  let counter = 1;
  
  // Keep trying until we find a unique username
  while (existingUsernames.includes(username)) {
    const suffix = counter.toString();
    const maxSuffixLength = 30 - username.length - suffix.length - 1; // -1 for underscore
    
    if (maxSuffixLength <= 0) {
      // If we can't fit the suffix, truncate the username
      username = username.substring(0, 29 - suffix.length) + '_' + suffix;
    } else {
      username = username + '_' + suffix;
    }
    
    counter++;
    
    // Prevent infinite loop
    if (counter > 999) {
      username = 'user_' + Date.now().toString().slice(-6);
      break;
    }
  }
  
  return username;
}

/**
 * Validates if a username is valid
 * @param username - The username to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export function validateUsername(username: string): { isValid: boolean; error?: string } {
  if (!username || username.trim().length === 0) {
    return { isValid: false, error: 'Username cannot be empty' };
  }
  
  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters long' };
  }
  
  if (username.length > 30) {
    return { isValid: false, error: 'Username cannot exceed 30 characters' };
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }
  
  if (!/^[a-zA-Z0-9]/.test(username)) {
    return { isValid: false, error: 'Username must start with a letter or number' };
  }
  
  return { isValid: true };
} 
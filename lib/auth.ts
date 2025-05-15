import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

export async function verifyAuth(token: string): Promise<DecodedToken> {
  try {
    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      throw new Error('Authentication configuration error');
    }

    // Validate token format
    if (!token || typeof token !== 'string') {
      console.error('Invalid token format:', token);
      throw new Error('Invalid token format');
    }

    // Clean token if it has 'Bearer ' prefix
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    
    console.log('Verifying token:', cleanToken.substring(0, 10) + '...');

    // Verify and decode token
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET) as DecodedToken;

    // Validate token structure
    if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
      console.error('Invalid token structure:', decoded);
      throw new Error('Invalid token structure');
    }

    // Check token expiration explicitly
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      console.error('Token expired. Current time:', now, 'Expiration:', decoded.exp);
      throw new Error('Token expired');
    }

    console.log('Token verified successfully for user:', decoded.userId);
    return decoded;

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error('JWT verification failed:', error.message);
      throw new Error('Invalid token');
    }

    if (error instanceof jwt.TokenExpiredError) {
      console.error('Token expired');
      throw new Error('Token expired');
    }

    console.error('Auth verification failed:', error);
    throw error instanceof Error ? error : new Error('Authentication failed');
  }
}
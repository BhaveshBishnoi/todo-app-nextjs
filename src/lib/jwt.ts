import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function signJwtToken(payload: any, options = {}) {
  const token = jwt.sign(payload, JWT_SECRET, {
    ...options,
    expiresIn: '7d', // Token expires in 7 days
  });
  return token;
}

export function verifyJwtToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

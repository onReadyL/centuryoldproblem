import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function getTokenData(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    return verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch {
    return null;
  }
}

export function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }
  try {
    const result = verify(token, JWT_SECRET) as { userId: string; email: string };
    return result;
  } catch {
    return null;
  }
}

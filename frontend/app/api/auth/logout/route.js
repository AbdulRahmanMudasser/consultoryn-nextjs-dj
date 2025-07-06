import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { token } = await request.json();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Logout proxy error:', {
      message: error.message,
      status: error.response?.status,
      stack: error.stack,
    });
    return NextResponse.json(
      error.response?.data || { error: 'Logout failed' },
      { status: error.response?.status || 500 }
    );
  }
}
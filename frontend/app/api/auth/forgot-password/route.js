import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { email } = await request.json();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
      { email },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Forgot password proxy error:', {
      message: error.message,
      status: error.response?.status,
      stack: error.stack,
    });
    return NextResponse.json(
      error.response?.data || { error: 'Forgot password failed' },
      { status: error.response?.status || 500 }
    );
  }
}
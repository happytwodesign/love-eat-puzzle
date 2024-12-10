import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    hasKey: !!process.env.REPLICATE_API_KEY,
    keyFirstChars: process.env.REPLICATE_API_KEY?.substring(0, 5) || 'not-set'
  })
} 
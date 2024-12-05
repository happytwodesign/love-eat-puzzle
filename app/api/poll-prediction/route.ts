import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: "Missing prediction ID" }, { status: 400 })
  }

  if (!process.env.REPLICATE_API_KEY) {
    return NextResponse.json({ error: "Replicate API key is not set" }, { status: 500 })
  }

  const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to fetch prediction status" }, { status: 500 })
  }

  const result = await response.json()
  return NextResponse.json(result)
}


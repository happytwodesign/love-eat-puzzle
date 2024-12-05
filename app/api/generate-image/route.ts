import { NextResponse } from 'next/server'

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function pollPrediction(id: string, token: string): Promise<any> {
  const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  })
  const prediction = await response.json()
  console.log('Polling status:', prediction.status, 'Error:', prediction.error)

  if (prediction.status === 'succeeded') {
    return prediction
  }
  if (prediction.status === 'failed') {
    throw new Error(`Prediction failed: ${prediction.error || 'Unknown error'}`)
  }
  await sleep(1000)
  return pollPrediction(id, token)
}

export async function POST(req: Request) {
  const { prompt } = await req.json()
  
  if (!process.env.REPLICATE_API_KEY) {
    return NextResponse.json({ error: "Replicate API key is not set" }, { status: 500 })
  }

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f",
        input: { 
          prompt,
          prompt_upsampling: true
        }
      }),
    })

    if (response.status !== 201) {
      const error = await response.json()
      console.error('API Error Response:', error)
      return NextResponse.json({ error: error.detail }, { status: 500 })
    }

    const prediction = await response.json()
    console.log('Initial Prediction:', prediction)
    
    const finalPrediction = await pollPrediction(prediction.id, process.env.REPLICATE_API_KEY!)
    console.log('Final Prediction:', finalPrediction)
    return NextResponse.json(finalPrediction)
  } catch (error) {
    console.error('Full error details:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate image',
      details: error
    }, { status: 500 })
  }
}


import { NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
})

export async function POST(req: Request) {
  const { prompt } = await req.json()
  
  if (!process.env.REPLICATE_API_KEY) {
    return NextResponse.json({ error: "Replicate API key is not set" }, { status: 500 })
  }

  try {
    console.log('Starting image generation with prompt:', prompt)
    const prediction = await replicate.predictions.create({
      version: "52a097eb737ba98bb686529a0c3cadcfac8bb1e8efbfff8f884f8bf1459b6ad3",
      input: {
        prompt,
        num_outputs: 1,
        width: 768,
        height: 512,
        num_inference_steps: 28,
        guidance_scale: 3,
        aspect_ratio: "3:2",
        model: "dev",
        prompt_strength: 0.8,
        disable_safety_checker: false,
        output_format: "png",
        output_quality: 100,
        go_fast: false,
        megapixels: "1"
      }
    })

    console.log('Waiting for image generation...')
    const output = await replicate.wait(prediction)
    console.log('Image generation completed:', output)

    return NextResponse.json({ output: output.output })
  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate image',
      details: error
    }, { status: 500 })
  }
}


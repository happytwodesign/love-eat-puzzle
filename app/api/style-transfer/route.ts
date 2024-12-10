import { NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
})

const styleImages = {
  'Watercolor': '/styles/watercolor.png',
  'Oil Painting': '/styles/oil-painting.png',
  'Sketch': '/styles/sketch.png',
  'Pixel Art': '/styles/pixel-art.png'
}

async function fetchImageAsBase64(url: string): Promise<string> {
  try {
    console.log('Fetching image from URL:', url)
    let fullUrl = url
    
    if (!url.startsWith('http')) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      fullUrl = new URL(url.startsWith('/') ? url : `/${url}`, baseUrl).toString()
      console.log('Constructed full URL:', fullUrl)
    }

    const response = await fetch(fullUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
    }
    
    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const mimeType = response.headers.get('content-type') || 'image/png'
    return `data:${mimeType};base64,${base64}`
  } catch (error) {
    console.error('Error in fetchImage:', error)
    throw error
  }
}

async function streamToBase64(stream: ReadableStream): Promise<string> {
  const chunks = [];
  const reader = stream.getReader();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  
  const buffer = Buffer.concat(chunks);
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

export async function POST(request: Request) {
  try {
    const { imageUrl, styleName, prompt } = await request.json()
    console.log('Received request with:', { imageUrl, styleName, prompt })

    if (!imageUrl || !styleName || styleName === 'Default') {
      return NextResponse.json(
        { error: 'Image URL and style name are required' },
        { status: 400 }
      )
    }

    const styleImageUrl = styleImages[styleName as keyof typeof styleImages]
    if (!styleImageUrl) {
      return NextResponse.json(
        { error: 'Invalid style name' },
        { status: 400 }
      )
    }

    // Get base64 encoded images
    const sourceImage = await fetchImageAsBase64(imageUrl)
    const referenceImage = await fetchImageAsBase64(styleImageUrl)
    
    console.log('Starting style transfer with prompt:', prompt)

    const styleOutput = await replicate.run(
      "black-forest-labs/flux-canny-dev",
      {
        input: {
          prompt: `${styleName} style, ${prompt || "transfer the artistic style while preserving the content"}`,
          control_image: sourceImage,
          image: sourceImage,
          reference_image: referenceImage,
          num_outputs: 1,
          num_inference_steps: 50,
          guidance: 8,
          content_strength: 0.9,
          style_strength: 0.5,
          seed: 42,
          output_format: "png",
          output_quality: 100,
          megapixels: "1",
          disable_safety_checker: false
        }
      }
    ) as ReadableStream[];

    console.log('Style transfer completed')

    if (!styleOutput?.[0]) {
      throw new Error('No style output generated')
    }

    // Convert final output stream to base64
    const finalOutput = await streamToBase64(styleOutput[0]);
    return NextResponse.json({ output: [finalOutput] })
  } catch (error) {
    console.error('Style transfer error:', error)
    return NextResponse.json(
      { error: 'Style transfer failed', details: error },
      { status: 500 }
    )
  }
} 
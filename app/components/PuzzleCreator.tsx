'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dice5, Upload, Wand2, Smartphone, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PuzzlePreview } from './PuzzlePreview'
import { Snowfall } from './Snowfall'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ExampleImage {
  id: number
  src: string
  alt: string
}

const examples: ExampleImage[] = [
  {
    id: 1,
    src: '/images/pixar_style_a_cute_faceless_white_fat_cat_in_a_snowy_winter_worest_3d_illustration__jqc9862q8gcnh2baf65j_1.png',
    alt: "White cat in snowy forest"
  },
  {
    id: 2,
    src: '/images/pixar_style_a_giant_faceless_white_fat_dog_with_a_transparent_belly_with_pink_full_of_water_and_sno_63zrfy6w7u0rddb5z44z_0.png',
    alt: "White dog in snow"
  },
  {
    id: 3,
    src: '/images/sashaisdrawing_httpss.mj.runIVZxjcY10eo_a_Christmas_tree_in_t_ef2ae1df-0713-4c48-abe7-6dc257bc3fdd_0.png',
    alt: "Christmas tree"
  },
  {
    id: 4,
    src: '/images/sashaisdrawing_httpss.mj.runHh2b3gvNoAM_httpss.mj.runds29nFjI_0ee706f7-2bd0-4a13-b42d-2c9184402b2e_1.png',
    alt: "Christmas decoration"
  }
]

const pieceOptions = ['30', '110', '252', '500', '1000']
const puzzleDimensions = {
  '30': { width: 250, height: 200 },
  '110': { width: 250, height: 200 },
  '252': { width: 375, height: 285 },
  '500': { width: 530, height: 390 },
  '1000': { width: 765, height: 525 }
}
const styleOptions = [
  {
    name: 'Default',
    prompt: null
  },
  {
    name: 'Watercolor',
    prompt: 'watercolor painting style, soft and flowing with visible brush strokes and color blending'
  },
  {
    name: 'Oil Painting',
    prompt: 'oil painting style with rich textures, visible brush strokes, and deep colors'
  },
  {
    name: 'Sketch',
    prompt: 'detailed pencil sketch style with fine lines and shading'
  },
  {
    name: 'Pixel Art',
    prompt: 'pixel art style with clear pixels and limited color palette'
  }
]

const predefinedPrompts = [
  "pixar style An elegant Christmas tree in a minimalist style, with lush green branches and decorated with pastel-colored ornaments in soft pink, blue, and peach hues. A golden star sits on top of the tree, and neatly wrapped gift boxes in coordinating pastel shades with ribbons are placed underneath. The background is simple and light beige, creating a clean and modern festive look, 3D illustration ",
  "pixar style, a magical winter forest scene featuring a snow-covered Christmas tree designed like a multi-layered gingerbread house. The setting has a soft, blueish winter glow with light snowfall, adding to the magical, festive feel, 3D illustration ",
  "pixar style, whimsical winter forest scene with magical creatures, 3D illustration  ",
  "pixar style, A cute faceless snowman in a snowy winter worest, 3D illustration",
  "pixar style, gingerbred christmas tree, 3D illustration",
  "pixar style, soft peachy-pink colors christmas tree decoration ball, 3D illustration christmas tree decoration ball, 3D illustration",
]

export default function PuzzleCreator() {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<string>(examples[0].src)
  const [complexity, setComplexity] = useState('110')
  const [isPortrait, setIsPortrait] = useState(false)
  const [style, setStyle] = useState('Default')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 })
  const [isStyleProcessing, setIsStyleProcessing] = useState(false)
  const [styleError, setStyleError] = useState<string | null>(null)

  const updatePreviewSize = useCallback(() => {
    if (containerRef.current && previewRef.current) {
      const containerHeight = containerRef.current.offsetHeight
      const containerWidth = containerRef.current.offsetWidth
      const toolbarHeight = 120
      const thumbnailsHeight = 80
      const marginHeight = 32
      const availableHeight = containerHeight - toolbarHeight - thumbnailsHeight - marginHeight
      const fixedHeight = Math.max(availableHeight - 0, 200)

      const { width: puzzleWidth, height: puzzleHeight } = puzzleDimensions[complexity as keyof typeof puzzleDimensions]
      const puzzleAspectRatio = puzzleWidth / puzzleHeight

      let width, height
      if (isPortrait) {
        height = fixedHeight
        width = height / puzzleAspectRatio
        
        if (width > containerWidth) {
          width = containerWidth
          height = width / puzzleAspectRatio
        }
      } else {
        height = fixedHeight
        width = height * puzzleAspectRatio
        
       if (width > containerWidth) {
       width = containerWidth
       height = width / puzzleAspectRatio
      }
     
      }

      setPreviewSize({ width: Math.floor(width), height: Math.floor(height) })
    }
  }, [complexity, isPortrait])

  useEffect(() => {
    updatePreviewSize()
    window.addEventListener('resize', updatePreviewSize)
    return () => window.removeEventListener('resize', updatePreviewSize)
  }, [updatePreviewSize])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setSelectedImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const generateImage = async () => {
    const randomPrompt = predefinedPrompts[Math.floor(Math.random() * predefinedPrompts.length)]
    console.log('Generating image with prompt:', randomPrompt)
    setIsGenerating(true)
    setError(null)
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: randomPrompt }),
      })
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      
      if (Array.isArray(data.output) && data.output.length > 0) {
        console.log('Image URL:', data.output[0])
        setSelectedImage(data.output[0])
      } else {
        throw new Error('No image was generated')
      }
    } catch (error) {
      console.error('Error generating image:', error)
      setError('Failed to generate image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const pollForResult = async (id: string): Promise<any> => {
    const response = await fetch(`/api/poll-prediction?id=${id}`)
    const result = await response.json()
    if (result.status === 'succeeded') {
      return result
    } else if (result.status === 'failed') {
      throw new Error('Image generation failed')
    } else {
      // If the status is 'pending' or 'processing', wait for a second and try again
      await new Promise(resolve => setTimeout(resolve, 1000))
      return pollForResult(id)
    }
  }

  const handlePlayOnline = () => {
    const puzzleId = Date.now().toString()
    const params = new URLSearchParams({
      imageUrl: encodeURIComponent(selectedImage),
      complexity: complexity,
      isPortrait: isPortrait.toString(),
    })
    router.push(`/play/${puzzleId}?${params.toString()}`)
  }

  const toggleComplexity = () => {
    const currentIndex = pieceOptions.indexOf(complexity)
    const nextIndex = (currentIndex + 1) % pieceOptions.length
    setComplexity(pieceOptions[nextIndex])
    updatePreviewSize()
  }

  const applyStyle = async (styleName: string) => {
    const selectedStyle = styleOptions.find(s => s.name === styleName)
    if (!selectedStyle || styleName === 'Default') {
      setStyle(styleName)
      return
    }

    setIsStyleProcessing(true)
    setStyleError(null)
    console.log('Applying style:', styleName)

    try {
      const response = await fetch('/api/style-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: selectedImage,
          styleName,
          prompt: selectedStyle.prompt
        }),
      })

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }

      if (Array.isArray(data.output) && data.output.length > 0) {
        console.log('Styled image URL:', data.output[0])
        setSelectedImage(data.output[0])
        setStyle(styleName)
      } else {
        throw new Error('Style transfer produced no output')
      }
    } catch (error) {
      console.error('Style transfer error:', error)
      setStyleError('Failed to apply style. Please try again.')
    } finally {
      setIsStyleProcessing(false)
    }
  }

  return (
    <div ref={containerRef} className="max-w-2xl mx-auto px-4 h-[calc(100vh-3rem)] flex flex-col justify-between relative bg-white py-2">
      <Snowfall />
      {(error || styleError) && (
        <div className="absolute top-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          <span className="block sm:inline">{error || styleError}</span>
        </div>
      )}
      <div className="flex-grow flex flex-col justify-center overflow-hidden py-4">
        <div 
          ref={previewRef}
          className="relative overflow-hidden bg-white rounded-lg mb-2 mx-auto flex items-center justify-center"
          style={{
            width: `${previewSize.width}px`,
            height: `${previewSize.height}px`,
            maxWidth: '100%',
            maxHeight: '78%',
            transition: 'width 0.3s ease-in-out, height 0.3s ease-in-out',
          }}
        >
          <PuzzlePreview
            imageUrl={selectedImage}
            complexity={parseInt(complexity)}
            width={previewSize.width}
            height={previewSize.height}
            isPortrait={isPortrait}
            className="w-full h-full rounded-lg overflow-hidden"
          />
        </div>

        <div className="flex justify-center gap-4 mb-2 overflow-x-auto py-1" style={{ height: '80px' }}>
          {examples.map((example) => (
            <button
              key={example.id}
              onClick={() => setSelectedImage(example.src)}
              className={cn(
                "relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0",
                selectedImage === example.src && "ring-2 ring-primary ring-offset-2"
              )}
            >
              <Image
                src={example.src}
                alt={example.alt}
                fill
                className="object-cover"
              />
            </button>
          ))}
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={generateImage} 
                  className="w-16 h-16 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center flex-shrink-0"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-700" />
                  ) : (
                    <Dice5 className="w-6 h-6 text-gray-700" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gray-800 text-white">
                <p>{isGenerating ? 'Generating...' : 'Generate'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <label className="w-16 h-16 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer flex-shrink-0">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Upload className="w-6 h-6 text-gray-700" />
                </label>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gray-800 text-white">
                <p>Upload</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white pb-4 pt-4 flex items-center justify-between px-4 md:px-12" style={{ height: '120px' }}>
        <div className="flex gap-8 items-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2 cursor-pointer" onClick={toggleComplexity}>
              <span className="text-sm font-medium">{complexity}</span>
            </div>
            <span className="text-xs text-gray-500 text-center">Pieces</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2 cursor-pointer" onClick={() => setIsPortrait(!isPortrait)}>
              {isPortrait ? (
                <Smartphone className="w-5 h-5 text-gray-700" />
              ) : (
                <Monitor className="w-5 h-5 text-gray-700" />
              )}
            </div>
            <span className="text-xs text-gray-500 text-center">{isPortrait ? 'Portrait' : 'Landscape'}</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Popover>
              <PopoverTrigger asChild>
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2 cursor-pointer relative">
                  <Wand2 className="w-5 h-5 text-gray-700" />
                  {isStyleProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 rounded-full">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-700" />
                    </div>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[200px] p-1 rounded-xl">
                <div className="flex flex-col">
                  {styleOptions.map((option) => (
                    <button
                      key={option.name}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm rounded-md",
                        style === option.name ? "bg-accent" : "hover:bg-accent"
                      )}
                      onClick={() => applyStyle(option.name)}
                      disabled={isStyleProcessing}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <span className="text-xs text-gray-500 text-center">Style</span>
          </div>
        </div>
        <Button className="bg-[#0F172A] text-white hover:bg-[#1E293B]" onClick={handlePlayOnline}>
          Play Online
        </Button>
      </div>
    </div>
  )
}


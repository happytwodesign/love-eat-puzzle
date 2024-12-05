'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import PuzzleCanvas from '@/app/components/PuzzleCanvas'
import { Snowfall } from '@/app/components/Snowfall'
import { puzzleDimensions } from '@/app/components/PuzzlePreview'

export default function PlayPuzzle({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const [puzzleData, setPuzzleData] = useState<{
    imageUrl: string
    complexity: number
    width: number;
    height: number;
  } | null>(null)

  useEffect(() => {
    const imageUrl = searchParams.get('imageUrl')
    const complexity = searchParams.get('complexity')

    if (imageUrl && complexity) {
      const actualDimensions = puzzleDimensions[complexity as keyof typeof puzzleDimensions]
      setPuzzleData({
        imageUrl: decodeURIComponent(imageUrl),
        complexity: parseInt(complexity),
        width: actualDimensions.width,
        height: actualDimensions.height
      })
    }
  }, [searchParams])

  if (!puzzleData) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="w-screen h-screen bg-white">
      <Snowfall />
      <PuzzleCanvas
        imageUrl={puzzleData.imageUrl}
        complexity={puzzleData.complexity}
        width={puzzleData.width}
        height={puzzleData.height}
      />
    </div>
  )
}


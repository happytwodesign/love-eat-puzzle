'use client'
import React from 'react'
import Image from 'next/image'
import { cn } from "@/lib/utils"

// Import your SVG paths as raw text:
import puzzle30Landscape from './SVG/5x6_30.svg?raw'
import puzzle30Portrait from './SVG/5x6_30.svg?raw'
import puzzle110Landscape from './SVG/11x10_110.svg?raw'
import puzzle110Portrait from './SVG/10x11_250.svg?raw'
import puzzle252Landscape from './SVG/18x14_252.svg?raw'
import puzzle252Portrait from './SVG/14x18_252.svg?raw'
import puzzle500Landscape from './SVG/25x20_500.svg?raw'
import puzzle500Portrait from './SVG/20x25_500.svg?raw'
import puzzle1000Landscape from './SVG/40x25_1000.svg?raw'
import puzzle1000Portrait from './SVG/25x40_1000.svg?raw'

interface PuzzlePreviewProps {
  imageUrl: string
  complexity: number
  width: number
  height: number
  isPortrait: boolean
  className?: string
}

export const puzzleDimensions = {
  '30':   { width: 250, height: 200 },
  '110':  { width: 250, height: 200 },
  '252':  { width: 375, height: 285 },
  '500':  { width: 530, height: 390 },
  '1000': { width: 765, height: 525 }
}

export const puzzleDimensionsPortrait = {
  '30':   { width: 200, height: 250 },
  '110':  { width: 200, height: 250 },
  '252':  { width: 285, height: 375 },
  '500':  { width: 390, height: 530 },
  '1000': { width: 525, height: 765 }
}

export const puzzlePaths: Record<string, { landscape: string; portrait: string }> = {
  '30': {
    landscape: puzzle30Landscape,
    portrait: puzzle30Portrait
  },
  '110': {
    landscape: puzzle110Landscape,
    portrait: puzzle110Portrait
  },
  '252': {
    landscape: puzzle252Landscape,
    portrait: puzzle252Portrait
  },
  '500': {
    landscape: puzzle500Landscape,
    portrait: puzzle500Portrait
  },
  '1000': {
    landscape: puzzle1000Landscape,
    portrait: puzzle1000Portrait
  }
}

export function PuzzlePreview({ imageUrl, complexity, width, height, isPortrait, className }: PuzzlePreviewProps) {
  const puzzleKey = complexity.toString();

  const actualDimensions = isPortrait
    ? puzzleDimensionsPortrait[puzzleKey as keyof typeof puzzleDimensionsPortrait]
    : puzzleDimensions[puzzleKey as keyof typeof puzzleDimensions];

  const aspectRatio = actualDimensions.width / actualDimensions.height
  const orientationKey = isPortrait ? 'portrait' : 'landscape'
  const puzzlePath = puzzlePaths[puzzleKey]?.[orientationKey]

  return (
    <div
      className={cn("relative overflow-hidden rounded-lg", className)}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <Image
        src={imageUrl}
        alt="Puzzle preview"
        fill
        className="rounded-lg object-cover"
        priority
      />
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${actualDimensions.width} ${actualDimensions.height}`}
        className="absolute inset-0 pointer-events-none"
        preserveAspectRatio="none"
      >
        {puzzlePath && <g dangerouslySetInnerHTML={{ __html: puzzlePath }} />}
      </svg>
    </div>
  );
}

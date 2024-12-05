'use client'
import React from 'react'
import Image from 'next/image'
import { cn } from "@/lib/utils"

interface PuzzlePreviewProps {
  imageUrl: string
  complexity: number
  width: number
  height: number
  isPortrait: boolean
  className?: string
}

export const puzzleDimensions = {
  '30': { width: 250, height: 200 },
  '110': { width: 250, height: 200 },
  '252': { width: 375, height: 285 },
  '500': { width: 530, height: 390 },
  '1000': { width: 765, height: 525 }
}

export function PuzzlePreview({ imageUrl, complexity, width, height, isPortrait, className }: PuzzlePreviewProps) {
  const actualDimensions = puzzleDimensions[complexity.toString() as keyof typeof puzzleDimensions]
  const aspectRatio = actualDimensions.width / actualDimensions.height
  
  const calculateGrid = () => {
    let rows, columns
    switch (complexity) {
      case 30:    rows = 5;  columns = 6;   break;
      case 110:   rows = 10; columns = 11;  break;
      case 252:   rows = 14; columns = 18;  break;
      case 500:   rows = 20; columns = 25;  break;
      case 1000:  rows = 25; columns = 40;  break;
      default:
        rows = Math.floor(Math.sqrt(complexity));
        columns = Math.ceil(complexity / rows);
    }
    return isPortrait ? { rows: columns, columns: rows } : { rows, columns }
  }
  
  const grid = calculateGrid()
  
  const gridLines = () => {
    const lines = [];
    const cellWidth = width / grid.columns;
    const cellHeight = height / grid.rows;
    
    // Vertical lines
    for (let i = 1; i < grid.columns; i++) {
      const x = Math.round(i * cellWidth);
      lines.push(
        <line
          key={`v${i}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke="white"
          strokeWidth="1"
          strokeOpacity="0.7"
          vectorEffect="non-scaling-stroke"
        />
      );
    }
    
    // Horizontal lines
    for (let i = 1; i < grid.rows; i++) {
      const y = Math.round(i * cellHeight);
      lines.push(
        <line
          key={`h${i}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke="white"
          strokeWidth="1"
          strokeOpacity="0.7"
          vectorEffect="non-scaling-stroke"
        />
      );
    }
    
    return lines;
  };

  return (
    <div 
      className={cn("relative overflow-hidden rounded-lg", className)} 
      style={{ 
        width: `${width}px`,
        height: `${height}px`,
        aspectRatio: isPortrait ? 1 / aspectRatio : aspectRatio
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
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0 pointer-events-none"
        preserveAspectRatio="none"
      >
        {gridLines()}
      </svg>
    </div>
  );
}


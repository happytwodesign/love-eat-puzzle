'use client'

import { useState, useEffect, useRef } from 'react'
import { Stage, Layer, Image as KonvaImage } from 'react-konva'
import useImage from 'use-image'

interface PuzzlePiece {
  id: number
  x: number
  y: number
  width: number
  height: number
}

interface PuzzleCanvasProps {
  imageUrl: string
  complexity: number
  width: number
  height: number
}

export default function PuzzleCanvas({ imageUrl, complexity, width, height }: PuzzleCanvasProps) {
  const imageState = useImage(imageUrl)
  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const stageRef = useRef<any>(null)

  useEffect(() => {
    if (imageState && imageState[0]) {
      const image = imageState[0]
      const aspectRatio = width / height
      const canvasWidth = Math.min(window.innerWidth, window.innerHeight * aspectRatio)
      const canvasHeight = canvasWidth / aspectRatio

      const rows = Math.floor(Math.sqrt(complexity))
      const columns = Math.ceil(complexity / rows)
      const pieceWidth = canvasWidth / columns
      const pieceHeight = canvasHeight / rows

      const newPieces = []
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
          newPieces.push({
            id: y * columns + x,
            x: Math.random() * (window.innerWidth - pieceWidth),
            y: Math.random() * (window.innerHeight - pieceHeight),
            width: pieceWidth,
            height: pieceHeight,
          })
        }
      }
      setPieces(newPieces)
    }
  }, [imageState, complexity, width, height])

  const handleDragEnd = (e: any, id: number) => {
    const updatedPieces = pieces.map(piece =>
      piece.id === id ? { ...piece, x: e.target.x(), y: e.target.y() } : piece
    )
    setPieces(updatedPieces)
  }

  if (!imageState || !imageState[0]) {
    return <div>Loading image...</div>
  }

  return (
    <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}>
      <Layer>
        {pieces.map((piece) => (
          <KonvaImage
            key={piece.id}
            image={imageState[0]}
            x={piece.x}
            y={piece.y}
            width={piece.width}
            height={piece.height}
            crop={{
              x: (piece.id % Math.sqrt(complexity)) * piece.width,
              y: Math.floor(piece.id / Math.sqrt(complexity)) * piece.height,
              width: piece.width,
              height: piece.height,
            }}
            draggable
            onDragEnd={(e) => handleDragEnd(e, piece.id)}
          />
        ))}
      </Layer>
    </Stage>
  )
}


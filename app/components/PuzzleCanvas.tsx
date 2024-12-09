'use client'

import { useState, useEffect, useRef } from 'react'
import { Stage, Layer, Image } from 'react-konva'
import dynamic from 'next/dynamic'

const PuzzleStage = dynamic(() => Promise.resolve(Stage), { ssr: false })

interface PuzzlePiece {
  id: number
  x: number
  y: number
  width: number
  height: number
  correctX: number
  correctY: number
  isPlaced: boolean
}

interface PuzzleCanvasProps {
  imageUrl: string
  complexity: number
  width: number
  height: number
}

const PuzzleCanvas = ({ imageUrl, complexity, width, height }: PuzzleCanvasProps) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const [scale, setScale] = useState(1)
  const stageRef = useRef<any>(null)
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [completedPieces, setCompletedPieces] = useState(0)

  useEffect(() => {
    const img = new window.Image()
    img.src = imageUrl
    img.onload = () => {
      setImage(img)
    }
  }, [imageUrl])

  useEffect(() => {
    if (image) {
      console.log('Initializing puzzle pieces')
      const aspectRatio = width / height
      const canvasWidth = Math.min(window.innerWidth * 0.8, window.innerHeight * aspectRatio)
      const canvasHeight = canvasWidth / aspectRatio

      const rows = Math.floor(Math.sqrt(complexity))
      const columns = Math.ceil(complexity / rows)
      const pieceWidth = canvasWidth / columns
      const pieceHeight = canvasHeight / rows

      const newPieces: PuzzlePiece[] = []
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
          const correctX = x * pieceWidth + (window.innerWidth - canvasWidth) / 2
          const correctY = y * pieceHeight + (window.innerHeight - canvasHeight) / 2

          newPieces.push({
            id: y * columns + x,
            x: Math.random() * (window.innerWidth - pieceWidth),
            y: Math.random() * (window.innerHeight - pieceHeight),
            width: pieceWidth,
            height: pieceHeight,
            correctX,
            correctY,
            isPlaced: false,
          })
        }
      }
      setPieces(newPieces)
      console.log('Puzzle pieces initialized:', newPieces.length)
    }
  }, [image, complexity, width, height])

  const handleWheel = (e: any) => {
    e.evt.preventDefault()
    const scaleBy = 1.1
    const stage = stageRef.current
    const oldScale = stage.scaleX()
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    }

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy
    setScale(newScale)

    const newPos = {
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    }
    setStagePos(newPos)
  }

  const handleDragEnd = (e: any, id: number) => {
    const piece = pieces.find(p => p.id === id)
    if (!piece) return

    const tolerance = 20
    const isNearCorrectPos = 
      Math.abs(e.target.x() - piece.correctX) < tolerance &&
      Math.abs(e.target.y() - piece.correctY) < tolerance

    if (isNearCorrectPos && !piece.isPlaced) {
      console.log(`Piece ${id} snapped to correct position`)
      const updatedPieces = pieces.map(p =>
        p.id === id
          ? { ...p, x: p.correctX, y: p.correctY, isPlaced: true }
          : p
      )
      setPieces(updatedPieces)
      setCompletedPieces(prev => prev + 1)

      if (completedPieces + 1 === pieces.length) {
        console.log('Puzzle completed!')
        alert('Congratulations! You completed the puzzle!')
      }
    } else {
      const updatedPieces = pieces.map(p =>
        p.id === id ? { ...p, x: e.target.x(), y: e.target.y() } : p
      )
      setPieces(updatedPieces)
    }
  }

  if (!image) {
    return <div>Loading puzzle...</div>
  }

  return (
    <PuzzleStage
      width={window.innerWidth}
      height={window.innerHeight}
      ref={stageRef}
      onWheel={handleWheel}
      scaleX={scale}
      scaleY={scale}
      x={stagePos.x}
      y={stagePos.y}
      draggable={!isDragging}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      <Layer>
        {pieces.map((piece) => (
          <Image
            key={piece.id}
            image={image}
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
            draggable={!piece.isPlaced}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(e) => {
              setIsDragging(false)
              handleDragEnd(e, piece.id)
            }}
            opacity={piece.isPlaced ? 1 : 0.8}
          />
        ))}
      </Layer>
    </PuzzleStage>
  )
}

export default PuzzleCanvas


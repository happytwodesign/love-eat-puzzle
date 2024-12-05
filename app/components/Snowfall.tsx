'use client'

import React, { useEffect, useRef, useCallback } from 'react'

interface Snowflake {
  x: number
  y: number
  radius: number
  speed: number
  opacity: number
}

export function Snowfall() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const createSnowflakes = useCallback((canvas: HTMLCanvasElement): Snowflake[] => {
    return Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 4 + 1,
      speed: Math.random() * 3 + 1,
      opacity: Math.random(),
    }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const snowflakes = createSnowflakes(canvas)

    const drawSnowflakes = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'white'
      ctx.beginPath()
      snowflakes.forEach(flake => {
        ctx.moveTo(flake.x, flake.y)
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2, true)
      })
      ctx.fill()
    }

    const moveSnowflakes = () => {
      snowflakes.forEach(flake => {
        flake.y += flake.speed
        flake.x += Math.sin(flake.y / 30) * 2

        if (flake.y > canvas.height) {
          flake.y = 0
          flake.x = Math.random() * canvas.width
        }
      })
    }

    const animateSnowfall = () => {
      drawSnowflakes()
      moveSnowflakes()
      animationRef.current = requestAnimationFrame(animateSnowfall)
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    animationRef.current = requestAnimationFrame(animateSnowfall)
    window.addEventListener('resize', handleResize)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [createSnowflakes])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      aria-hidden="true"
    />
  )
}


import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { Mic, Volume2 } from "lucide-react"

interface AudioVisualizerProps {
  size?: number
  maxRipples?: number
  rippleSpeed?: number
  sensitivity?: number
}

interface Ripple {
  id: number
  radius: number
  maxRadius: number
  opacity: number
  amplitude: number[]
  direction: "outward" | "inward"
  color: string
}

const BidirectionalAudioVisualizer: React.FC<AudioVisualizerProps> = ({
  size = 300,
  maxRipples = 5,
  rippleSpeed = 2,
  sensitivity = 1.5,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const ripplesRef = useRef<Ripple[]>([])
  const rippleIdRef = useRef(0)

  const [isListening, setIsListening] = useState(false)
  const [isSpeaking] = useState(false)
  const [, setIsLoading] = useState(false)
  const [, setError] = useState<string | null>(null)
  const [volume, setVolume] = useState(0)
  const [mode, setMode] = useState<"idle" | "listening" | "speaking">("idle")

  // Create gradient colors for different modes
  const getGradientColors = (mode: string, intensity: number) => {
    const alpha = Math.max(0.3, intensity)
    switch (mode) {
      case "listening":
        return {
          inner: `rgba(147, 51, 234, ${alpha})`, // Purple
          outer: `rgba(79, 70, 229, ${alpha * 0.6})`, // Indigo
          glow: "#9333ea",
        }
      case "speaking":
        return {
          inner: `rgba(59, 130, 246, ${alpha})`, // Blue
          outer: `rgba(147, 51, 234, ${alpha * 0.6})`, // Purple
          glow: "#3b82f6",
        }
      default:
        return {
          inner: `rgba(124, 58, 237, ${alpha * 0.5})`,
          outer: `rgba(124, 58, 237, ${alpha * 0.3})`,
          glow: "#7c3aed",
        }
    }
  }

  // Create a new ripple
  const createRipple = useCallback(
    (amplitude: number[], direction: "outward" | "inward") => {
      const colors = getGradientColors(direction === "outward" ? "listening" : "speaking", amplitude[0] / 255)

      const ripple: Ripple = {
        id: rippleIdRef.current++,
        radius: direction === "outward" ? 0 : size / 2,
        maxRadius: size / 2,
        opacity: 1,
        amplitude: [...amplitude],
        direction,
        color: colors.inner,
      }

      ripplesRef.current.push(ripple)

      // Limit number of ripples
      if (ripplesRef.current.length > maxRipples) {
        ripplesRef.current.shift()
      }
    },
    [size, maxRipples],
  )

  // Draw a single ripple
  const drawRipple = useCallback(
    (ctx: CanvasRenderingContext2D, ripple: Ripple, centerX: number, centerY: number) => {
      const { radius, amplitude, opacity, direction, color } = ripple

      if (opacity <= 0) return

      ctx.save()
      ctx.globalAlpha = opacity

      // Create gradient
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius + 20)
      gradient.addColorStop(0, color)
      gradient.addColorStop(0.7, color.replace(/[\d.]+\)$/g, "0.3)"))
      gradient.addColorStop(1, "transparent")

      // Draw waveform circle
      ctx.beginPath()
      ctx.strokeStyle = gradient
      ctx.lineWidth = 3
      ctx.shadowColor = getGradientColors(direction === "outward" ? "listening" : "speaking", amplitude[0] || 0).glow
      ctx.shadowBlur = 15

      const segments = amplitude.length
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2
        const amp = (amplitude[i] / 255) * 30 * sensitivity
        const waveRadius = radius + (direction === "outward" ? amp : -amp)

        const x = centerX + waveRadius * Math.cos(angle)
        const y = centerY + waveRadius * Math.sin(angle)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.closePath()
      ctx.stroke()
      ctx.restore()
    },
    [sensitivity],
  )

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    const analyser = analyserRef.current

    if (!canvas || !ctx) return

    animationIdRef.current = requestAnimationFrame(animate)

    // Clear canvas with fade effect
    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Get audio data if available
    let currentAmplitude: number[] = []
    if (analyser && (isListening || isSpeaking)) {
      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(dataArray)
      currentAmplitude = Array.from(dataArray)

      // Calculate volume
      const avgVolume = currentAmplitude.reduce((sum, val) => sum + val, 0) / currentAmplitude.length
      setVolume(Math.round((avgVolume / 255) * 100))

      // Create new ripples based on volume threshold
      if (avgVolume > 10) {
        const timeSinceLastRipple = Date.now() % 200
        if (timeSinceLastRipple < 50) {
          createRipple(currentAmplitude, isListening ? "outward" : "inward")
        }
      }
    }

    // Update and draw ripples
    ripplesRef.current = ripplesRef.current.filter((ripple) => {
      // Update ripple properties
      if (ripple.direction === "outward") {
        ripple.radius += rippleSpeed
        ripple.opacity = Math.max(0, 1 - ripple.radius / ripple.maxRadius)
      } else {
        ripple.radius -= rippleSpeed
        ripple.opacity = Math.max(0, ripple.radius / ripple.maxRadius)
      }

      // Draw ripple
      drawRipple(ctx, ripple, centerX, centerY)

      // Remove if fully faded or out of bounds
      return (
        ripple.opacity > 0 && (ripple.direction === "outward" ? ripple.radius < ripple.maxRadius : ripple.radius > 0)
      )
    })

    // Draw center indicator
    const centerRadius = 12 + (volume / 100) * 8
    const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, centerRadius)
    const colors = getGradientColors(mode, volume / 100)

    centerGradient.addColorStop(0, colors.inner)
    centerGradient.addColorStop(1, colors.outer)

    ctx.beginPath()
    ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2)
    ctx.fillStyle = centerGradient
    ctx.shadowColor = colors.glow
    ctx.shadowBlur = 20
    ctx.fill()

    // Draw pulse ring around center
    if (volume > 5) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, centerRadius + 10, 0, Math.PI * 2)
      ctx.strokeStyle = colors.inner
      ctx.lineWidth = 2
      ctx.globalAlpha = (volume / 100) * 0.5
      ctx.stroke()
      ctx.globalAlpha = 1
    }
  }, [isListening, isSpeaking, volume, mode, createRipple, drawRipple, rippleSpeed])

  // Start microphone listening
  const startListening = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      streamRef.current = stream

      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext

      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8
      analyserRef.current = analyser

      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      setIsListening(true)
      setMode("listening")

      if (!animationIdRef.current) {
        animate()
      }
    } catch (err) {
      console.error("Error accessing microphone:", err)
      setError("Failed to access microphone. Please check permissions.")
    } finally {
      setIsLoading(false)
    }
  }, [animate])

  // Stop listening
  const stopListening = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    analyserRef.current = null
    setIsListening(false)
    setMode("idle")
    setVolume(0)
  }, [])

  // Text-to-Speech with audio analysis
  // const speak = useCallback(
  //   async (text: string) => {
  //     if (!text.trim()) return

  //     try {
  //       setIsSpeaking(true)
  //       setMode("speaking")

  //       // Create audio context for TTS analysis
  //       const AudioContext = window.AudioContext || (window as any).webkitAudioContext
  //       const audioContext = new AudioContext()
  //       audioContextRef.current = audioContext

  //       const analyser = audioContext.createAnalyser()
  //       analyser.fftSize = 256
  //       analyser.smoothingTimeConstant = 0.8
  //       analyserRef.current = analyser

  //       // Create speech synthesis
  //       const utterance = new SpeechSynthesisUtterance(text)
  //       utterance.rate = 0.9
  //       utterance.pitch = 1.1
  //       utterance.volume = 0.8

  //       // Start animation
  //       if (!animationIdRef.current) {
  //         animate()
  //       }

  //       // Simulate TTS audio data (since we can't directly analyze speech synthesis)
  //       const simulateTTSAudio = () => {
  //         const dataArray = new Uint8Array(128)
  //         for (let i = 0; i < dataArray.length; i++) {
  //           dataArray[i] = Math.random() * 150 + 50 // Simulate speech frequencies
  //         }
  //         return Array.from(dataArray)
  //       }

  //       // Create periodic ripples during speech
  //       const rippleInterval = setInterval(() => {
  //         if (isSpeaking) {
  //           createRipple(simulateTTSAudio(), "inward")
  //         }
  //       }, 150)

  //       utterance.onend = () => {
  //         clearInterval(rippleInterval)
  //         setIsSpeaking(false)
  //         setMode("idle")
  //         setVolume(0)
  //         audioContext.close()
  //       }

  //       speechSynthesis.speak(utterance)
  //     } catch (err) {
  //       console.error("Error with speech synthesis:", err)
  //       setIsSpeaking(false)
  //       setMode("idle")
  //     }
  //   },
  //   [animate, createRipple, isSpeaking],
  // )

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = size
      canvas.height = size

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.fillStyle = "#000000"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }
  }, [size])

  // Start animation loop
  useEffect(() => {
    if ((isListening || isSpeaking) && !animationIdRef.current) {
      animate()
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
        animationIdRef.current = null
      }
    }
  }, [isListening, isSpeaking, animate])

  useEffect(()=>{
    startListening()
  },[])
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening()
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [stopListening])

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Canvas Visualizer */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="rounded-full border-2 border-purple-500/20 shadow-2xl"
          style={{
            background: "radial-gradient(circle, #0f0f23 0%, #000000 100%)",
            filter: mode !== "idle" ? "brightness(1.2)" : "brightness(0.8)",
          }}
        />

        {/* Center Mic Icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`transition-all duration-300 ${mode !== "idle" ? "scale-110" : "scale-100"}`}>
            {mode === "listening" ? (
              <Mic className={`w-8 h-8 text-purple-400 ${volume > 20 ? "animate-pulse" : ""}`} />
            ) : mode === "speaking" ? (
              <Volume2 className="w-8 h-8 text-blue-400 animate-pulse" />
            ) : (
              <Mic className="w-8 h-8 text-purple-400/60" />
            )}
          </div>
        </div>
      </div>

    
    </div>
  )
}

export default BidirectionalAudioVisualizer

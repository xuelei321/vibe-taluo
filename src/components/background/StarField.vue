<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  baseOpacity: number
  speedX: number
  speedY: number
  color: string
  phase: number
}

interface ShootingStar {
  x: number
  y: number
  len: number
  angle: number
  speed: number
  life: number
  maxLife: number
  opacity: number
}

interface Particle {
  x: number
  y: number
  size: number
  opacity: number
  speedY: number
  wobble: number
  phase: number
}

interface ConstellationLink {
  from: number
  to: number
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null
let stars: Star[] = []
let shootingStars: ShootingStar[] = []
let particles: Particle[] = []
let canvasWidth = 0
let canvasHeight = 0

const initStars = () => {
  stars = []
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.8 + 0.2,
      baseOpacity: Math.random() * 0.5 + 0.3,
      speedX: (Math.random() - 0.5) * 0.15 + 0.05,
      speedY: (Math.random() - 0.5) * 0.15 + 0.05,
      color: Math.random() < 0.85 ? '#ffffff' : Math.random() < 0.7 ? '#8ab4f8' : '#c8a0ff',
      phase: Math.random() * Math.PI * 2
    })
  }
}

function spawnShootingStar(): ShootingStar {
  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight * 0.5,
    len: Math.random() * 80 + 60,
    angle: Math.PI / 6 + Math.random() * Math.PI / 6,
    speed: Math.random() * 6 + 4,
    life: 0,
    maxLife: Math.random() * 40 + 30,
    opacity: 1
  }
}

shootingStars = [spawnShootingStar()]

const initParticles = () => {
  particles = []
  for (let i = 0; i < 30; i++) {
    particles.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      speedY: -(Math.random() * 0.3 + 0.1),
      wobble: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2
    })
  }
}

function getConstellationAnchorStars(): Star[] {
  return stars
    .filter(s => s.size > 1.2 && s.color !== '#ffffff')
    .slice(0, 8)
}

const constellationLinks: ConstellationLink[] = []

function buildConstellationLinks() {
  const anchors = getConstellationAnchorStars()
  constellationLinks.length = 0
  for (let i = 0; i < anchors.length - 1; i++) {
    const fromIdx = stars.indexOf(anchors[i])
    const toIdx = stars.indexOf(anchors[i + 1])
    if (fromIdx >= 0 && toIdx >= 0) {
      constellationLinks.push({ from: fromIdx, to: toIdx })
    }
  }
}

const animate = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  const time = Date.now() * 0.002

  stars.forEach(star => {
    star.x += star.speedX
    star.y += star.speedY

    if (star.x < 0) star.x = canvasWidth
    if (star.x > canvasWidth) star.x = 0
    if (star.y < 0) star.y = canvasHeight
    if (star.y > canvasHeight) star.y = 0

    star.opacity = star.baseOpacity + Math.sin(time * 2 + star.phase) * 0.3 + 0.2
    star.opacity = Math.max(0.15, Math.min(1.0, star.opacity))

    if (star.size > 1.2) {
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2)
      const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 2)
      if (star.color === '#8ab4f8') {
        glow.addColorStop(0, `rgba(138, 180, 248, ${star.opacity * 0.3})`)
      } else if (star.color === '#c8a0ff') {
        glow.addColorStop(0, `rgba(200, 160, 255, ${star.opacity * 0.3})`)
      } else {
        glow.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * 0.3})`)
      }
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = glow
      ctx.fill()
    }

    ctx.beginPath()
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
    if (star.color === '#8ab4f8') {
      ctx.fillStyle = `rgba(138, 180, 248, ${star.opacity})`
    } else if (star.color === '#c8a0ff') {
      ctx.fillStyle = `rgba(200, 160, 255, ${star.opacity})`
    } else {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
    }
    ctx.fill()
  })

  if (constellationLinks.length === 0) buildConstellationLinks()
  const lineOpacity = 0.08 + Math.sin(time * 0.5) * 0.03
  constellationLinks.forEach(link => {
    const from = stars[link.from]
    const to = stars[link.to]
    if (!from || !to) return
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.strokeStyle = `rgba(180, 140, 255, ${lineOpacity})`
    ctx.lineWidth = 0.5
    ctx.setLineDash([4, 8])
    ctx.stroke()
    ctx.setLineDash([])
  })

  particles.forEach(p => {
    p.y += p.speedY
    p.x += Math.sin(time * 3 + p.phase) * p.wobble
    if (p.y < -10) { p.y = canvasHeight + 10; p.x = Math.random() * canvasWidth }
    if (p.x < 0) p.x = canvasWidth
    if (p.x > canvasWidth) p.x = 0

    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(180, 200, 255, ${p.opacity})`
    ctx.fill()
  })

  shootingStars = shootingStars.filter(s => s.life < s.maxLife)
  shootingStars.forEach(s => {
    s.x -= Math.cos(s.angle) * s.speed
    s.y += Math.sin(s.angle) * s.speed
    s.life++

    const fadeRatio = 1 - s.life / s.maxLife
    s.opacity = fadeRatio

    const endX = s.x + Math.cos(s.angle) * s.len * fadeRatio
    const endY = s.y - Math.sin(s.angle) * s.len * fadeRatio

    const gradient = ctx.createLinearGradient(s.x, s.y, endX, endY)
    gradient.addColorStop(0, `rgba(200, 220, 255, ${s.opacity})`)
    gradient.addColorStop(1, 'rgba(200, 220, 255, 0)')

    ctx.beginPath()
    ctx.moveTo(s.x, s.y)
    ctx.lineTo(endX, endY)
    ctx.strokeStyle = gradient
    ctx.lineWidth = 1.2
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`
    ctx.fill()
  })

  if (Math.random() < 0.008 || shootingStars.length === 0) {
    shootingStars.push(spawnShootingStar())
  }

  animationId = requestAnimationFrame(animate)
}

const handleResize = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  canvasWidth = window.innerWidth
  canvasHeight = window.innerHeight
  canvas.width = canvasWidth * (window.devicePixelRatio || 1)
  canvas.height = canvasHeight * (window.devicePixelRatio || 1)
  canvas.style.width = canvasWidth + 'px'
  canvas.style.height = canvasHeight + 'px'
  const ctx = canvas.getContext('2d')
  if (ctx) ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)

  initStars()
  initParticles()
  constellationLinks.length = 0
}

onMounted(() => {
  handleResize()
  animate()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <canvas ref="canvasRef" class="fixed inset-0 z-0 pointer-events-none" />
</template>

'use client'

import { useState, useEffect, useRef } from 'react'

// นำเข้าไฟล์รูปภาพตามชื่อจริงในโฟลเดอร์ animation
import basketballImg from './bas.jpg'
import footballImg from './football.jpg'
import volleyballImg from './vel.avif'
import humanImg from './human2.png'
import courtImg from './images.jpg'

// แมปรูปภาพสำหรับแสดงผล
const images: Record<string, string> = {
  Basketball: basketballImg.src,
  Football: footballImg.src,
  Volleyball: volleyballImg.src,
  Human: humanImg.src,
}

// แมปปุ่มกดคีย์บอร์ด 0-4
const keyMap: Record<string, string> = {
  '0': 'None',
  '1': 'Basketball',
  '2': 'Football',
  '3': 'Volleyball',
  '4': 'Human',
}

const containerWidth = 640
const containerHeight = 480
const itemSize = 80
const speed = 4

export default function Page() {
  const [selected, setSelected] = useState('None')
  const [running, setRunning] = useState(false)

  const posRef = useRef({ x: containerWidth / 2, y: containerHeight / 2 })
  const velRef = useRef({
    vx: speed * Math.cos(Math.PI / 4),
    vy: -speed * Math.sin(Math.PI / 4),
  })
  const rotationRef = useRef(0)
  const requestRef = useRef(0)

  const [, forceRender] = useState(0)

  // ---------- Animation loop ----------
  useEffect(() => {
    if (!running) return

    const animate = () => {
      const pos = posRef.current
      const vel = velRef.current

      pos.x += vel.vx
      pos.y += vel.vy

      if (pos.x - itemSize / 2 <= 0) {
        pos.x = itemSize / 2
        vel.vx = -vel.vx
      } else if (pos.x + itemSize / 2 >= containerWidth) {
        pos.x = containerWidth - itemSize / 2
        vel.vx = -vel.vx
      }

      if (pos.y - itemSize / 2 <= 0) {
        pos.y = itemSize / 2
        vel.vy = -vel.vy
      } else if (pos.y + itemSize / 2 >= containerHeight) {
        pos.y = containerHeight - itemSize / 2
        vel.vy = -vel.vy
      }

      rotationRef.current = (rotationRef.current + 5) % 360

      forceRender((n) => n + 1)
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  }, [running])

  const handleToggleRun = () => {
    setRunning((prev) => !prev)
  }

  const handleSelect = (type: string) => {
    setSelected(type)
  }

  // ---------- Keyboard: Space = run/pause, 0-4 = เลือกรูป ----------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        setRunning((prev) => !prev)
        return
      }
      if (keyMap[e.key]) {
        setSelected(keyMap[e.key])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const pos = posRef.current
  const itemX = pos.x - itemSize / 2
  const itemY = pos.y - itemSize / 2

  let ballElement = null
  if (selected === 'None') {
    ballElement = (
      <div
        className="rounded-circle border border-3 border-secondary"
        style={{
          position: 'absolute',
          width: itemSize,
          height: itemSize,
          left: itemX,
          top: itemY,
          backgroundColor: 'lightgray',
        }}
      />
    )
  } else if (images[selected]) {
    ballElement = (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={images[selected]}
        alt={selected}
        className="rounded-circle"
        style={{
          position: 'absolute',
          width: itemSize,
          height: itemSize,
          objectFit: 'cover',
          left: itemX,
          top: itemY,
          transform: `rotate(${rotationRef.current}deg)`,
        }}
      />
    )
  }

  const buttons = ['Basketball', 'Football', 'Volleyball', 'Human']

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        precedence="default"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
        rel="stylesheet"
        precedence="default"
      />

      <div className="bg-white text-dark text-center pt-3 pb-4">
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>68091921 piyarat</div>

        <div
          className="m-auto border border-2 border-dark rounded-4 position-relative overflow-hidden mt-2"
          style={{
            width: containerWidth,
            height: containerHeight,
            backgroundImage: `url(${courtImg.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#f0d9a8',
          }}
        >
          {ballElement}
        </div>

        <div className="mt-2">
          <button
            className={`btn btn-sm me-1 ${running ? 'btn-danger' : 'btn-success'}`}
            onClick={handleToggleRun}
          >
            <span className={`bi ${running ? 'bi-pause' : 'bi-play'}`}></span>{' '}
            {running ? 'PAUSE' : 'RUN'}
          </button>

          <button
            className={`btn btn-sm me-1 ${
              selected === 'None' ? 'btn-dark' : 'btn-outline-dark'
            }`}
            onClick={() => handleSelect('None')}
          >
            None
          </button>

          {buttons.map((name) => (
            <button
              key={name}
              className={`btn btn-sm me-1 ${
                selected === name ? 'btn-primary' : 'btn-outline-primary'
              }`}
              onClick={() => handleSelect(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
'use client'

import { useCallback, useEffect, useState } from 'react'
import './calculator.css'

type Op = '+' | '-' | '×' | '÷'

const calculate = (a: number, b: number, op: Op) => {
  if (op === '+') return a + b
  if (op === '-') return a - b
  if (op === '×') return a * b
  return b === 0 ? NaN : a / b
}

const show = (n: number) => {
  if (!isFinite(n)) return 'Error'
  return String(parseFloat(n.toPrecision(12)))
}

export default function Page() {
  const [screen, setScreen] = useState('0')
  const [first, setFirst] = useState<number | null>(null)
  const [operator, setOperator] = useState<Op | null>(null)
  const [newNumber, setNewNumber] = useState(true)
  const [memory, setMemory] = useState(0)

  // ฟังก์ชันช่วยสร้างข้อความ "เลขหน้า เครื่องหมาย เลขหลัง"
  const getFullExpression = () => {
    if (first !== null && operator) {
      if (newNumber) {
        // เมื่อเพิ่งกดเครื่องหมายไป (ยังไม่ได้พิมพ์เลขหลัง) ให้แสดง: "เลขหน้า เครื่องหมาย"
        return `${show(first)} ${operator}`
      }
      // เมื่อกำลังพิมพ์เลขหลัง ให้แสดง: "เลขหน้า เครื่องหมาย เลขหลัง"
      return `${show(first)} ${operator} ${screen}`
    }
    return screen
  }

  const numberClick = useCallback(
    (n: string) => {
      if (screen === 'Error' || newNumber) {
        setScreen(n)
        setNewNumber(false)
      } else {
        setScreen(screen === '0' ? n : screen + n)
      }
    },
    [screen, newNumber]
  )

  const dotClick = useCallback(() => {
    if (newNumber || screen === 'Error') {
      setScreen('0.')
      setNewNumber(false)
    } else if (!screen.includes('.')) {
      setScreen(screen + '.')
    }
  }, [screen, newNumber])

  const operatorClick = useCallback(
    (op: Op) => {
      if (screen === 'Error') return
      const current = Number(screen)
      if (first !== null && operator && !newNumber) {
        const result = calculate(first, current, operator)
        setFirst(result)
        setScreen(show(result))
      } else {
        setFirst(current)
      }
      setOperator(op)
      setNewNumber(true)
    },
    [screen, first, operator, newNumber]
  )

  const equalClick = useCallback(() => {
    if (first === null || !operator) return
    const result = calculate(first, Number(screen), operator)
    setScreen(show(result))
    setFirst(null)
    setOperator(null)
    setNewNumber(true)
  }, [first, operator, screen])

  const ceClick = useCallback(() => {
    setScreen('0')
    setFirst(null)
    setOperator(null)
    setNewNumber(true)
  }, [])

  const backspace = useCallback(() => {
    if (newNumber || screen === 'Error') return
    setScreen(screen.length > 1 ? screen.slice(0, -1) : '0')
  }, [screen, newNumber])

  const percentClick = useCallback(() => {
    const current = Number(screen)
    if (first !== null && operator) {
      setScreen(show((first * current) / 100))
    } else {
      setScreen(show(current / 100))
    }
    setNewNumber(true)
  }, [screen, first, operator])

  const unary = (fn: (n: number) => number) => {
    setScreen(show(fn(Number(screen))))
    setNewNumber(true)
  }

  const signClick = () => {
    if (screen === '0' || screen === 'Error') return
    setScreen(screen.startsWith('-') ? screen.slice(1) : '-' + screen)
  }

  // ---------- Keyboard ----------
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key
      if (/^[0-9]$/.test(k)) numberClick(k)
      else if (k === '.' || k === ',') dotClick()
      else if (k === '+') operatorClick('+')
      else if (k === '-') operatorClick('-')
      else if (k === '*' || k === 'x' || k === 'X') operatorClick('×')
      else if (k === '/') {
        e.preventDefault()
        operatorClick('÷')
      } else if (k === 'Enter' || k === '=') {
        e.preventDefault()
        equalClick()
      } else if (k === 'Backspace') backspace()
      else if (k === 'Escape' || k === 'Delete') ceClick()
      else if (k === '%') percentClick()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [numberClick, dotClick, operatorClick, equalClick, backspace, ceClick, percentClick])

  return (
    <div className="calculator">
      <div className="outer">
        <div className="inner">
          <div id="screen" className="screen">
            {/* แสดงการคำนวณทั้งหมด (เลขหน้า + เครื่องหมาย + เลขหลัง) */}
            <div className="expression-display">{getFullExpression()}</div>
          </div>

          <div className="btn-row">
            <button className="green" onClick={() => setMemory(0)}>MC</button>
            <button className="green" onClick={() => { setScreen(show(memory)); setNewNumber(true) }}>MR</button>
            <button className="green" onClick={() => setMemory(memory + Number(screen))}>M+</button>
            <button className="green" onClick={() => setMemory(memory - Number(screen))}>M-</button>
            <button className="orange" onClick={ceClick}>CE</button>
          </div>

          <div className="btn-row">
            <button className="purple" onClick={() => numberClick('7')}>7</button>
            <button className="purple" onClick={() => numberClick('8')}>8</button>
            <button className="purple" onClick={() => numberClick('9')}>9</button>
            <button className="green" onClick={() => operatorClick('÷')}>÷</button>
            <button className="green" onClick={() => unary(Math.sqrt)}>√</button>
          </div>

          <div className="btn-row">
            <button className="purple" onClick={() => numberClick('4')}>4</button>
            <button className="purple" onClick={() => numberClick('5')}>5</button>
            <button className="purple" onClick={() => numberClick('6')}>6</button>
            <button className="green" onClick={() => operatorClick('×')}>×</button>
            <button className="green" onClick={percentClick}>%</button>
          </div>

          <div className="btn-row">
            <button className="purple" onClick={() => numberClick('1')}>1</button>
            <button className="purple" onClick={() => numberClick('2')}>2</button>
            <button className="purple" onClick={() => numberClick('3')}>3</button>
            <button className="green" onClick={() => operatorClick('-')}>−</button>
            <button className="green" onClick={() => unary((n) => 1 / n)}>1/x</button>
          </div>

          <div className="btn-row">
            <button className="purple" onClick={() => numberClick('0')}>0</button>
            <button className="purple" onClick={dotClick}>.</button>
            <button className="purple" onClick={signClick}>+/−</button>
            <button className="green" onClick={() => operatorClick('+')}>+</button>
            <button className="green" onClick={equalClick}>=</button>
          </div>

          <div className="student">68091921</div>
        </div>
      </div>
    </div>
  )
}
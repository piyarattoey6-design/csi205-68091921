'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/app/cart-context'

export default function NavMenu() {
  const pathname = usePathname()
  const { products, cart } = useCart() // เปลี่ยนจาก carts เป็น cart

  const items = [
    { href: '/', label: 'Home' },
    { href: '/animation', label: 'Animation' },
    { href: '/calculator', label: 'Calculator' },
    { href: '/todos', label: 'Todos' },
    { href: '/products', label: `Products${products.length ? ` (${products.length})` : ''}` },
    { href: '/carts', label: 'Carts', badge: cart.length }, // เปลี่ยนจาก carts เป็น cart
  ]

  return (
    <nav className="flex justify-center gap-2 my-3">
      {items.map((it) => {
        const active = pathname === it.href
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`relative rounded-md border px-3 py-1.5 text-sm ${
              active
                ? 'bg-blue-600 text-white border-blue-600 shadow'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {it.label}
            {it.badge ? (
              <span className="absolute -top-2 -right-2 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                {it.badge}
              </span>
            ) : null}
          </Link>
        )
      })}
    </nav>
  )
}
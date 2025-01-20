import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="w-full py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Logo
          </Link>
          <div className="space-x-4">
            <Link href="/blog">Blog</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

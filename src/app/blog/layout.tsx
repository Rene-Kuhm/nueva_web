'use client';



export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1">

      {children}

    </div>
  )
}

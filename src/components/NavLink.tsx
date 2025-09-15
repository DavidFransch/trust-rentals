import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavLinkProps {
  href: string
  children: React.ReactNode
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
        isActive
          ? "border-primary text-primary"
          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
      )}
    >
      {children}
    </Link>
  )
}
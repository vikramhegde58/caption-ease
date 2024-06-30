import Link from 'next/link'

export const Navbar = () => {
    return (
        <nav className="flex gap-6 text-white/70">
            <Link href="/">Home</Link>
            <Link href="/pricing">Pricing</Link>
            <a href="mailto:shwetakapla.ai@gmail.com">Contact</a>
        </nav>
    )
}

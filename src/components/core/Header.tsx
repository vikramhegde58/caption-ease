import Link from 'next/link'
import {FlashIcon} from '../icons/FlashIcon'
import {Navbar} from './Navbar'

export const Header = () => {
    return (
        <header className="flex justify-between my-8">
            <Link href="/" className="flex gap-2">
                <FlashIcon className="size-6" />
                <span>CaptionEase</span>
            </Link>
            <Navbar />
        </header>
    )
}

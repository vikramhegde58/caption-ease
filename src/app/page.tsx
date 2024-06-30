'use client'
import {FileInput} from '@/components/core/FileInput'
import {PageTitle} from '@/components/core/PageTitle'

export default function Home() {
    return (
        <>
            <PageTitle
                title="Add Captions to your videos with ease"
                description="Upload your video to generate the caption"
            />
            <div className="text-center">
                <FileInput />
            </div>
        </>
    )
}

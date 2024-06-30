import axios from 'axios'
import {UploadIcon} from '../icons/UploadIcon'
import {ChangeEvent, useState} from 'react'
import {useRouter} from 'next/navigation'
import {Loader} from './Loader'

export const FileInput = () => {
    const [isUploading, setIsUploading] = useState(false)
    const router = useRouter()
    async function upload(ev: ChangeEvent<HTMLInputElement>) {
        ev.preventDefault()
        const files = ev.target.files
        if (!files) {
            return
        }
        if (files.length > 0) {
            const file = files[0]
            setIsUploading(true)
            const res = await axios.postForm('/api/upload', {
                file
            })
            setIsUploading(false)
            const newName = res.data.newName;
            router.push(`/${newName}`);
        }
    }

    return (
        <>
            {isUploading ? (
                <div className="flex justify-center items-center flex-col text-center mx-auto gap-4">
                    <h3 className='text-white/60'>Uploading, please wait...</h3>
                    <Loader />
                </div>
            ) : (
                <label className="inline-flex gap-2 bg-purple-600 py-2 px-4 rounded-full shadow-lg cursor-pointer">
                    <UploadIcon className="size-6" />
                    <span>Upload Video</span>
                    <input onChange={upload} type="file" className="hidden" />
                </label>
            )}
        </>
    )
}

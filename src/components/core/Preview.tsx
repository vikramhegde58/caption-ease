import {useCallback, useEffect, useRef, useState} from 'react'
import {FlashIcon} from '../icons/FlashIcon'
import {FFmpeg} from '@ffmpeg/ffmpeg'
import {fetchFile, toBlobURL} from '@ffmpeg/util'
import {TranscriptionItemType} from '@/app/[fileName]/page'
import {getSrt} from '@/utils/utils'
// @ts-ignore
import roboto from '../../fonts/Roboto-Regular.ttf'
// @ts-ignore
import robotoBold from '../../fonts/Roboto-Bold.ttf'

const BASE_URL = 'https://vikram-caption-ease.s3.eu-north-1.amazonaws.com'

export const Preview = ({
    fileName,
    transcriptionItems
}: {
    fileName: string
    transcriptionItems: TranscriptionItemType[]
}) => {
    const [loaded, setLoaded] = useState(false)
    const ffmpegRef = useRef(new FFmpeg())
    const videoRef = useRef<HTMLVideoElement>(null)
    const [currentSubtitle, setCurrentSubtitle] = useState('')
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        load()
        videoRef.current?.addEventListener('timeupdate', handleTimeUpdate)
        return () => {
            videoRef.current?.removeEventListener('timeupdate', handleTimeUpdate)
        }
    }, [])

    const handleTimeUpdate = useCallback(() => {
        const currentTime = videoRef.current?.currentTime
        if (currentTime) {
            const subtitle = transcriptionItems.find(
                item => +item.start_time <= currentTime && +item.end_time >= currentTime
            )
            setCurrentSubtitle(subtitle?.alternatives[0].content || '')
        }
    }, [setCurrentSubtitle])

    const load = async () => {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
        const ffmpeg = ffmpegRef.current
        ffmpeg.on('log', ({message}) => {
            console.log(message)
        })
        ffmpeg.on('progress', ev => {
            setProgress(ev.progress)
        })
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
        })
        await ffmpeg.writeFile('./tmp/roboto.ttf', await fetchFile(roboto))
        await ffmpeg.writeFile('./tmp/roboto-bold.ttf', await fetchFile(robotoBold))
        setLoaded(true)
    }

    const transcode = async () => {
        setProgress(0)
        const ffmpeg = ffmpegRef.current
        await ffmpeg.writeFile(fileName, await fetchFile(`${BASE_URL}/${fileName}`))
        await ffmpeg.writeFile('output.srt', getSrt(transcriptionItems))
        await ffmpeg.exec([
            '-i',
            fileName,
            '-preset',
            'ultrafast',
            '-f',
            'mp4',
            '-vf',
            `subtitles=output.srt:fontsdir=/tmp:force_style='Fontname=Roboto Bold,PrimaryColour=&H00FFFFF&,SecondaryColour=&H00000FF&,FontSize=30,MarginV=100'`,
            'output.mp4'
        ])
        const data = (await ffmpeg.readFile('output.mp4')) as Uint8Array
        if (videoRef.current) {
            videoRef.current.src = URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}))
        }
    }

    return (
        <>
            <button
                onClick={transcode}
                className="inline-flex gap-2 bg-purple-600 py-2 px-4 mt-8 rounded-full shadow-lg cursor-pointer">
                <FlashIcon className="size-6" />
                <span>Apply</span>
            </button>
            <div className="relative h-[480px] text-center">
                <h3 className="absolute text-white/70 w-full text-xl text-center top-72 bold">
                    {currentSubtitle}
                </h3>
                {!!(progress && progress < 1) && (
                    <div className="flex items-center justify-center absolute w-full h-full bg-black/30 rounded-xl">
                        <div className="flex justify-center absolute w-[80%] h-6 bg-sky-700 mx-4">
                            <div
                                className="absolute top-0 left-0 h-6 bg-sky-500"
                                style={{width: `${progress * 100}%`}}></div>
                            <h2 className="z-10 text-white/70 text-center text-sm my-auto">
                                {parseInt((progress * 100).toString())}%
                            </h2>
                        </div>
                    </div>
                )}
                <video
                    ref={videoRef}
                    className="my-2 rounded-xl shadow-2xl shadow-sky-600 top-0 h-[480px] w-full"
                    controls
                    src={`${BASE_URL}/${fileName}`}
                />
            </div>
        </>
    )
}

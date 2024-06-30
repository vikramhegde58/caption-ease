'use client'
import {Loader} from '@/components/core/Loader'
import {Preview} from '@/components/core/Preview'
import {Transcription} from '@/components/core/Transcription'
import axios from 'axios'
import {useEffect, useState} from 'react'

export type TranscriptionItemType = {
    type: string
    alternatives: {
        confidence: string
        content: string
    }[]
    start_time: string
    end_time: string
}

export default function VideoPage(props: {params: {fileName: string}}) {
    const fileName = props.params.fileName
    const [transcriptionItems, setTranscriptionItems] = useState<TranscriptionItemType[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchTranscription = () => {
        setIsLoading(true)
        axios.get(`api/transcribe?fileName=${fileName}`).then(response => {
            const status = response.data.status
            const transcription = response.data.transcription
            const error = response.data.error
            let timeout
            if (status === 'COMPLETED') {
                clearTimeout(timeout)
                setIsLoading(false)
                transcription.results.items.forEach((item: any, index: number) => {
                    if (!item.start_time) {
                        transcription.results.items[index - 1].alternatives[0].content +=
                            item.alternatives[0].content
                    }
                    return item
                })
                const transcriptions = transcription.results.items.filter(
                    (itm: any) => itm.start_time
                )
                setTranscriptionItems(transcriptions)
            } else if (status === 'IN_PROGRESS') {
                timeout = setTimeout(() => {
                    fetchTranscription()
                }, 2000)
            }
        })
    }
    useEffect(() => {
        fetchTranscription()
    }, [fileName])

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center gap-4 my-32">
                <div className="text-white/60">Generating transcription, please wait...</div>
                <Loader />
            </div>
        )
    }

    return (
        !!transcriptionItems.length && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                <div>
                    <h1 className="text-3xl text-white/70">Transcription</h1>
                    <Transcription transcriptionItems={transcriptionItems} />
                </div>
                <div>
                    <h1 className="text-3xl text-white/70">Preview</h1>
                    <Preview fileName={fileName} transcriptionItems={transcriptionItems} />
                </div>
            </div>
        )
    )
}

import {TranscriptionItemType} from '@/app/[fileName]/page'

const getSrtTime = (time: string) => {
    const d = new Date(parseFloat(time) * 1000)
    return d.toISOString().slice(11, 23).replace('.', ',')
}

export const getSrt = (transcriptionItems: TranscriptionItemType[]) => {
    let srt = ''
    let i = 1
    transcriptionItems.forEach(item => {
        srt += `${i++}\n${getSrtTime(item.start_time)} --> ${getSrtTime(item.end_time)}\n${item.alternatives[0].content}\n\n`
    })
    return srt
}

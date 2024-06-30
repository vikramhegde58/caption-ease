import { TranscriptionItemType } from '@/app/[fileName]/page'
import {TranscriptionItem} from './TranscriptionItem'

export const Transcription = ({
    transcriptionItems
}: {
    transcriptionItems: TranscriptionItemType[]
}) => {
    return (
        <div className="my-8 h-[530px] overflow-auto shadow-2xl shadow-sky-600">
            <div className="grid grid-cols-3 sticky top-0 bg-violet-600 p-2 rounded-md">
                <h2>Text</h2>
                <h2>Start Time</h2>
                <h2>End Time</h2>
            </div>
            {transcriptionItems.map(item => (
                <TranscriptionItem key={item.start_time} item={item} />
            ))}
        </div>
    )
}

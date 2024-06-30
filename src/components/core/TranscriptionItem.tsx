import {TranscriptionItemType} from '@/app/[fileName]/page'
import {useForceUpdate} from '@/hooks/useForceUpdate'

export const TranscriptionItem = ({item}: {item: TranscriptionItemType}) => {
    const forceUpdate = useForceUpdate()
    const setProperty = (key: string, value: string) => {
        if (key === 'content') {
            item.alternatives[0].content = value
        } else {
            ;(item as any)[key] = value
        }
        forceUpdate()
    }
    return (
        <div className="grid grid-cols-3 gap-1 my-1 text-white/90" key={item.start_time}>
            <input
                className="bg-purple-600 p-1 rounded-md text-white/90"
                type="text"
                value={item.alternatives[0].content}
                onChange={e => setProperty('content', e.target.value)}
            />
            <input
                className="bg-purple-600 p-1 rounded-md text-white/60"
                type="text"
                value={item.start_time}
                onChange={e => setProperty('start_time', e.target.value)}
            />
            <input
                className="bg-purple-600 p-1 rounded-md text-white/60"
                type="text"
                value={item.end_time}
                onChange={e => setProperty('end_time', e.target.value)}
            />
        </div>
    )
}

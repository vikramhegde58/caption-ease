import {PageTitle} from '@/components/core/PageTitle'

export default function Pricing() {
    return (
        <div>
            <PageTitle
                title="Checkout our pricing"
                description="Find the suitable pricing option for you"
            />
            <div className="w-4/12 text-center bg-white rounded-lg p-2 mx-auto shadow-xl">
                <h2 className="text-black text-lg">Free</h2>
                <h3 className="text-black/60">Free Forever</h3>
            </div>
        </div>
    )
}

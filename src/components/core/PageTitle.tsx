export const PageTitle = ({title, description}: {title: string; description: string}) => {
    return (
        <section className="text-center mt-24 mb-12">
            <h1 className="text-3xl my-2">{title}</h1>
            <h2 className="text-xl text-white/75">{description}</h2>
        </section>
    )
}

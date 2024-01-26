import React from 'react'


type Props = {
    params: { module: string }
}

export default function ModulePage({ params: { module } }: Props) {



    return (
        <>module {module} Page </>
    )
}


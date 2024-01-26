import MRTTable from '@/components/table'
import { Flex, Title } from '@mantine/core'
import { MRT_ColumnDef } from 'mantine-react-table'
import React, { useMemo } from 'react'


type Props = {
    params: { specialty: string }
}

export default function SpecialtyPage({ params: { specialty } }: Props) {


    const data: any[] = [
        {
            moduleName: 'AI',
            folderName: 'computer_science/AI',
        },
        {
            moduleName: 'algorithm',
            folderName: 'chemistry',

        },
    ]

    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            {
                header: 'Module',
                accessorKey: 'moduleName',
            },
            {
                header: 'Folder',
                accessorKey: 'folderName',
            },
        ],
        [],
    );


    return (

        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Flex py={'md'}   >
                <Title order={1} >
                    {specialty.replaceAll('%20', ' ')}
                </Title>
            </Flex>

            <MRTTable columns={columns} data={data} />

        </main>

    )
}


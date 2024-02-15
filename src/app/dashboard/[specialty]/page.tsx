import { Container, Flex, Title } from '@mantine/core'
import { createPagesBrowserClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { MRT_ColumnDef } from 'mantine-react-table'
import React, { useMemo } from 'react'
import { cookies } from 'next/headers'
import ModuleTable from '@/components/modulesTable'

type Props = {
    params: { specialty: string }
}

// export const revalidate = 'force-dynamic ; 

export async function generateStaticParams() {

    const supabase = createPagesBrowserClient();

    let { data } = await supabase.from('specialty')
        .select('*')


    const params = data?.map(sp => { return { specialty: sp.specialty_id as string } })


    return params ? params : []
}




export default async function SpecialtyPage({ params: { specialty } }: Props) {



    const supabase = createServerComponentClient({ cookies });


    let { data } = await supabase.from('module')
        .select('*')
        .eq('specialty_id', specialty)
        .eq('isInTrash', false)
        .order('created_at')

    let { data: specialtyName } = await supabase.from('specialty')
        .select('specialty_name')
        .eq('specialty_id', specialty)
        .eq('isInTrash', false)
        .order('created_at')
        .single()






    const columns = [
        {
            header: 'Module ID',
            accessorKey: 'module_id',
        },
        {
            header: 'Folder ID',
            accessorKey: 'folder_id',
        },
        {
            header: 'Module',
            accessorKey: 'module_name',
        },
        {
            header: 'Folder',
            accessorKey: 'folder_name',
        },
    ]


    return (
        <>
            <main >
                <Container size={'xl'}>
                    <div style={{ padding: '16px 0px' }} >
                        <Flex py={'md'}   >
                            <Title order={1} >
                                {specialtyName?.specialty_name}
                            </Title>
                        </Flex>
                    </div>


                    <div className='md:w-11/12 mx-auto w-screen'    >

                        <ModuleTable specialty_id={specialty} data={data || []} columns={columns} />

                    </div>

                </Container>

            </main>



        </>
    )
}


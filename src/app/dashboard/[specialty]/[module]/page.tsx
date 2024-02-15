import { Container, Flex, Title } from '@mantine/core'
import { createPagesBrowserClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { MRT_ColumnDef } from 'mantine-react-table'
import React, { useMemo } from 'react'
import { cookies } from 'next/headers'
import ModuleTable from '@/components/modulesTable'
import CourseTable from '@/components/coursesTable'

type Props = {
    params: { module: string }
}

// export const revalidate = 'force-dynamic ; 

// export async function generateStaticParams() {

//     const supabase = createPagesBrowserClient();

//     let { data } = await supabase.from('module')
//         .select('*')


//     const params = data?.map(sp => { return { module: sp.module_id as string } })


//     return params ? params : []
// }




export default async function ModulePage({ params: { module } }: Props) {



    const supabase = createServerComponentClient({ cookies });


    let { data } = await supabase.from('course')
        .select('*')
        .eq('module_id', module)
        // .eq('isInTrash', false)
        .order('created_at')

    let { data: ModuleName } = await supabase.from('module')
        .select('module_name')
        .eq('module_id', module)
        .eq('isInTrash', false)
        // .order('created_at')
        .single()






    const columns = [
        {
            header: 'course ID',
            accessorKey: 'course_id',
        },
        {
            header: 'Folder ID',
            accessorKey: 'file_id',
        },
        {
            header: 'course',
            accessorKey: 'course_name',
        },

    ]



    return (
        <>
            <main >
                <Container size={'xl'}>
                    <div style={{ padding: '16px 0px' }} >

                        <Flex py={'md'}   >

                            <Title order={1} >
                                {ModuleName?.module_name}
                            </Title>
                        </Flex>
                    </div>


                    <div className='md:w-11/12 mx-auto w-screen'    >

                        <CourseTable module_id={module} data={data || []} columns={columns} />

                    </div>
                </Container>


            </main>



        </>
    )
}



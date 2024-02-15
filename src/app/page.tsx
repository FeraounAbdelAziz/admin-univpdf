import SpecialtyTable from '@/components/specialtyTable';
import { Box, Container, Flex, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { MRT_ColumnDef } from 'mantine-react-table';
import { cookies } from 'next/headers';
import { useMemo } from 'react';


interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {


  const search = searchParams.q ?? '';





  const supabase = createServerComponentClient({ cookies })


  let { data, error } = await supabase
    .from('specialty_with_url_view')
    .select('folder_name, folder_id, specialty_name, specialty_id, specialty_description, image_url')
    .eq('isInTrash', false)
    .order('created_at')






  if (error) {
    throw Error;
  }






  // const data: any[] = [
  //   {
  //     specialtyName: 'computer science',
  //     folderName: 'computer_science',
  //   },
  //   {
  //     specialtyName: 'chemistry',
  //     folderName: 'chemistry',

  //   },
  // ]


  console.log(data)







  return (
    <main >

      <Container size={'xl'}
      >
        <div style={{ padding: '16px 0px' }} >
          <Flex py={'md'}   >
            <Title order={1} >
              Specialties
            </Title>
          </Flex>
        </div>
        <div    >
          <SpecialtyTable data={data as any} />
        </div>
      </Container>
    </main>
  );
}

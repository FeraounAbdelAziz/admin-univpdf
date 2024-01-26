import MRTTable from '@/components/table';
import { Flex, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { MRT_ColumnDef } from 'mantine-react-table';
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



  const data: any[] = [
    {
      specialtyName: 'computer science',
      folderName: 'computer_science',
    },
    {
      specialtyName: 'chemistry',
      folderName: 'chemistry',

    },
  ]

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        header: 'Specialty',
        accessorKey: 'specialtyName',
      },
      {
        header: 'Folder',
        accessorKey: 'folderName',
      },
    ],
    [],
  );




  return (
    <main >

      <div className="p-4 mx-auto max-w-7xl" >
        <Flex py={'md'}   >
          <Title order={1} >
            Specialties
          </Title>
        </Flex>
      </div>
      <div className='md:w-11/12 mx-auto w-screen'    >
        <MRTTable columns={columns} data={data} />
      </div>

    </main>
  );
}

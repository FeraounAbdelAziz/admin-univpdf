'use client'
import { useMemo } from 'react';
import { Box, Button, Menu, Stack } from '@mantine/core';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import { IconArrowLeftRight, IconArrowRight, IconPlus, IconShare } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@mantine/hooks';


type Props = {
  columns: MRT_ColumnDef<any>[]
  data: any[]

}

export default function MRTTable({ columns, data }: Props) {



  const router = useRouter()



  // const sm = useMediaQuery('(min-width: --mantine-breakpoint-md)')

  const sm = useMediaQuery('(min-width:	36em)');

  // const matches = useMediaQuery('(min-width: 56.25em)');




  const table = useMantineReactTable(

    {
      columns,
      data,
      enableColumnResizing: true,
      createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
      editDisplayMode: 'modal',
      enableEditing: true,
      enableStickyHeader: true,
      enableStickyFooter: true,
      
      renderTopToolbarCustomActions: ({ table }) => (
        <>
          <Button


            onClick={() => {
              table.setCreatingRow(true);
            }}


          >
            {!sm ? <IconPlus /> : "Create New Specialty"}


          </Button>
        </>
      ),
      renderRowActionMenuItems: ({ table, row, staticRowIndex }) => (
        <>
          <Menu.Item
            onClick={() => {

              //? fixme 
              router.replace(`/dashboard/${row.getValue('folderName')}`)
            }}
            leftSection={<IconArrowRight />} >go to {row.getValue('folderName')} folder </Menu.Item>
        </>
      ),

      initialState: {
        expanded: true,
        pagination: { pageIndex: 0, pageSize: 5 },
      },

      // mantineTableContainerProps: { style: { maxHeight: 700 } },

    });




  return <MantineReactTable table={table} />;
};


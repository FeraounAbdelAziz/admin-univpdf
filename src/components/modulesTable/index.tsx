'use client'
import { useState, useTransition } from 'react';
import { Alert, Button, Group, LoadingOverlay, Menu, Modal, TextInput, Textarea } from '@mantine/core';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import { IconAlertCircle, IconArrowRight, IconPlus, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { isNotEmpty, useForm } from '@mantine/form';
import { createSpecialty, removeSpecialty, updateSpecialty } from '@/utils/specialtyAPI';
import { createModule, removeModule, updateModule } from '@/utils/moduleAPI';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';


type Props = {
  columns: MRT_ColumnDef<any>[]
  data: any[]
  specialty_id: string;
}



export default function ModuleTable({ columns, data, specialty_id }: Props) {



  const router = useRouter()




  const sm = useMediaQuery('(min-width:	36em)');


  const [selectedFolderIdToDelete, setSelectedFolderIdToDelete] = useState<string | undefined>(undefined)

  const [modalDeleteOpened, { open: openModalDelete, close: closeModalDelete }] = useDisclosure()

  const [deleteIsPending, setDeleteTransition] = useTransition()


  const handleCreateModule = (values: {
    module_name: string;
    folder_name: string;
  }) => {



    createModule({ moduleFolderName: values.folder_name, moduleName: values.module_name, specialtyId: specialty_id })

    router.refresh()




  }

  const handleUpdateModule = (values: {
    folder_id: string
    module_name: string;
    folder_name: string;
  }) => {

    updateModule({
      folderId: values.folder_id, moduleFolderName: values.folder_name, moduleName: values.module_name,
    })
    router.refresh()

  }


  const handleDeleteFolder = () => {

    if (selectedFolderIdToDelete) {

      setDeleteTransition(() => {
        removeModule({ folderId: selectedFolderIdToDelete })
        closeModalDelete()
        router.refresh()

      })

    }


  }






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



      renderCreateRowModalContent: ({ table }) => {

        const [isPending, setTransition] = useTransition()

        const form = useForm(
          {
            initialValues: {

              module_name: '',
              folder_name: '',

            },
            validate: {
              module_name: isNotEmpty(),
            }

          }
        )



        return (<>

          <form onSubmit={form.onSubmit((values) => {

            setTransition(() => {
              handleCreateModule(values);
              table.setCreatingRow(null)
            })


          })

          } >
            <TextInput
              withAsterisk
              label="module name"
              placeholder="module name"
              {...form.getInputProps('module_name')}
            />

            <TextInput
              label="Folder name"
              placeholder="Folder name"
              {...form.getInputProps('folder_name')}
            />

            <Group justify="flex-end" mt="md">
              <Button disabled={isPending} type="submit">Submit</Button>
            </Group>
          </form>

          <LoadingOverlay visible={isPending} />

        </>)




      },

      renderEditRowModalContent: ({ table, row }) => {
        const [isPending, setTransition] = useTransition()

        const form = useForm(
          {
            initialValues: {
              folder_id: row.original.folder_id,
              module_name: row.original.module_name || "",
              folder_name: row.original.folder_name || "",
            },
            validate: {
              module_name: isNotEmpty()
            }

          })


        return (<>

          <form onSubmit={form.onSubmit((values) => {

            setTransition(() => {
              handleUpdateModule(values);
              table.setEditingRow(null)
            })


          })

          } >
            <TextInput
              withAsterisk
              label="Specialty name"
              placeholder="Specialty name"
              {...form.getInputProps('module_name')}
            />

            <TextInput
              label="Folder name"
              placeholder="Folder name"
              {...form.getInputProps('folder_name')}
            />

            <Group justify="flex-end" mt="md">
              <Button disabled={isPending} type="submit">Submit</Button>
            </Group>
          </form>

          <LoadingOverlay visible={isPending} />

        </>)



      },


      renderTopToolbarCustomActions: ({ table }) => (
        <>
          <Button
            onClick={() => {
              table.setCreatingRow(true);
              // openCreateSpecialty()
            }}

          >
            {!sm ? <IconPlus /> : "Create New module"}
          </Button>
        </>
      ),
      renderRowActionMenuItems: ({ row }) => (
        <>
          <Menu.Item


            // onClick={() => {
            //   router.push(`${row.original.module_id}`)
            // }}
            component={Link}
            href={`${specialty_id}/${row.original.module_id}`}

            leftSection={<IconArrowRight />} >open folder</Menu.Item>
          <Menu.Item
            onClick={() => {

              setSelectedFolderIdToDelete(row.original.folder_id)

              openModalDelete()

            }}
            leftSection={<IconTrash color='red' />} >delete</Menu.Item>
        </>
      ),



      initialState: {
        expanded: true,
        pagination: { pageIndex: 0, pageSize: 5 },
      },

      // mantineTableContainerProps: { style: { maxHeight: 700 } },

    });



  return (<>
    <Modal opened={modalDeleteOpened} onClose={() => {

      closeModalDelete();
      setSelectedFolderIdToDelete(undefined);

    }}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}


      padding={0}

      withCloseButton={false}

    >

      <Alert variant="light" color="red" title="Confirm Action" icon={<IconAlertCircle />}>
        Are you sure you want to move to trash this folder all the related information inside the folder will moved to trash also
        <Group justify='end' mt={'md'} p={'xs'} >
          <Button
            onClick={() => {
              closeModalDelete();
              setSelectedFolderIdToDelete(undefined);
            }}

            variant='white' >cancel</Button>
          <Button color="red"
            onClick={() => {


              handleDeleteFolder()


            }}
          >confirm</Button>
        </Group>
      </Alert>
      <LoadingOverlay visible={deleteIsPending} />

    </Modal>
    <MantineReactTable table={table} />
  </>
  );
};



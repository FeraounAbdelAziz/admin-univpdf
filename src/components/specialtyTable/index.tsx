'use client'
import { useState, useTransition } from 'react';
import { Alert, Box, Button, Group, Image, LoadingOverlay, Menu, Modal, Stack, TextInput, Textarea } from '@mantine/core';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import { IconAlertCircle, IconArrowLeftRight, IconArrowRight, IconInfoCircle, IconPlus, IconShare, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useDisclosure, useForceUpdate, useMediaQuery } from '@mantine/hooks';
import { isNotEmpty, useForm } from '@mantine/form';
import { addImageToSpecialty, createSpecialty, removeSpecialty, updateSpecialty } from '@/utils/specialtyAPI';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import UploadImages from './uploadImage';
import { FileWithPath } from '@mantine/dropzone';


type Props = {
  data: any[]

}

export default function SpecialtyTable({ data }: Props) {



  const router = useRouter()




  const sm = useMediaQuery('(min-width:	36em)');


  const [selectedFolderIdToDelete, setSelectedFolderIdToDelete] = useState<string | undefined>(undefined)
  const [modalDeleteOpened, { open: openModalDelete, close: closeModalDelete }] = useDisclosure()

  const [deleteIsPending, setDeleteTransition] = useTransition()




  const handleCreateSpecialty = async (
    values: {
      specialty_name: string;
      folder_name: string;
      specialty_description: string
    }

    , files: FileWithPath[]) => {



    const specialty = await createSpecialty({ specialtyName: values.specialty_name, folderName: values.folder_name, specialtyDescription: values.specialty_description })




    if (specialty) {
      try {
        const file = files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const supabase = createClientComponentClient()


        const { error: uploadError, data } = await supabase.storage
          .from('specialty_image')
          .upload(filePath, file) as { error: any | null, data: any | null };

        if (data) {


          await addImageToSpecialty({ image_id: data.id, specialty_id: specialty.specialty_id })


        }




        if (uploadError) {
          throw uploadError
        }

      } catch (error: any) {

      }

    }



    router.refresh()
  }



  const handleUpdateSpecialty = async(values: {
    specialty_id: string,
    folder_id: string
    specialty_name: string;
    folder_name: string;
    specialty_description: string
  }, files: FileWithPath[] | []) => {
    updateSpecialty({ specialtyName: values.specialty_name, folderName: values.folder_name, specialtyDescription: values.specialty_description, folderId: values.folder_id })


    if (files.length > 0) {
      try {
        const file = files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const supabase = createClientComponentClient()


        const { error: uploadError, data } = await supabase.storage
          .from('specialty_image')
          .upload(filePath, file) as { error: any | null, data: any | null };

        if (data) {


          await addImageToSpecialty({ image_id: data.id, specialty_id: values.specialty_id })


        }




        if (uploadError) {
          throw uploadError
        }

      } catch (error: any) {

      }

    }




    router.refresh()

  }


  const handleDeleteFolder = () => {

    if (selectedFolderIdToDelete) {

      setDeleteTransition(() => {
        removeSpecialty({ folderId: selectedFolderIdToDelete })
        closeModalDelete()
        router.refresh()

      })

    }


  }


  const columns: MRT_ColumnDef<any>[] = [
    {
      header: 'Specialty Id',
      accessorKey: 'specialty_id'
    },
    {
      header: 'Folder Id',
      accessorKey: 'folder_id'
    },
    {
      header: 'Specialty',
      accessorKey: 'specialty_name',
    },
    {
      header: 'Folder',
      accessorKey: 'folder_name',
    },
    {
      header: 'Description',
      accessorKey: 'specialty_description'
    }, {
      header: 'image url',
      accessorKey: 'image_url',
      Cell: ({ row }) => (
        <Box>
          <Image
            alt="avatar"
            src={row.original.image_url}
          />
        </Box>
      ),
    }

  ]





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


        const [files, setFiles] = useState<FileWithPath[] | []>([])


        const form = useForm(
          {
            initialValues: {

              specialty_name: '',
              folder_name: '',
              specialty_description: '',
            },
            validate: {
              specialty_name: isNotEmpty(),
            }

          }
        )



        return (<>

          <form onSubmit={form.onSubmit((values) => {

            setTransition(() => {

              files.length > 0 && handleCreateSpecialty(values, files);

              table.setCreatingRow(null)
            })


          })

          } >
            <TextInput
              withAsterisk
              label="Specialty name"
              placeholder="Specialty name"
              {...form.getInputProps('specialty_name')}
            />

            <TextInput
              label="Folder name"
              placeholder="Folder name"
              {...form.getInputProps('folder_name')}
            />
            <Textarea
              label="Specialty Description"
              placeholder="Specialty Description"
              {...form.getInputProps('specialty_description')}
            />

            <UploadImages file={files} setFile={setFiles} />

            <Group justify="flex-end" mt="md">
              <Button disabled={isPending} type="submit">Submit</Button>
            </Group>
          </form>

          <LoadingOverlay visible={isPending} />

        </>)




      },

      renderEditRowModalContent: ({ table, row }) => {
        const [isPending, setTransition] = useTransition()
        const [files, setFiles] = useState<FileWithPath[] | []>([])


        const form = useForm(
          {
            initialValues: {
              specialty_id: row.original.specialty_id,
              folder_id: row.original.folder_id,
              specialty_name: row.original.specialty_name || "",
              folder_name: row.original.folder_name || "",
              specialty_description: row.original.specialty_description || "",
            },
            validate: {
              specialty_name: isNotEmpty()
            }

          })


        return (<>

          <form onSubmit={form.onSubmit((values) => {

            setTransition(() => {


              handleUpdateSpecialty(values, files);
              table.setEditingRow(null)


            })


          })

          } >
            <TextInput
              withAsterisk
              label="Specialty name"
              placeholder="Specialty name"
              {...form.getInputProps('specialty_name')}
            />

            <TextInput
              label="Folder name"
              placeholder="Folder name"
              {...form.getInputProps('folder_name')}
            />
            <Textarea
              label="Specialty Description"
              placeholder="Specialty Description"
              {...form.getInputProps('specialty_description')}
            />


            <UploadImages file={files} setFile={setFiles} />


            {files.length == 0 && < Image
              mt={'md'}
              src={row.original.image_url}
            />}


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
            {!sm ? <IconPlus /> : "Create New Specialty"}
          </Button>
        </>
      ),


      renderRowActionMenuItems: ({ row }) => (
        <>
          <Menu.Item
            onClick={() => {
              router.push(`/dashboard/${row.original.specialty_id}`)
            }}
            leftSection={<IconArrowRight />} >open folder</Menu.Item>
          <Menu.Item
            onClick={() => {

              // router.push(`/dashboard/${row.original.specialty_id}`)
              setSelectedFolderIdToDelete(row.original.folder_id)

              openModalDelete()

            }}
            leftSection={<IconTrash color='red' />} >delete</Menu.Item>
        </>
      ),





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




'use client'
import { useEffect, useState, useTransition } from 'react';
import { ActionIcon, Alert, AspectRatio, Badge, Box, Button, Center, Divider, Flex, Group, Image, Indicator, Loader, LoadingOverlay, Menu, Modal, Overlay, RingProgress, SimpleGrid, Text, TextInput, Textarea, Title, rem } from '@mantine/core';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import { IconAlertCircle, IconArrowRight, IconError404, IconFileAlert, IconFileTypePdf, IconPlus, IconShare, IconTrash, IconUpload, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { isNotEmpty, useForm } from '@mantine/form';
import { removeModule, updateModule } from '@/utils/moduleAPI';
import { DropzoneButton } from '../dropZone';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import axios from 'axios'
import { FileWithPath } from '@mantine/dropzone';
import { IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import RowEdit from './rowEdit';


type Props = {
  columns: MRT_ColumnDef<any>[]
  data: any[]
  module_id: string;
}




export default function CourseTable({ columns, data, module_id }: Props) {



  const router = useRouter()




  const sm = useMediaQuery('(min-width:	36em)');


  const [selectedFolderIdToDelete, setSelectedFolderIdToDelete] = useState<string | undefined>(undefined)

  const [modalDeleteOpened, { open: openModalDelete, close: closeModalDelete }] = useDisclosure()

  const [deleteIsPending, setDeleteTransition] = useTransition()


  // const [files, setFiles] = useState<File[] | []>([]);

  const [fileUploading, setFileUploading] = useState<{ file: FileWithPath, progress: number }[] | []>([])






  const handleCreateCourse = async () => {


    const supabase = createClientComponentClient();

    const { data: { session } } = await supabase.auth.getSession()

    try {
      let { data: folder, error } = await supabase.from('module').select('folder_id').eq('module_id', module_id).single()

      if (error) {
        throw Error
      }



      fileUploading.map(async ({ file }) => {
        const metadata = {
          name: file.name,
          parents: [folder?.folder_id],
        };
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', file);


        notifications.show({
          id: `${file.name + file.path}`,
          // loading: true,
          message: 'uploading',
          icon: <IconUpload />,
          autoClose: false,
          withCloseButton: false,
        })



        await axios.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', form, {
          headers: {
            Authorization: `Bearer ${session?.provider_token}`,
          },
          onUploadProgress({ loaded, total }) {
            if (total && loaded && total > 0 && loaded > 0) {
              const percentage = Math.round((loaded / total) * 100);


              notifications.update({
                id: `${file.name + file.path}`,
                loading: percentage < 100 ? true : false,

                message: percentage < 100 ? `uploading ${percentage}%` : `uploaded successfully ${percentage}%`,

                autoClose: percentage < 100 ? false : true,

                withCloseButton: percentage < 100 ? false : true,
              })

              setFileUploading(prevFileUploading => {
                const updatedUploading = prevFileUploading.map(f => {
                  if (f.file.name !== file.name && f.file.path !== file.path) {
                    return f;
                  } else {
                    return {
                      ...f,
                      progress: percentage,
                    };
                  }
                });
                return updatedUploading;
              });

            }
          },

        }
        ).then(async (res) => {



          await supabase
            .from('course')
            .insert([
              { course_name: res.data.name, file_id: res.data.id, module_id: module_id },
            ])

          router.refresh()


        }).catch(e => {

          notifications.update({
            id: `${file.name + file.path}`,
            loading: false,

            message: 'uploading fail',

            icon: <IconFileAlert />,
            color: 'red',
            autoClose: true,

            withCloseButton: true,
          })


        })



        router.refresh()
        console.log('upload all is end')







      })







    } catch (err) {
      throw err;

    }











  }


  const handleUpdateModule = (values: {
    folder_id: string
    course_name: string;
    folder_name: string;
  }) => {

    updateModule({
      folderId: values.folder_id, moduleFolderName: values.folder_name, moduleName: values.course_name,
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





  const previews = fileUploading.map(({ file, progress }, index) => {

    return (
      <Indicator key={index} disabled={progress == 100} size={'md'} color='white' label={<ActionIcon size={'md'} >
        <IconX size={'xs'}  ></IconX>
      </ActionIcon>}>
        <AspectRatio>

          <Overlay p={10} color="#000" backgroundOpacity={0.30} >

            <RingProgress

              thickness={3}
              label={


                <>

                  {progress < 100 ?
                    <Flex direction={'column'} gap={'xs'} style={{ overflow: 'hidden' }} align={'center'}  >
                      <Text size='sm' ta="center" lineClamp={1} >{file.name} </Text>
                      <Badge color="blue" radius="xs">{progress} %</Badge>
                    </Flex>
                    :
                    <Center>
                      <Flex direction={'column'} gap={0} style={{ overflow: 'hidden' }} align={'center'}  >

                        <Text size='sm' ta="center" lineClamp={1} >{file.name} </Text>
                        <ActionIcon color="teal" variant="filled" radius="xl" >
                          <IconCheck style={{ width: rem(22), height: rem(22) }} />
                        </ActionIcon>
                      </Flex>
                    </Center>
                  }
                </>



              }
              sections={[
                { value: progress, color: 'blue' },
              ]}
            />

          </Overlay>


          <Image alt='pdf-image' src={`https://www.iconpacks.net/icons/2/free-pdf-upload-icon-2619-thumb.png`} />

        </AspectRatio>
      </Indicator>
    )

  });


  const [uploadingInProgress, setUploadingInProgress] = useState(false)



  useEffect(() => {

    const test = fileUploading.every(file => file.progress === 100)

    if (test) {
      setUploadingInProgress(false)




      // setFileUploading(()=>[])

    }

  }, [fileUploading])


  const table = useMantineReactTable(

    {
      columns,
      data,
      enableColumnResizing: true,
      createDisplayMode: 'modal',

      mantineCreateRowModalProps: {
        size: 'lg',
        withCloseButton: true,
      },
      editDisplayMode: 'modal',
      enableEditing: true,
      enableStickyHeader: true,
      enableStickyFooter: true,



      renderCreateRowModalContent: ({ table }) => {

        const [isPending, setTransition] = useTransition()



        return (<>


          <DropzoneButton disabled={isPending || uploadingInProgress} filesExtern={fileUploading} setFiles={setFileUploading} />





          <Divider />
          <SimpleGrid
            cols={{ base: 2, sm: 4 }} mt={previews.length > 0 ? 'xl' : 0}>
            {previews}
          </SimpleGrid>




          <Group justify="flex-end" mt="md"  >
            <Button disabled={uploadingInProgress || fileUploading.every(file => file.progress === 100)} onClick={() => { setUploadingInProgress(true);; setTransition(() => { handleCreateCourse() }) }} type="submit">Submit</Button>
          </Group>

          <LoadingOverlay visible={isPending} />

        </>)




      },

      renderEditRowModalContent: ({ table, row }) => {


        return <RowEdit table={table} row={row}/>





      },


      renderTopToolbarCustomActions: ({ table }) => (
        <>
          <Button
            onClick={() => {
              table.setCreatingRow(true);
              // openCreateSpecialty()
            }}

          >
            {!sm ? <IconPlus /> : "add New course"}
          </Button>
        </>
      ),
      renderRowActionMenuItems: ({ row }) => (
        <>
          <Menu.Item


            // onClick={() => {
            //   router.push(`${row.original.module_id}`)
            // }}
            // component={Link}
            // href={`${specialty_id}/${row.original.module_id}`}

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



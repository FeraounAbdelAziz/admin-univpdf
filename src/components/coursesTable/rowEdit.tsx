import { Button, Group, LoadingOverlay, TextInput } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { MRT_Row, MRT_TableInstance } from 'mantine-react-table'
import React, { useTransition } from 'react'



type Props = { 
    table: MRT_TableInstance<any>
    row: MRT_Row<any>

}


export default function RowEdit({row, table} : Props) {
    const [isPending, setTransition] = useTransition()
    const form = useForm(
      {
        initialValues: {
          folder_id: row.original.folder_id,
          course_name: row.original.module_name || "",
          folder_name: row.original.folder_name || "",
        },
        validate: {
          course_name: isNotEmpty()
        }

      })


    return (<>

      <form onSubmit={form.onSubmit((values) => {

        setTransition(() => {
        //   handleUpdateModule(values);
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

}

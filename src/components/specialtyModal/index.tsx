import { useToggle, upperFirst } from '@mantine/hooks';
import { isNotEmpty, useForm } from '@mantine/form';
import {
    TextInput,
    PasswordInput,
    Text,
    Paper,
    Group,
    PaperProps,
    Button,
    Divider,
    Checkbox,
    Anchor,
    Stack,
    Modal,
    Flex,
} from '@mantine/core';

type Props = {


    opened: boolean
    close: () => void

}



export function SpecialtyModal({ opened, close }: Props) {


    const form = useForm({
        initialValues: {
            folderName: '',
            specialtyName: ''
        },

        validate: {
            folderName: isNotEmpty(''),
            specialtyName: isNotEmpty(),
        },
    });

    return (
        <Modal
            opened={opened}
            centered
            onClose={close}
            closeOnClickOutside={false}
            withCloseButton
            title="create module folder">
            <Paper radius="md" p="xl" >


                <form onSubmit={form.onSubmit(() => { })}>
                    <Stack>


                        <TextInput
                            // required
                            withAsterisk
                            label="Folder name"
                            placeholder="folder name"
                            value={form.values.folderName}

                            onChange={(event) => form.setFieldValue('folderName', event.currentTarget.value)}

                            error={form.errors.folderName && 'Invalid folder name'}

                            radius="md"
                        />

                        <TextInput
                            withAsterisk
                            // required
                            label="specialty name (displayed for the user)"
                            placeholder="specialty name"
                            value={form.values.specialtyName}
                            onChange={(event) => form.setFieldValue('specialtyName', event.currentTarget.value)}
                            error={form.errors.specialtyName && 'Invalid specialty name'}
                            radius="md"
                        />


                    </Stack>

                    <Flex justify='end' mt={'lg'} >
                        <Button type="submit" radius="xl">
                            submit
                        </Button>
                    </Flex>
                </form>
            </Paper>
        </Modal>
    );
}
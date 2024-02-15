'use client';
import { Dispatch, SetStateAction, useRef } from 'react';
import { Text, Group, Button, rem, useMantineTheme } from '@mantine/core';
import { Dropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons-react';
import classes from './dropZone.module.css';
import { useSetState } from '@mantine/hooks';

type Props = {

    setFiles: Dispatch<SetStateAction<[] | {
        file: FileWithPath;
        progress: number;
    }[]>>

    filesExtern: [] | {
        file: FileWithPath;
        progress: number;
    }[]

    disabled: boolean



}


export function DropzoneButton({ setFiles, filesExtern, disabled }: Props) {


    const theme = useMantineTheme();


    const openRef = useRef<() => void>(null);

    return (
        <div className={classes.wrapper}>
            <Dropzone


                disabled={disabled}
                openRef={openRef}
                onDrop={(files) => {

                    let data: any[] = []

                    files.map(file => {
                        data.push({ file, progress: 0 })
                    })
                    setFiles(data)

                }}



                className={classes.dropzone}
                radius="md"
                accept={[MIME_TYPES.pdf]}
                maxSize={30 * 1024 ** 2}




            >
                <div style={{ pointerEvents: 'none' }}>
                    <Group justify="center">
                        <Dropzone.Accept>
                            <IconDownload
                                style={{ width: rem(50), height: rem(50) }}
                                color={theme.colors.blue[6]}
                                stroke={1.5}
                            />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                            <IconX
                                style={{ width: rem(50), height: rem(50) }}
                                color={theme.colors.red[6]}
                                stroke={1.5}
                            />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                            <IconCloudUpload style={{ width: rem(50), height: rem(50) }} stroke={1.5} />
                        </Dropzone.Idle>
                    </Group>

                    <Text ta="center" fw={700} fz="lg" mt="xl">
                        <Dropzone.Accept>Drop files here</Dropzone.Accept>
                        <Dropzone.Reject>Pdf file less than 30mb</Dropzone.Reject>
                        <Dropzone.Idle>Upload resume</Dropzone.Idle>
                    </Text>
                    <Text ta="center" fz="sm" mt="xs" c="dimmed">
                        Drag&apos;n&apos;drop files here to upload. We can accept only <i>.pdf</i> files that
                        are less than 30mb in size.
                    </Text>
                </div>
            </Dropzone>

            <Button
                disabled={disabled}
                className={classes.control} size="md" radius="xl" onClick={() => openRef.current?.()}>
                Select files
            </Button>
        </div>
    );
}
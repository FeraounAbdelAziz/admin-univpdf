'use client'

import { Text, Image, SimpleGrid, Indicator, ActionIcon } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { IconX } from '@tabler/icons-react';
import { Dispatch, SetStateAction, useState } from "react"


type Props = {
    file: [] | FileWithPath[],
    setFile: Dispatch<SetStateAction<[] | FileWithPath[]>>
}

export default function UploadImages({ file, setFile }: Props) {






    const imageUrl = file.length > 0 ? URL.createObjectURL(file[0]) : "";




    const previews = <Indicator disabled={file.length == 0} size={'md'} color='white' label={<ActionIcon
        onClick={() => {
            setFile([])
        }}

        size={'md'} >
        <IconX size={'xs'}  ></IconX>

    </ActionIcon>}>
        <Image src={imageUrl} />
    </Indicator>;



    return (
        <div  style={{  marginTop : '8px' }} >
            {file.length == 0 ? <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setFile}>
                <Text ta="center">Drop images here</Text>
            </Dropzone> : null}

            <SimpleGrid>

                {previews}


            </SimpleGrid>
        </div>
    );


}

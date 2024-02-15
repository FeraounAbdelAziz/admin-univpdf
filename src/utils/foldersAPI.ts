"use server"
import { cookies } from 'next/headers';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';

//? ADD 

export async function createFolder({ folderName }: { folderName: string }) {

    const supabase = createServerActionClient({ cookies })

    const { data: { session } } = await supabase.auth.getSession()

    try {
        const response = await fetch('https://www.googleapis.com/drive/v3/files', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session?.provider_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',

            }),
        })

        const data = await response.json();
        

    } catch (err) {
        throw err;

    }
}

//??? does't work in server side!
export async function createFile({ filename, file, parentId, }: { parentId: string, filename: string, file: string  }) {



    const supabase = createServerActionClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    try {




        const response = await fetch('https://www.googleapis.com/drive/v3/files?uploadType=media', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session?.provider_token}`,
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify({
                mimeType: 'application/pdf',
                name: `${filename}.pdf`,
                file: file,
            })
        })

        const data = await response.json();
        

    } catch (err) {
        throw err;

    }






}
//???




export async function createFolderInsideFolder(
    { fileName, parentId }: { fileName: string, parentId: string }) {

    const supabase = createServerActionClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    try {
        const response = await fetch(`https://www.googleapis.com/drive/v3/files`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session?.provider_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: fileName,
                parents: [parentId],
                mimeType: 'application/vnd.google-apps.folder',
            }),
        })

        const data = await response.json();

        

        return {
            kind: data.kind,
            id: data.id,
            name: data.name,
            mimeType: data.mimeType,
        }


    } catch (err) {
        throw err;

    }




}

export async function createFolderInsideRoot({ fileName }: { fileName: string }) {

    const supabase = createServerActionClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()


    const parentId = "1xfQk_VPRhiikRJlxjclN8mMDvbfTN4tQ"

    try {
        const response = await fetch('https://www.googleapis.com/drive/v3/files', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session?.provider_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: fileName,
                parents: [parentId],
                mimeType: 'application/vnd.google-apps.folder',
            }),
        })

        const data = await response.json();


        

        return {
            kind: data.kind,
            id: data.id,
            name: data.name,
            mimeType: data.mimeType,
        }


        // return data

    } catch (err) {
        throw err;

    }




}






//?






//? UPDATE 

export async function changeFileName({ newFileName, fileId }: { newFileName: string, fileId: string }) {

    const supabase = createServerActionClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    try {
        const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${session?.provider_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: newFileName,
                mimeType: 'application/vnd.google-apps.folder',
            }),
        })

        const data = await response.json();
        

    } catch (err) {
        throw err;

    }



}

export async function changeFileParent({ newParentId, fileId }: { newParentId: string, fileId: string }) {

    const supabase = createServerActionClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    try {
        const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?addParents=${newParentId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${session?.provider_token}`,
                // 'Content-Type': 'application/json',
            },
            // body: JSON.stringify({
            //     parents: [newParentId],
            // }),
        })

        const data = await response.json();
        

    } catch (err) {
        throw err;

    }



}

export async function moveToTrash({ folderId }: { folderId: string }) {

    const supabase = createServerActionClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()


    const trashId = '1lSLTT7k-xqTuDJh4ZyXJfrp2041_TBiT'

    const rootId = "1xfQk_VPRhiikRJlxjclN8mMDvbfTN4tQ"


    try {
        const response = await fetch(`https://www.googleapis.com/drive/v3/files/${folderId}?removeParents=${rootId}
        &addParents=${trashId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${session?.provider_token}`,
            },
        })

        const data = await response.json();

        console.log(data.error)

        return data.error.code;

    } catch (err) {


        //    return data.error.code;


    }


}

//?



//? GET 
export async function getFile({ fileId }: { fileId: string }) {




    const supabase = createServerActionClient({ cookies })

    const { data: { session } } = await supabase.auth.getSession()

    try {
        const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${session?.provider_token}`,
            },
        })
        const data = await response.json();
        

    } catch (err) {
        // TODO(developer) -  try refresh the session and restart attempt 

        console.log(err)

    }



}
export async function getAllRootFiles() {
    const supabase = createServerActionClient({ cookies })

    const { data: { session } } = await supabase.auth.getSession()

    try {
        const response = await fetch(`https://www.googleapis.com/drive/v3/files?q="1xfQk_VPRhiikRJlxjclN8mMDvbfTN4tQ"+in+parents&&fields=files(name ,+originalFilename,+kind,+id)`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${session?.provider_token}`,
            },
        })
        const data = await response.json();
        

    } catch (err) {
        // TODO(developer) -  try refresh the session and restart attempt 

        console.log(err)

    }
}
//?



//? DELETE 
export async function emptyTrash() {


    const supabase = createServerActionClient({ cookies })

    const { data: { session } } = await supabase.auth.getSession()


    try {

        await fetch('https://www.googleapis.com/drive/v3/files/trash', {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${session?.provider_token}`,
                'Content-Type': 'text/plain',

            },

        })



    } catch (err) {
        // TODO(developer) -  try refresh the session and restart attempt 


        console.log(err)




    }


}
export async function deleteFile({ fileId }: { fileId: string }) {
    const supabase = createServerActionClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    try {

        const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${session?.provider_token}`,
            },
        })


        const data = await response.json();


        


    } catch (err) {
        // TODO(developer) -  try refresh the session and restart attempt 


        console.log(err)




    }


}
//?
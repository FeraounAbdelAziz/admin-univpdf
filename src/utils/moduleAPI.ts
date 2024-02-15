"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { changeFileName, createFolderInsideFolder, moveToTrash } from "./foldersAPI"
import { cookies } from "next/headers";



export async function createModule({ specialtyId, moduleName, moduleFolderName }: { specialtyId: string, moduleName: string, moduleFolderName: string }) {

    const supabase = createServerActionClient({ cookies });


    const { data: specialtyFolderId, error } = await supabase
        .from('specialty')
        .select('*')
        .eq('specialty_id', specialtyId)
        .single()



    console.log(specialtyFolderId)


    if (error) {

        console.log(error)

        return;
    }




    try {

        let data = undefined;

        if (moduleFolderName) {
            data = await createFolderInsideFolder({ fileName: moduleFolderName, parentId: specialtyFolderId.folder_id })
        } else {
            data = await createFolderInsideFolder({ fileName: moduleName, parentId: specialtyFolderId.folder_id })
        }



        const { error } = await supabase

            .from('module')
            .insert([
                {
                    module_name: moduleName,
                    folder_name: data.name,
                    specialty_id: specialtyId,
                    folder_id: data.id
                },]
            )

        if (error) {
            throw Error
        } else {


        }




    } catch (err) {

        console.log(JSON.stringify(err))

    }






}



export async function updateModule({ folderId, moduleName, moduleFolderName }: { folderId: string, moduleName: string, moduleFolderName: string }) {


    const supabase = createServerActionClient({ cookies })


    try {
        if (moduleFolderName) {
            changeFileName({ fileId: folderId, newFileName: moduleFolderName })
        }
        else {
            changeFileName({ fileId: folderId, newFileName: moduleName })
        }


        const { error } = await supabase.from('module').update({
            folder_name: moduleFolderName || moduleName,
            module_name: moduleName,
        }).eq('folder_id', folderId)

        if (error) {

            throw Error

        }



    } catch (err) {



    }





}


export async function removeModule({ folderId }: { folderId: string }) {

    try {


        const err = await moveToTrash({ folderId })


        // console.log(err)


        // if (err) {
        //     throw Error;
        // }
        const supabase = createServerActionClient({ cookies });

        const { error } = await supabase.from('module')
            .update({ isInTrash: true })
            .eq('folder_id', folderId)

        if (error) {
            console.log({ error })

            throw Error
        } else {


        }

    } catch (err) {


        console.log(JSON.stringify(err))


    }





}
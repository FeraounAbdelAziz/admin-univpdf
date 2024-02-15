"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers";
import { changeFileName, createFolderInsideRoot, moveToTrash } from "./foldersAPI";

export async function createSpecialty({ specialtyName, folderName, specialtyDescription }: { specialtyName: string, folderName?: string, specialtyDescription: string }) {

    const supabase = createServerActionClient({ cookies });

    let data = undefined;


    try {
        if (folderName) {
            data = await createFolderInsideRoot({ fileName: folderName })
        } else {
            data = await createFolderInsideRoot({ fileName: specialtyName })
        }


        const { error } = await supabase
            .from('specialty')
            .insert([
                { folder_id: data.id, folder_name: data.name, specialty_name: specialtyName, specialty_description: specialtyDescription },
            ])


        if (error) {
            console.log(error)
            throw Error('error saving specialty id');
        } else {

            const { data: specialty, error } = await supabase
                .from('specialty')
                .select('*').eq('folder_id', data.id).single();


            return specialty


        }



    } catch (err) {

        console.log(err)

    }








}


export async function addImageToSpecialty({ image_id, specialty_id }: { image_id: string, specialty_id: string }) {


    const supabase = createServerActionClient({ cookies })

    const { data, error } = await supabase.from('specialty')
        .update({ 'specialty_image_id': image_id })
        .eq('specialty_id', specialty_id)


    return { data, error };


}


export async function updateSpecialty({ specialtyName, folderName, specialtyDescription, folderId }: { specialtyName: string, folderName?: string, specialtyDescription?: string, folderId: string }) {

    try {

        if (!folderName) {
            changeFileName({ fileId: folderId, newFileName: specialtyName })
        } else {
            changeFileName({ fileId: folderId, newFileName: folderName })
        }

        const supabase = createServerActionClient({ cookies });

        let { data, error } = await supabase.from('specialty')
            .update(
                {
                    folder_name: folderName,
                    specialty_name: specialtyName,
                    specialty_description: specialtyDescription || ""
                },
            ).eq('folder_id', folderId)






        if (error) {
            throw Error
        } else {

        }

    } catch (err) {


        console.log(JSON.stringify(err))


    }









}


export async function removeSpecialty({ folderId }: { folderId: string }) {
    const supabase = createServerActionClient({ cookies });

    try {


        const err = await moveToTrash({ folderId })

        console.log(err)

        if (err == true) {
            throw Error;
        }

        let { error } = await supabase
            .from('specialty')
            .update({ isInTrash: true })
            .eq('folder_id', folderId)

        if (error) {
            throw Error
        } else {

        }

    } catch (err) {


        console.log(JSON.stringify(err))


    }





}
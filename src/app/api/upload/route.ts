import { NextRequest, NextResponse } from 'next/server';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

async function POST(req: NextRequest, res: NextResponse) {



    const reqBody = await req.json()



    const fileMetadata = {
        name: reqBody.fileName,
        // parents: [parentId],
    };

    const media = {
        mimeType: 'application/pdf',
        body: reqBody.file.path,
    };


    const supabase = createServerActionClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    try {




        await fetch('https://www.googleapis.com/drive/v3/files?uploadType=media', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session?.provider_token}`,
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify({
                mimeType: 'application/pdf',
                name: `${fileMetadata.name}.pdf`,
                file: media.body,
            })
        })

        // const data = await response.json();
        // console.log(data)

    } catch (err) {
        throw err;

    }



};


export { POST }
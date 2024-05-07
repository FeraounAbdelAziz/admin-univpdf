import { FileWithPath } from "@mantine/dropzone";

export async function uploadFile(fileName: string, file: FileWithPath) {
  let headersList = {
    Accept: "*/*",
  };

  const res = await fetch("http://localhost:3000/api/upload", {
    method: "POST",
    headers: headersList,
    body: JSON.stringify({
      fileName: fileName,
      file: file,
    }),
  });

  const data = await res.json();

  // return  ;
  return data;
}

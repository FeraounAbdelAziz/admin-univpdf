
import { Container, Flex, Grid } from '@mantine/core';
import DashBoardCards from '@/components/dashboardCards';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

type Modules = {
  module_id: string
  name: string,
  value: number,
}[]



type Specialties = {
  category_id: string,
  category: string,
  stat: string,
  data: Modules,
}[]



export default async function DashBoardPage() {



  const supabase = createServerComponentClient({ cookies })

  let { data: specialty, error } = await supabase
    .from('specialty_module_view').select('*')



  const groupedData = specialty?.reduce((result, item) => {
    const key = `${item.specialty_id}_${item.specialty_name}`;

    if (!result[key]) {
      result[key] = {

        category_id: item.specialty_id,
        category: item.specialty_name,
        stat: item.specialty_number_of_all_courses_in_all_modules,

        data: []
      };
    }

    result[key].data.push({
      module_id: item.module_id,
      name: item.module_name,
      value: item.module_number_of_courses
    });



    return result;
  }, {});


  for (const key in groupedData) {
    groupedData[key].data.sort((a: any, b: any) => b.value - a.value);
  }

  const groupedArray = Object.values(groupedData);





  return (
    <main >

      <Container size={'xl'}>

        <DashBoardCards data={groupedArray as Specialties} />

      </Container>
    </main>
  );
}

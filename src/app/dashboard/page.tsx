'use client';

import { Title, Grid } from '@tremor/react';
import Search from '@/components/search';
import SpecialtyCard from '@/components/specialtyCard';
import { useEffect, useId, useState, useTransition } from 'react';
import { Button, Flex, LoadingOverlay } from '@mantine/core';
import SpecialtySearch from '@/components/specialtySearch';
import { SpecialtyModal } from '@/components/specialtyModal';
import { useDisclosure } from '@mantine/hooks';

type Specialty = {
  name: string,
  value: number,
}[]


const cs = [
  { name: '/AI', value: 1230, href: 'hello', color: 'black' },
  { name: '/linear algebra', value: 751 },
  { name: '/algorithm', value: 471 },
  { name: '/advance Algorithm', value: 280 },
  { name: '/logical programming', value: 78 },

];

const chemistry = [
  { name: '/AI', value: 1230 },
  { name: '/linear algebra', value: 751 },
  { name: '/algorithm', value: 471 },
  { name: '/advance Algorithm', value: 280 },
  { name: '/logical programming', value: 78 },
];

const technology = [
  { name: '/AI', value: 1230 },
  { name: '/linear algebra', value: 751 },
  { name: '/algorithm', value: 471 },
  { name: '/advance Algorithm', value: 280 },
  { name: '/logical programming', value: 78 },
];

const data = [
  {
    category: 'computer science',
    stat: '10,234',
    data: cs
  },
  {
    category: 'chemistry',
    stat: '12,543',
    data: chemistry
  },
  {
    category: 'IT',
    stat: '2,543',
    data: technology
  },


];


type Specialties = {
  category: string,
  stat: string
  data: Specialty
}[]



export default function DashBoardPage() {


  //? create specialty 
  const [createSpecialtyOpened, { open: openCreateSpecialty, close: closeCreateSpecialty }] = useDisclosure()
  //?

  //? search stuff
  const [searchValue, setSearchValue] = useState('')
  const [_data, setData] = useState<Specialties | []>([])
  const [isPending, startTransition] = useTransition()
  //?



  useEffect(() => {

    startTransition(() => {

      setData(data.filter((item) => item.category.toLowerCase().includes(searchValue.toLowerCase())))
    })



  }, [searchValue])





  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="pb-5 mx-auto max-w-full">
        <SpecialtySearch isPending={isPending} searchValue={searchValue} setSearchValue={setSearchValue} />

      </div>


      <Grid numItemsSm={2} numItemsLg={3} className="gap-6">

        {
          searchValue.length > 0 && _data.length > 0 && !isPending ?

            _data.map((item) => (
              <SpecialtyCard key={item.category} category={item.category} data={item.data} stat={item.stat} />
            )) :

            data.map((item) => (
              <SpecialtyCard key={item.category} category={item.category} data={item.data} stat={item.stat} />
            ))
        }
      </Grid>

      <SpecialtyModal close={closeCreateSpecialty} opened={createSpecialtyOpened} />

      {/* <Chart /> */}
    </main>
  );
}

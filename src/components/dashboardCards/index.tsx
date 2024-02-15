"use client";
import React, { useEffect, useState, useTransition } from 'react'
import { Flex, Grid } from '@mantine/core'
import SpecialtySearch from '../specialtySearch'
import { SpecialtyModal } from '../specialtyModal'
import SpecialtyCard from '../specialtyCard'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';


type Modules = {
    module_id: string,
    name: string,
    value: number,
}[]


type Specialties = {
    category_id: string,
    category: string,
    stat: string,
    data: Modules,
}[]


type Props = {
    data: Specialties
}

export default function DashBoardCards({ data }: Props) {

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

            setData(
                [
                    ...data.filter((item) => item.category.toLowerCase().includes(searchValue.toLowerCase())),
                    ...data.filter((item) => !(item.category.toLowerCase().includes(searchValue.toLowerCase()))),
                ]
            )
        })

    }, [searchValue])

    return (

        <>

            <Flex justify={'start'} align={'center'} w={'100%'} px={'md'} py={'xl'}>
                <div style={{ width: '50%' }} >
                    <SpecialtySearch isPending={isPending} searchValue={searchValue} setSearchValue={setSearchValue} />
                </div>
            </Flex>
            <Grid align='stretch' justify='flex-start'  columns={6} >
                {
                    searchValue.length > 0 && _data.length > 0 && !isPending ?

                        _data.map((item) => (
                            <SpecialtyCard category_id={item.category_id} key={item.category} category={item.category} data={item.data} stat={item.stat} />
                        )) :

                        data.map((item) => (
                            <SpecialtyCard category_id={item.category_id} key={item.category} category={item.category} data={item.data} stat={item.stat} />
                        ))
                }
            </Grid>

            <SpecialtyModal close={closeCreateSpecialty} opened={createSpecialtyOpened} />


        </>
    )
}

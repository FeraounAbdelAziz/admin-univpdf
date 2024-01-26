'use client'
import { ActionIcon, Badge, Card, Chip, Flex, Loader, Menu, MenuDropdown, Progress, Text, Title, Tooltip } from '@mantine/core'
import React, { useEffect, useState, useTransition } from 'react'
import Search from '../search'
import { BarList, Metric } from '@tremor/react'
import { IconArrowRight, IconCirclePlus, IconDotsVertical, } from '@tabler/icons-react';
import { useDisclosure, useId } from '@mantine/hooks'
import { SpecialtyModal } from '../specialtyModal'
import { IconSlash } from '@tabler/icons-react'
import SpecialtySearch from '../specialtySearch'
import { useRouter } from 'next/navigation'

type Specialty = {
    name: string,
    value: number,
}[]

type Props = {
    category: string,
    stat: string,
    data: Specialty
}


export default function SpecialtyCard({ category, data, stat }: Props) {

    const [createSpecialtyOpened, { close: closeCreateSpecialty, open: openCreateSpecialty }] = useDisclosure()

    const [searchValue, setSearchValue] = useState('')

    const [_data, setData] = useState<Specialty | []>([])

    const [isPending, startTransition] = useTransition();


    const router = useRouter()

    useEffect(() => {


        startTransition(() => {

            setData(data.filter((item) => item.name.toLowerCase().includes(searchValue.toLowerCase())))

        })



    }, [searchValue])



    return (
        <>
            <Card
                radius={'md'}
            >
                <Flex justify={'end'} >
                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <ActionIcon
                                variant="subtle" aria-label="Settings"
                            >
                                <IconDotsVertical />
                            </ActionIcon>
                        </Menu.Target>
                        <MenuDropdown>
                            <Menu.Label>Application</Menu.Label>
                            <Menu.Item
                                onClick={() => { openCreateSpecialty() }}

                                leftSection={<IconCirclePlus />}
                            >
                                Add Specialty Folder
                            </Menu.Item>
                            <Menu.Item
                                onClick={() => { router.push(`dashboard/${category}`) }}

                                leftSection={<IconArrowRight />}
                            >
                                View All Modules
                            </Menu.Item>

                        </MenuDropdown>
                    </Menu>
                </Flex>


                <SpecialtySearch isPending={isPending} searchValue={searchValue} setSearchValue={setSearchValue} />
                <div className='pb-2' ></div>
                <Title>{category}</Title>
                <Flex
                    justify="start"
                    align="baseline"
                    className="space-x-2"
                >
                    <Badge size='xl' radius={'sm'} variant='light' >{stat}</Badge>
                    <Text>Total views</Text>
                </Flex>
                <Flex className="mt-6">
                    <Text>Modules courses</Text>
                </Flex>




                {
                    searchValue.length > 0 && _data.length > 0 && !isPending ?
                        _data.map((module) => {

                            let value = (module.value / 2000) * 100

                            return (
                                <Flex
                                    key={module.name}
                                    justify={'space-between'}
                                    align={'center'}
                                    px={'md'}

                                    onClick={() => {
                                        router.push(`dashboard/${category}/${module.name}`)
                                    }}
                                    className='cursor-pointer'

                                    


                                >
                                    <Progress.Root w={'90%'}
                                        
                                        my={'sm'} size={40}>
                                        <Tooltip label={`${module.value}`}>
                                            <Progress.Section
                                                




                                                style={{ justifyContent: 'start', overflow: 'visible', cursor: 'pointer' }}
                                                value={value}
                                                color="blue"
                                            >
                                                <Progress.Label
                                                    style={{ overflow: 'visible', color: 'black' }}
                                                    p={'md'}   >
                                                    {module.name}
                                                </Progress.Label>
                                            </Progress.Section>
                                        </Tooltip>

                                    </Progress.Root>
                                    <Text w={'5%'}  >{module.value}</Text>
                                </Flex>
                            )
                        })
                        // :
                        // isPending ?
                        //     <Flex align={'center'} justify={'center'} >
                        //         <Loader type='bars' />
                        //     </Flex>
                        :
                        data.map((module) => {

                            let value = (module.value / 2000) * 100

                            return (
                                <Flex
                                    key={module.name}

                                    justify={'space-between'}
                                    align={'center'}
                                    px={'md'}

                                    onClick={() => {
                                        router.push(`dashboard/${category}/${module.name}`)
                                    }}
                                    className='cursor-pointer'

                                >
                                    <Progress.Root w={'90%'}
                                        my={'sm'} size={40}>
                                        <Tooltip label={`${module.value}`}>
                                            <Progress.Section 
                                            className='cursor-pointer'
                                                style={{ justifyContent: 'start', overflow: 'visible' }}
                                                value={value}
                                                color="blue"

                                            >
                                                <Progress.Label
                                                    style={{ overflow: 'visible', color: 'black' }}
                                                    p={'md'}   >
                                                    {module.name}
                                                </Progress.Label>
                                            </Progress.Section>
                                        </Tooltip>

                                    </Progress.Root>
                                    <Text w={'5%'}  >{module.value}</Text>
                                </Flex>
                            )
                        })


                }




            </Card >

            <SpecialtyModal opened={createSpecialtyOpened} close={closeCreateSpecialty} />

        </>
    )
}

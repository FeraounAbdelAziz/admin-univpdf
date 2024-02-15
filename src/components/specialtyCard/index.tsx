'use client'
import { ActionIcon, Badge, Button, Card, Center, Flex, GridCol, Loader, Menu, MenuDropdown, NumberFormatter, Progress, Text, Title, Tooltip } from '@mantine/core'
import React, { useEffect, useState, useTransition } from 'react'
import { IconArrowRight, IconCirclePlus, IconDotsVertical, } from '@tabler/icons-react';
import { useDisclosure, useMediaQuery, useSetState } from '@mantine/hooks'
import { SpecialtyModal } from '../specialtyModal'
import SpecialtySearch from '../specialtySearch'
import { useRouter } from 'next/navigation'

type Modules = {
    module_id: string
    name: string,
    value: number,
}[]

type Props = {
    category_id: string
    category: string,
    stat: string,
    data: Modules
}


export default function SpecialtyCard({ category_id, category, data, stat }: Props) {

    const [createSpecialtyOpened, { close: closeCreateSpecialty, open: openCreateSpecialty }] = useDisclosure()

    const [searchValue, setSearchValue] = useState('')

    const [_data, setData] = useState<Modules | []>([])

    const [isPending, startTransition] = useTransition();


    const [slice, setSlice] = useState(5)



    const router = useRouter()

    useEffect(() => {


        startTransition(() => {

            setData([
                ...data.filter((item) => item.name.toLowerCase().includes(searchValue.toLowerCase())),
                ...data.filter((item) => !item.name.toLowerCase().includes(searchValue.toLowerCase()))
            ]
            )

        })



    }, [searchValue])


    const md = useMediaQuery('(min-width: 	62em)')
    const sm = useMediaQuery('(min-width: 	48em)')
    const xs = useMediaQuery('(min-width: 	36em)')




    return (

        <GridCol span={md ? 2 : sm ?  3 : 6}  >
            <Card
                radius={'md'}
                shadow={'xs'}
                withBorder
                mih={"100%"}
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

                                //TODO replace with the path to specialty               
                                // onClick={() => { router.push(`dashboard/${category}`) }}

                                leftSection={<IconArrowRight />}
                            >
                                View All Modules
                            </Menu.Item>

                        </MenuDropdown>
                    </Menu>
                </Flex>

                <div style={{ paddingBottom: '16px' }} ></div>

                <SpecialtySearch isPending={isPending} searchValue={searchValue} setSearchValue={setSearchValue} />
                <div style={{ paddingBottom: '16px' }} ></div>
                <Title>{category}</Title>
                <div style={{ paddingBottom: '8px' }} ></div>
                <Flex
                    justify="start"
                    align="baseline"
                    gap={'sm'}
                >
                    <Badge size='xl' radius={'sm'} variant='light' ><NumberFormatter thousandSeparator value={stat} /></Badge>
                    <Text>Total courses</Text>
                </Flex>


                <Flex mt={'md'}>
                    <Text>Modules</Text>
                </Flex>




                {
                    searchValue.length > 0 && _data.length > 0 && !isPending ?
                        _data.slice(0, slice).map((module) => {

                            let value = 0;
                            if (Number(stat) > 0)
                                value = (module.value / Number(stat)) * 100

                            return (
                                <Flex
                                    key={module.name}
                                    justify={'space-between'}
                                    align={'center'}
                                    px={'md'}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        // router.push(`dashboard/${category}/${module.name}`)
                                    }}





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
                        data.slice(0, slice).map((module) => {


                            let value = 0;
                            if (Number(stat) > 0)
                                value = (module.value / Number(stat)) * 100

                            return (
                                    <Flex
                                        key={module.name}

                                        justify={'space-between'}
                                        align={'center'}
                                        px={'md'}

                                        onClick={() => {
                                            router.push(`dashboard/${category_id}/${module.module_id}`)
                                        }}
                                        style={{ cursor: 'pointer' }}

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




                {data.length > slice ? <Center >
                    <Button variant='transparent'
                        onClick={
                            () => {
                                setSlice(slice => slice + 5)
                            }
                        }
                    >

                        <Text display={"flex"} size='sm' >show more</Text>

                    </Button>
                </Center> : null}

                {slice > 5 && data.length > 5 ? <Center >
                    <Button variant='transparent'
                        onClick={
                            () => {
                                setSlice(slice => slice - 5)
                            }
                        }
                    >

                        <Text display={"flex"} size='sm' >show less</Text>

                    </Button>
                </Center> : null}

            </Card >
            <SpecialtyModal opened={createSpecialtyOpened} close={closeCreateSpecialty} />
        </GridCol >
    )
}


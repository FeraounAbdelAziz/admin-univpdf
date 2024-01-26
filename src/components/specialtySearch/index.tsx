"use client";

import { Loader, TextInput } from '@mantine/core';
import { useTransition } from 'react';

import { IconSearch } from '@tabler/icons-react'


type Props = {
    disabled?: boolean,
    searchValue: string,
    setSearchValue: React.Dispatch<React.SetStateAction<string>>,
    isPending: boolean, 

}



export default function SpecialtySearch({ disabled, searchValue, setSearchValue, isPending }: Props) {


    function handleSearch(term: string) {

        setSearchValue(term)
        
    }

    return (
        <div className="relative mt-5 max-w-md">

            <div className="rounded-md shadow-sm">

                <TextInput
                    type="text"
                    name="search"
                    id="search"

                    value={searchValue}
                    leftSection={<IconSearch />}
                    rightSection={searchValue.length > 0 && isPending && <Loader size={'sm'} />}
                    disabled={disabled}
                    placeholder="Search by name..."
                    spellCheck={false}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

          
        </div>
    );
}

"use client"

import { gql, useMutation } from '@apollo/client';
import { Button, Input, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import React, { useState } from 'react'

const ADD_USER = gql`
    mutation CreateUser($createUserInput: CreateUserDto!) {
    createUser(createUserInput: $createUserInput) {
      name
      userId
      role
    }
  }
`;

interface Props {
    user: boolean;
    setUser: (value: boolean) => void;
}

const AddUser = ({ user, setUser }: Props) => {
    const [addUserMutation] = useMutation(ADD_USER);
    const [newUserData, setNewUserData] = useState({ name: '', role: '', userId: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUserData((prevData) => ({ ...prevData, [name]: value }));
    };

    const addUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await addUserMutation({
                variables: {
                    createUserInput: newUserData,
                }
            });
            setNewUserData({ name: '', role: '', userId: '' });
            window.alert('User added successfully');
        } catch (error) {
            window.alert('Error adding user');
        } finally {
            setUser(!user)
        }
    };

    const content = (
        <PopoverContent className="w-[240px]">
            <form className="px-1 py-2 w-full" onSubmit={addUser}>
                <p className="text-small text-black font-bold">
                    Add User
                </p>
                <div className="mt-2 flex flex-col gap-2 w-full text-black">
                    <Input label="Name" name='name' value={newUserData.name} onChange={handleInputChange} size="sm" variant="bordered" />
                    <Input label="Role" name='role' value={newUserData.role} onChange={handleInputChange} size="sm" variant="bordered" />
                    <Input label="User-ID" name='userId' value={newUserData.userId} onChange={handleInputChange} size="sm" variant="bordered" />
                    <PopoverTrigger>
                        <Button color="success" size="sm" type='submit'>Add</Button>
                    </PopoverTrigger>
                </div>
            </form>
        </PopoverContent>
    )
    return (
        <div className="flex flex-wrap gap-4">
            <Popover
                showArrow
                offset={10}
                placement="bottom"
                backdrop="blur"
            >

                <PopoverTrigger>
                    <Button color="danger" aria-label="Like">
                        Add User
                    </Button>
                </PopoverTrigger>
                {content}
            </Popover>
        </div>
    )
}

export default AddUser

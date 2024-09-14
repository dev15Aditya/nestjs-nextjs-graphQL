import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent, Button, Input } from "@nextui-org/react";
import { Card, CardHeader } from "@nextui-org/react";
import { gql, useMutation } from "@apollo/client";


interface User {
    _id: string;
    name: string;
    role: string;
    userId: string;
    user: boolean;
    setUser: (value: boolean) => void;
}

const UPDATE_USER = gql`
    mutation UpdateUser($id: String!, $updateUserInput: UpdateUserDto!) {
    updateUser(id: $id, updateUserInput: $updateUserInput) {
      name
      userId
      role
    }
  }
`;

const UserCard = ({ _id ,name, role, userId, user, setUser }: User) => {
    const [addUserMutation] = useMutation(UPDATE_USER);
    const [userData, setUserData] = useState({ name: name, role: role, userId: userId });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({ ...prevData, [name]: value }));
    };

    const updateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await addUserMutation({
                variables: {
                    id: _id,
                    updateUserInput: {
                        name: userData.name,
                        role: userData.role,
                        userId: userData.userId,
                    }
                }
            });
            setUserData({ name: '', role: '', userId: '' });
            window.alert('User update successfully');
        } catch (error) {
            window.alert('Error in updating user');
        } finally{
            setUser(!user)
        }
    };

    const content = (
        <PopoverContent className="w-[240px]">
            <form className="px-1 py-2 w-full" onSubmit={updateUser}>
                <p className="text-small font-bold text-black">
                    Update user {name}&apos; details
                </p>
                <div className="mt-2 flex flex-col gap-2 w-full text-black">
                    <Input label="Name" defaultValue={name} name='name' value={userData.name} onChange={handleInputChange} size="sm" variant="bordered" />
                    <Input label="Role" defaultValue={role} name='role' value={userData.role} onChange={handleInputChange} size="sm" variant="bordered" />
                    <Input label="User-ID" defaultValue={userId} name='userId' value={userData.userId} onChange={handleInputChange} size="sm" variant="bordered" />
                    <PopoverTrigger>
                        <Button color="success" size="sm" type="submit">Update</Button>
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
                <Card className="py-4 bg-white text-black w-44 cursor-pointer relative">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                        <h4 className="font-bold text-large">{name}</h4>
                        <small className="text-default-500">{userId}</small>
                        <p className="text-tiny uppercase font-bold">{role}</p>
                    </CardHeader>
                    <PopoverTrigger className="absolute right-2 top-2">
                        <Button isIconOnly color="danger" aria-label="Like">
                            ✍🏼
                        </Button>
                    </PopoverTrigger>
                </Card>
                {content}
            </Popover>
        </div>
    );
}

export default UserCard;

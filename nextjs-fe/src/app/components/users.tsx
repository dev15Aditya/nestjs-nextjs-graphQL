'use client';

import { useQuery, gql, useMutation } from '@apollo/client';
import { useState } from 'react';

interface User {
    _id: string;
    name: string;
    role: string;
    userId: string;
}

const GET_USERS = gql`
  query GetUsers {
    users {
      _id
      name
      role
      userId
    }
  }
`;

const ADD_USER = gql`
    mutation CreateUser($createUserInput: CreateUserDto!) {
    createUser(createUserInput: $createUserInput) {
      name
      userId
      role
    }
  }
`;

const Users = () => {
    const { loading, error, data } = useQuery(GET_USERS);
    const [addUserMutation] = useMutation(ADD_USER, {
        refetchQueries: [{ query: GET_USERS }],
    });

    const [newUserData, setNewUserData] = useState({ name: '', role: '', userId: '' });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;

    const handleEdit = () => { }

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
        }
    };

    return (
        <>
        <h1>User List</h1>
            <table style={{ width: '70%' }}>
                <tbody>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>UserId</th>
                        <th>Action</th>
                    </tr>

                    {data.users.map((user: User) => (
                        <tr key={user._id}>
                            <td className='text-center'>{user.name}</td>
                            <td className='text-center'>{user.role}</td>
                            <td className='text-center'>{user.userId}</td>
                            <td className='text-center underline' onClick={handleEdit}>edit</td>
                        </tr>
                    ))}
                </tbody>
            </table>


            <p className='font-bold text-center mt-5 underline'>Add new User</p>
            <form className='flex gap-4' onSubmit={addUser}>
                <input type="text" className='p-2 rounded text-center text-black' placeholder='Name' name='name' value={newUserData.name} onChange={handleInputChange} />
                <input type="text" className='p-2 rounded text-center text-black' placeholder='Role' name='role' value={newUserData.role} onChange={handleInputChange} />
                <input type="text" className='p-2 rounded text-center text-black' placeholder='UserId' name='userId' value={newUserData.userId} onChange={handleInputChange} />
                <button className='p-2 rounded text-center bg-blue-400' type='submit'>Add User</button>
            </form>
        </>
    )
}

export default Users

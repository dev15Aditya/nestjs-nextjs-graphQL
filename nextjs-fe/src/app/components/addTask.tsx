'use client';

import { gql, useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';

interface User {
    userId: string;
}

interface Props {
    task: boolean;
    setTask: React.Dispatch<React.SetStateAction<boolean>>;
}

const ADD_TASK = gql`
    mutation CreateTask($createTaskInput: CreateTaskDto!) {
    create(createTaskInput: $createTaskInput) {
      taskName
      description
      userId
      isActive
    }
  }
`;

const GET_USER_ID = gql`
    query GetUsers {
    users {
      userId
    }
  }
`

const AddTask = ({task, setTask}: Props) => {
    const { loading, error, data } = useQuery(GET_USER_ID);
    const [addUserMutation] = useMutation(ADD_TASK);

    const [newTaskData, setNewTaskData] = useState({ taskName: '', description: '', userId: '', isActive: true });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewTaskData((prevData) => ({
            ...prevData,
            [name]: name === 'isActive' ? value === 'true' : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await addUserMutation({
                variables: {
                    createTaskInput: newTaskData
                },
            });
            setTask && setTask(!task)
            setNewTaskData({ taskName: '', description: '', userId: '', isActive: true });
            window.alert('Task added successfully');
        } catch (error) {
            console.error(error);
            window.alert('Error adding task');
        }
    };

    return (
        <form className='border p-4 mt-5 rounded-md flex flex-col gap-2' onSubmit={handleSubmit}>
            <h1 className='font-bold text-center'>Add Task</h1>
            <div>
                <label htmlFor="Name">Taskname</label>
                <input
                    type="text"
                    className='ml-2 p-2 rounded text-center text-black'
                    placeholder='TaskName'
                    name='taskName'
                    value={newTaskData.taskName}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label htmlFor="Role">Description</label>
                <input
                    type="text"
                    className='ml-2 p-2 rounded text-center text-black'
                    placeholder='Description'
                    name='description'
                    value={newTaskData.description}
                    onChange={handleInputChange}
                />
            </div>
            <div>

                <label htmlFor="UserId">UserId</label>
                <select
                    id="userId"
                    className='ml-2 p-3 border rounded-md text-black'
                    name='userId'
                    value={newTaskData.userId}
                    onChange={handleInputChange}
                >
                    {loading && <option>Loading...</option>}
                    {error && <option>Error</option>}
                    {data?.users.map((user: User) => (
                        <option key={user.userId} value={user.userId}>
                            {user.userId}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor='isActive'>isActive</label>
                <select
                    className='ml-2 p-2 rounded text-center text-black'
                    name='isActive'
                    value={newTaskData.isActive.toString()}
                    onChange={handleInputChange}
                >
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
            </div>
            <button className='p-2 rounded text-center bg-blue-400' type='submit'>Add Task</button>
        </form>
    )
}

export default AddTask

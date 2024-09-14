'use client';

import { gql, useMutation, useQuery } from '@apollo/client';
import { Input } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import SelectOption from '../select/select';

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
    const { data } = useQuery(GET_USER_ID);
    const [addUserMutation] = useMutation(ADD_TASK);
    
    const [newTaskData, setNewTaskData] = useState({ taskName: '', description: '', userId: '', isActive: true });
    console.log(newTaskData)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewTaskData((prevData) => ({
            ...prevData,
            [name]: name === 'isActive' ? value === 'true' : value,
        }));
    };

    const handleSelect = (name: string, value: string) => {
        if (name === 'userId') {
            setNewTaskData((prevData) => ({ ...prevData, [name]: value }));
        } 
        if (name === 'isActive') {
            setNewTaskData((prevData) => ({ ...prevData, [name]: value === 'true' }));
        }
    }

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

    const [user, setUser] = useState([]);
    useEffect(() => {
            const datas = data?.users.map((user: User) => user.userId)
            setUser(datas)
    }, [data])

    return (
        <form className='border p-4 rounded-md flex flex-col gap-2 bg-white text-black shadow' onSubmit={handleSubmit}>
            <h1 className='font-bold text-center'>Add Task</h1>
            <Input label="Task Name" name='taskName' value={newTaskData.taskName} onChange={handleInputChange} size="sm" variant="bordered" />
            <Input label="Description" name='description' value={newTaskData.description} onChange={handleInputChange} size="sm" variant="bordered" />
            <SelectOption
                data={user}
                label='User Id'
                selected={newTaskData.userId}
                onChange={(v) => handleSelect('userId', v)}
            />
            <SelectOption
                data={['true', 'false']}
                label='Is Active'
                selected={newTaskData.isActive.toString()}
                onChange={(v) => handleSelect('isActive', v)}
            />
            
            <button className='p-2 rounded text-center bg-blue-400' type='submit'>Add Task</button>
        </form>
    )
}

export default AddTask

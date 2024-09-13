'use client';
import React, { useEffect, useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client';
import AddTask from './addTask';

interface Task {
    id: string;
    taskName: string;
    description: string;
    userId: string;
    isActive: boolean;
    user: {
        name: string;
    }
}

const GET_TASKS = gql`
    query GetTasks {
        tasks {
            id
            taskName
            description
            userId
            isActive
            user {
                name
            }
        }
    }
`

const CHANGE_STATUS = gql`
    mutation ChangeStatus($id: ID!, $updateTaskInput: UpdateTaskDto!) {
update(id: $id, updateTaskInput: $updateTaskInput) {
      id
      taskName
      description
      isActive
    }
  }
`

const DELETE_TASK = gql`
    mutation DeleteTask($id: Float!) {
        delete(id: $id) {
            id
        }
    }
`

const Tasks = () => {
    const { loading, error, data, refetch } = useQuery(GET_TASKS);
    const [changeStatusMutation] = useMutation(CHANGE_STATUS, { refetchQueries: [{ query: GET_TASKS }] });
    const [deleteTask] = useMutation(DELETE_TASK, 
        { 
            refetchQueries: [{ query: GET_TASKS }],
            onCompleted: () => {
                window.alert('Task deleted successfully');
                console.log('Task deleted successfully');
            },
            onError: (error) => {
                if (error.message.includes('Cannot return null for non-nullable field')) {
                    // The deletion was likely successful, but the server returned null
                    window.alert('Task deleted successfully');
                    console.log('Task deleted successfully (inferred from error)');
                    refetch(); // Manually refetch to update the UI
                } else {
                    window.alert('Error deleting task');
                    console.error('Error deleting task:', error);
                }
            }
    });

    const [task, setTask] = useState(false)

    useEffect(() => {
        if(task){
            refetch()
        }
    }, [task, refetch])

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>, taskId: string) => {
        const newStatus = e.target.value === 'true';
        try {
            await changeStatusMutation({
                variables: {
                    id: taskId,
                    updateTaskInput: {
                        isActive: newStatus,
                    },
                },
            });
            console.log('Status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteTask({
                variables: {
                    id: parseInt(id),
                }
            });
            
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    return (
        <>
            <h1 className='mt-5'>Task List</h1>
            <div className='grid grid-cols-3 gap-4'>
                {data.tasks.map((task: Task) => (
                    <div key={task.id} className='border p-4 rounded-md'>
                        <div className='flex justify-between items-center'>
                            <h2>TaskName: {task.taskName}</h2>
                            <button onClick={() => handleDelete(task.id)} className='p-2 rounded text-center bg-red-500 text-white'>delete</button>
                        </div>
                        <p>Description: {task.description}</p>
                        <p>UserId: {task.userId}</p>
                        <p>User: {task.user.name}</p>
                        <div>
                            <label htmlFor="Status">Status</label>
                            <select
                                className='ml-2 p-1 rounded text-center text-black'
                                name='isActive'
                                value={task.isActive.toString()}
                                onChange={(e) => handleChange(e, task.id)}
                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
            <AddTask task={task} setTask={setTask}/>
        </>
    )
}

export default Tasks

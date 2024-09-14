'use client';
import React, { useEffect, useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client';
import AddTask from './addTask';
import TaskCard from './task-card';

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
                    window.alert('Task deleted successfully');
                    console.log('Task deleted successfully (inferred from error)');
                    refetch();
                } else {
                    window.alert('Error deleting task');
                    console.error('Error deleting task:', error);
                }
            }
        });

    const [task, setTask] = useState(false)

    useEffect(() => {
        if (task) {
            refetch()
        }
    }, [task, refetch])

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;

    const handleChange = async (taskId: string, newStatus: boolean) => {
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

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
      e.dataTransfer.setData('text/plain', taskId);
      // set bg color to red 
      e.currentTarget.style.backgroundColor = 'red';
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>, newStatus: boolean) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text');
        await handleChange(taskId, newStatus);
    };

    return (
        <>
            <h1 className='m-5 text-xl font-bold'>Task Board</h1>
            <div className='flex gap-4 w-full px-5'>
                {/* Column 1 */}
                <div className='flex-1 bg-gray-100 rounded-lg shadow-md p-4'>
                    <AddTask task={task} setTask={setTask} />
                </div>

                {/* Column 2 */}
                <div 
                    className={`flex-1 bg-gray-100 rounded-lg shadow-md p-4`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, true)}
                >
                    <h2 className="text-lg font-semibold mb-4 text-black text-center">Active Tasks</h2>
                    {
                        data.tasks.map((task: Task) => (
                            task.isActive && (
                                <div 
                                    key={task.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, task.id)}
                                    className='rounded-lg'
                                >
                                    <TaskCard
                                        task={task}
                                        handleDelete={handleDelete}
                                        handleChange={(e) => handleChange(task.id, e.target.value === 'true')}
                                    />
                                </div>
                            )
                        ))
                    }
                </div>

                {/* Column 3 */}
                <div 
                    className='flex-1 bg-gray-100 rounded-lg shadow-md p-4'
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, false)}
                >
                    <h2 className="text-lg font-semibold mb-4 text-black text-center">Inactive Tasks</h2>
                    {
                        data.tasks.map((task: Task) => (
                            !task.isActive && (
                                <div 
                                    key={task.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, task.id)}
                                    className='rounded-lg'
                                >
                                    <TaskCard
                                        task={task}
                                        handleDelete={handleDelete}
                                        handleChange={(e) => handleChange(task.id, e.target.value === 'true')}
                                    />
                                </div>
                            )
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default Tasks
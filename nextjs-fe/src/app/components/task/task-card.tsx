import React from 'react'

interface Task {
  id: string;
  taskName: string;
  description: string;
  userId: string;
  user: {
    name: string;
  };
  isActive: boolean;
}

interface TaskCardProps {
  task: Task;
  handleDelete: (id: string) => void;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>, id: string) => void;
}

const TaskCard = ({ task, handleDelete, handleChange }: TaskCardProps) => {
  return (
    <div key={task.id} className='border select-none p-6 rounded-lg bg-white text-black mb-6 shadow-md transform hover:-translate-y-1 transition-transform duration-300 ease-in-out'
      style={{ boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>{task.taskName}</h2>
        <button
          onClick={() => handleDelete(task.id)}
          className='px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition duration-300 ease-in-out'
          style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
        >
          Delete
        </button>
      </div>
      <p className='mt-2 text-base text-gray-700'>Description: {task.description}</p>
      <p className='text-base text-gray-700'>User: {task.user.name}</p>
      <p className='text-base text-gray-700'>UserId: {task.userId}</p>
      <div className='flex items-center mt-2'>
        <label htmlFor="Status" className='block text-base font-medium text-gray-600'>Status</label>
        <select
          className='ml-2 p-2 rounded-md bg-gray-100 text-black shadow-inner transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500'
          name='isActive'
          value={task.isActive.toString()}
          onChange={(e) => handleChange(e, task.id)}
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
    </div>
  )
}

export default TaskCard

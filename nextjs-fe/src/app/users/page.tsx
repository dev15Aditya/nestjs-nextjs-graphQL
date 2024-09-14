"use client"
import React, { useEffect, useState } from 'react'
import UserCard from '../components/user/user'
import { gql, useQuery } from '@apollo/client'
import AddUser from '../components/user/add-user';

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

const Users = () => {
  const { loading, error, data, refetch } = useQuery(GET_USERS);

  const [userAdd, setUserAdd] = useState(false);

  useEffect(() => {
    if(userAdd) {
      refetch();
      setUserAdd(false);
    }
  }, [refetch, userAdd]);

  return (
    <div className='lg:px-36'>
      <div className='flex justify-between items-center mb-5'>
        <h1>Users</h1>
        <AddUser user={userAdd} setUser={setUserAdd}/>
      </div>
      <div className='flex gap-5 flex-wrap'>
        {
          loading ? <p>Loading...</p> :
            error ? <p>Error</p> :
              data.users.map((user: User) => (
                <UserCard user={userAdd} setUser={setUserAdd} key={user._id} _id={user._id} name={user.name} userId={user.userId} role={user.role} />
              ))
        }
      </div>
    </div>
  )
}

export default Users

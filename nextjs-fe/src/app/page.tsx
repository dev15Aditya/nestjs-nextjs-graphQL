"use client"

import Tasks from "./components/tasks";
import Users from "./components/users";


export default function Home() {

  return (
    <div className="flex flex-col justify-center items-center">
      <h1>Playing with graphQl</h1>
      <p className='mb-5'>Trying Query and Mutation</p>

      <Users/>
      <Tasks />
    </div>
  );
}

import React from 'react'

const Layout = (children:React.ReactNode) => {
  return (
    <div className='container pt-56 sm:pt-36 md:pt-28 px-4 lg:px-14'>
      {children}
    </div>
  )
}

export default Layout

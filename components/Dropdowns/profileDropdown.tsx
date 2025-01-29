'use client'
import Image from 'next/image'
import React , {useState} from 'react'

const profileDropdown = () => {
    const [isOpen , setIsOpen] = useState(false)
    const user = {
        name : 'yasser kalkhi',
        email : 'yasserkalkhi@gmail.com'
    }
   const handleSignOut = async ()=>{
      console.log('')
    }
  return (
    <>
    
<button onClick={()=>{setIsOpen(!isOpen)}} className="flex text-sm bg-gray-800 rounded-full md:me-0" type="button">
<span className="sr-only">Open user menu</span>
<Image className="w-8 h-8 rounded-full" width={8} height={8} src="https://picsum.photos/20" alt="user photo"/>
</button>
{
    isOpen &&  
    <div id="dropdownAvatar" className="z-10 absolute top-12 right-5  divide-y  rounded-lg shadow-sm w-44 bg-gray-700 divide-gray-600">
    <div className="px-4 py-3 text-sm text-white">
      <div>{user.name}</div>
      <div className="font-medium truncate">{user.email}</div>
    </div>
    <ul className="py-2 text-sm text-gray-200" aria-labelledby="dropdownUserAvatarButton">
      <li>
        <a href="#" className="block px-4 py-2 hover:bg-gray-600 hover:text-white">Jobs</a>
      </li>
      <li>
        <a href="#" className="block px-4 py-2 hover:bg-gray-600 hover:text-white">Messages</a>
      </li>
      <li>
        <a href="#" className="block px-4 py-2 hover:bg-gray-600 hover:text-white">Notifications</a>
      </li>
    </ul>
    <div className="py-2">
      <button onClick={handleSignOut} className="block px-4 py-2 text-sm w-full text-start  hover:bg-red-500 text-gray-200 hover:text-white">Sign out</button>
    </div>
</div>
}

</>
  )
}

export default profileDropdown
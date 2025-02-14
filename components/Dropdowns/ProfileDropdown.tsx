'use client'
import { listenForAuthChanges, logoutUser } from '@/features/auth/authSlice'
import { AppDispatch } from '@/redux/store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React , {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase'
import toast from 'react-hot-toast'

const ProfileDropdown = () => {
    const [userData , setUserdata] = useState<any>()
    const [isOpen , setIsOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const Router = useRouter();
    const { user } = useSelector((state: { auth: { user: any } }) => state.auth);
    useEffect(() => {
      dispatch(listenForAuthChanges());
    }, [dispatch]);


    const handleSignOut = () => {
      toast('Logging out...');
      dispatch(logoutUser())
      Router.replace('./login')
      
    };

    const fetchUserData = async () => {
      if (user) {
        const q = query(collection(db, 'profiles'), where('id', '==', user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          console.log(doc)
          setUserdata(doc.data());
        }
      }
    };

    useEffect(() => {
      fetchUserData();
    }, []);
  return (
    <>
       <button onClick={()=>{setIsOpen(!isOpen)}} className="flex text-sm bg-gray-800 rounded-full md:me-0" type="button">
                <span className="sr-only">Open user menu</span>
                   {userData?.avatar && (
                          <div  className="w-8 h-8 rounded-full bg-center bg-cover" style={{backgroundImage: `url(${userData.avatar})`}}></div>
                       )}
                   </button>
{
    isOpen &&  
    <div id="dropdownAvatar" className="absolute top-12 right-5  divide-y  rounded-lg shadow-lg w-44 bg-gray-700 divide-gray-600 z-50 overflow-hidden ">
    <div onClick={() => Router.push(userData.username)} className="flex gap-2 px-4 py-3 text-sm text-white cursor-pointer hover:bg-gray-600">
    <div  className="w-8 h-8 rounded-full bg-center bg-cover" style={{backgroundImage: `url(${userData.avatar})`}}></div>
       <div>
            <div className="font-medium truncate">{userData.firstname} {userData.lastname}</div>
            <div className="text-xs text-gray-400 truncate">{userData.position}</div>
       </div>
     
    </div>
    <ul className="py-2 text-sm text-gray-200" aria-labelledby="dropdownUserAvatarButton">
      <li>
        <Link href="/jobs" className="block px-4 py-2 hover:bg-gray-600 hover:text-white">Jobs</Link>
      </li>
      <li>
        <Link href="/messages" className="block px-4 py-2 hover:bg-gray-600 hover:text-white">Messages</Link>
      </li>
      <li>
        <Link href="/notifications" className="block px-4 py-2 hover:bg-gray-600 hover:text-white">Notifications</Link>
      </li>
      <li>
        <Link href="/profile" className="block px-4 py-2 hover:bg-gray-600 hover:text-white">Settings</Link>
      </li>
      <li>
        <Link href="/console/recruiter" className="block px-4 py-2 hover:bg-gray-600 hover:text-white"> Dashboard</Link>
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

export default ProfileDropdown

import { listenForAuthChanges } from "@/features/auth/authSlice";
import { db } from "@/lib/firebase";
import { AppDispatch } from "@/redux/store";
import { collection, getDocs, query, where } from "firebase/firestore";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const UserProfile = () => {
    const [userData, setUserData] = useState<any>(null);
      const dispatch = useDispatch<AppDispatch>();

      useEffect(() => {
        dispatch(listenForAuthChanges());
      }, [dispatch]);

    const { user } = useSelector((state: { auth: { user: any } }) => state.auth);

    const fetchUserData = async () => {
        if (user) {
            const q = query(collection(db, 'profiles'), where('id', '==', user.uid));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                setUserData(doc.data());
            }
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [user]);



    return (
        <div className="hidden w-64 h-40 p-4 bg-dark-primary border border-[#30363d] rounded-lg md:flex flex-col ps-5">
            <div className="w-16 h-16 flex items-center justify-center rounded-full">
                <div className="h-full w-full rounded-full object-cover bg-center bg-cover" style={{backgroundImage: `url(${userData?.avatar || "https://lh3.googleusercontent.com/a/ACg8ocLq2rzclet439QDaQyxEMOibEjv8Govpm4EPsbgqDaFxHOpIg=s96-c"})`}}></div>
            </div>
            <span className="text-white mt-2 font-semibold">{userData?.username || "N/A"}</span>
            <p className="text-sm text-gray-400">{userData?.position  || "N/A"}</p>
        </div>
    );
};

export default UserProfile;
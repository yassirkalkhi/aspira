import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/shadcn/ui/skeleton"; 
import React from "react";

interface RenderUserCommentProps {
    uid: string;
    commentContent: string,
}

const RenderUserComment: React.FC<RenderUserCommentProps> = ({ uid, commentContent }) => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const userRef = query(
                    collection(db, "profiles"), 
                    where("id", "==", uid)
                );
                const userSnap = await getDocs(userRef);
                if (!userSnap.empty) {
                    const userDoc = userSnap.docs[0];
                    const data = userDoc.data();
                    setUser({
                        uid: userDoc.id,
                        username: data?.username,
                        AvatarURL: data?.avatar
                    } as any);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [uid]);

    return loading ? (
        <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 min-w-0">
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-3 w-2/3" />
            </div>
        </div>
    ) : (
        <div key={user?.uid} className="mb-4">
          <div className="flex gap-2">
          <div className="h-6 w-6 rounded-full object-cover bg-center bg-cover" style={{backgroundImage: `url(${user?.AvatarURL|| "https://lh3.googleusercontent.com/a/ACg8ocLq2rzclet439QDaQyxEMOibEjv8Govpm4EPsbgqDaFxHOpIg=s96-c"})`}}></div>
          <span className="text-sm font-semibold text-theme-primary/80">{user?.username}</span>
          </div>
          <div className="ms-5">
              <span className="text-sm text-white/80 mt-1  break-words">
            {commentContent}
            </span>
          </div>
          
        </div>
    );
};

export default RenderUserComment;

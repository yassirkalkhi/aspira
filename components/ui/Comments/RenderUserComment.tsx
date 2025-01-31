import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { User } from "@/types/types";
import { doc, getDoc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/shadcn/ui/skeleton"; 
import React from "react";

interface RenderUserCommentProps {
    uid: string;
    commentContent: string,
}

const RenderUserComment: React.FC<RenderUserCommentProps> = ({ uid, commentContent }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const userRef = doc(db, "users", uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setUser({
                        uid: userSnap.id,
                        username: data?.username,
                        AvatarURL: data?.AvatarURL
                    } as User);
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
          <div className="flex gap-2 mb-2">
          <img src={user?.AvatarURL} alt="user photo" width={20}  className="rounded-full" />
          <span className="text-sm font-semibold text-theme-primary/80">{user?.username}</span>
          </div>
          <div className="ms-4">
              <span className="text-sm text-white/80 mt-1  break-words">
            {commentContent}
            </span>
          </div>
          
        </div>
    );
};

export default RenderUserComment;

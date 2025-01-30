import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { User } from "@/types/types";
import { doc, getDoc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton"; // Import a skeleton loader for better UX
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
            try {
                const userRef = await getDoc(doc(db, "users", uid).withConverter({
                    fromFirestore: (snapshot) => {
                        const data = snapshot.data();
                        return {
                            uid : data.id,
                            username: data?.username,
                            AvatarURL : data?.AvatarURL
                        } as User;
                    },
                    toFirestore: (user: User) => user,
                }));
                if (userRef.exists()) {
                    setUser(userRef.data() as User);
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
        <div>Loading Comments ...</div>
    ) : (
        <div key={user?.uid} className="mb-4">
          <div className="flex gap-2 mb-2">
          <img src={user?.AvatarURL} alt="user photo" width={20}  className="rounded-full" />
          <span className="text-sm font-semibold text-theme-primary/80">{user?.username}</span>
          </div>
            <span className="text-sm text-white/80 mt-1  break-words">
            {/* //to bee fixed later  */}
                {commentContent.split(' ').map((word, index) => (
                    <React.Fragment key={index}>
                        {word} {(index + 1) % 14 === 0 && <br />}
                    </React.Fragment>
                ))}
            </span>
        </div>
    );
};

export default RenderUserComment;

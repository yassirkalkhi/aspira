import { useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  doc, 
  getDoc, 
  getDocs, 
  collection, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  addDoc, 
  deleteDoc, 
  increment, 
  serverTimestamp,
  setDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Button from './Button';
import { User } from '@/types/types';
import { StyledString } from 'next/dist/build/swc/types';
import RenderUserComment from './RenderUserComment';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {ScrollArea} from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input';

interface PostStats {
  likes: number;
  comments: number;
  shares: number;
}

interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

interface PostActionsProps {
  postId: string;
  userId: string;
}

const ACTION_COOLDOWN = 500;

const PostActions: React.FC<PostActionsProps> = ({ postId, userId }) => {
  const [liked, setLiked] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);
  const [stats, setStats] = useState<PostStats>({ likes: 0, comments: 0, shares: 0 });
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [showComments, setShowComments] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isActionInProgress, setIsActionInProgress] = useState<boolean>(false);


  





  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [postDoc, likeDoc, shareDoc] = await Promise.all([
          getDoc(doc(db, 'posts', postId)),
          getDoc(doc(db, 'likes', `${postId}_${userId}`)),
          getDoc(doc(db, 'shares', `${postId}_${userId}`))
        ]);

        if (postDoc.exists()) {
          setStats(postDoc.data() as PostStats);
        }
        setLiked(likeDoc.exists());
        setShared(shareDoc.exists());
        setError('');
      } catch {
        setError('Failed to load post data');
      }
    };
    fetchStats();
  }, [postId, userId]);

  useEffect(() => {
    if (showComments) {
      const fetchComments = async () => {
        try {
          const commentsSnapshot = await getDocs(
            query(
              collection(db, 'comments'),
              where('postId', '==', postId),
              orderBy('createdAt', 'desc')
            )
          );
          
          const commentsData = commentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
          })) as Comment[];
          
          setComments(commentsData);
          setError('');
        } catch {
          setError('Failed to load comments');
        }
      };
      fetchComments();
    }
  }, [postId, showComments]);

  const handleAction = useCallback(async (action: () => Promise<void>) => {
    if (isActionInProgress) return;
    setIsActionInProgress(true);
    try {
      await action();
      setError('');
    } catch (err) {
      setError('Action failed. Please try again');
    } finally {
      setTimeout(() => {
        setIsActionInProgress(false);
      }, ACTION_COOLDOWN);
    }
  }, [isActionInProgress]);

  const handleLike = async () => {
    handleAction(async () => {
      const likeRef = doc(db, 'likes', `${postId}_${userId}`);
      const postRef = doc(db, 'posts', postId);
      
      if (liked) {
        await deleteDoc(likeRef);
        await updateDoc(postRef, { likes: increment(-1) });
      } else {
        await setDoc(likeRef, {
          userId,
          postId,
          createdAt: serverTimestamp()
        });
        await updateDoc(postRef, { likes: increment(1) });
      }
      
      setLiked(!liked);
      setStats(prev => ({
        ...prev,
        likes: prev.likes + (liked ? -1 : 1)
      }));
    });
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const newCommentData = {
        postId,
        userId,
        content: newComment,
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'comments'), newCommentData);
      await updateDoc(doc(db, 'posts', postId), { comments: increment(1) });
      
      setComments(prev => [{
        id: Date.now().toString(),
        ...newCommentData,
        createdAt: new Date()
      }, ...prev]);
      
      setStats(prev => ({
        ...prev,
        comments: prev.comments + 1
      }));
      
      setNewComment('');
      setError('');
    } catch {
      setError('Failed to post comment');
    }
  };

  const handleShare = async () => {
    if (shared) return;

    handleAction(async () => {
      const shareRef = doc(db, 'shares', `${postId}_${userId}`);
      const postRef = doc(db, 'posts', postId);

      await setDoc(shareRef, {
        userId,
        postId,
        createdAt: serverTimestamp()
      });
      await updateDoc(postRef, { shares: increment(1) });
      
      setShared(true);
      setStats(prev => ({
        ...prev,
        shares: prev.shares + 1
      }));
    });
  };

  return (
    <>
      {error && (
        <div className="p-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg">
          {error}
        </div>
      )}
    <div className="mt-1 pb-1 pt-1">
      <div className='flex items-center justify-between px-2 mb-2'>
      <button
        onClick={handleLike}
        disabled={isActionInProgress}
        className={`flex items-center justify-center gap-2 px-2 py-2.5 
        ${liked ? 'text-red-500' : 'text-gray-500 dark:text-[#8b949e]'}
        hover:bg-gray-50 dark:hover:bg-dark-secondary rounded-lg 
        hover:text-gray-900 dark:hover:text-[#c9d1d9]
        disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        <Heart 
        className={`h-5 w-5 transition-none ${liked ? 'fill-current' : ''}`}
        />
        <span className="text-sm font-medium">{stats.likes}</span>
      </button>

      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center justify-center gap-2 px-2 py-2.5 
        text-gray-500 dark:text-[#8b949e]
        hover:bg-gray-50 dark:hover:bg-dark-secondary rounded-lg 
        hover:text-gray-900 dark:hover:text-[#c9d1d9]"
      >
        <MessageCircle className="h-5 w-5 transition-none" />
        <span className="text-sm font-medium">{stats.comments}</span>
      </button>

      <button
        onClick={handleShare}
        disabled={shared || isActionInProgress}
        className={`flex items-center justify-center gap-2 px-2 py-2.5 
        ${shared ? 'text-blue-500' : 'text-gray-500 dark:text-[#8b949e]'}
        hover:bg-gray-50 dark:hover:bg-dark-secondary rounded-lg 
        hover:text-gray-900 dark:hover:text-[#c9d1d9]
        disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        <Share2 
        className={`h-5 w-5 transition-none ${shared ? 'fill-current' : ''}`}
        />
        <span className="text-sm font-medium">{stats.shares}</span>
      </button>
      </div>

      {showComments && (
        <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogTrigger asChild>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {comments.length > 0 ? comments.map(comment => (
            <RenderUserComment uid={comment.userId} commentContent={comment.content} key={comment.id} />
          )) : <span className='text-white'>No comments</span>}
          </ScrollArea>
          <div  className="flex items-center space-x-2">
            <Input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Leave a comment..." />
            <Button text='Submit' callback={()=>{handleComment()}} ></Button>
          </div>
        </DialogContent>
      </Dialog>
      )}
    </div>
    </>
  );
};

export default PostActions;
import { Timestamp } from "firebase/firestore";

export interface User {
    uid : string,
    AvatarURL : string,
    createdAt : Timestamp,
    email : string,
    firstName : string,
    isOnline : boolean,
    lastName : string,
    role : string ,
    username : string,
    hasProfile : boolean
}




 export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: Timestamp;
    conversationId: string;
  }

export interface Post{
        id: string,
        source: string,
        author: {
          name: string,
          avatar: string,
          title:string,
          id : string,
        },
        content: string,
        medias? : {url : string , type : string}[] | null,
        timestamp:string,
        likes: string,
        comments: string ,
        shares: string,
      }

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface Notification {
    link: string,
    imageUrl: string,
    from: string,
    message: string,
    time: string
}

export interface Job {
    id: number,
    title: string,
    company: string,
    logo: string,
    location: string,
    type:string,
    salary: number,
    isRemote: boolean,
    level: string,
    description: string,
    requirements: string[],
    companyDescription : string,
    postedAt:Timestamp,
    expiresAt: string,
    applicants: number
}

export interface PopularJob {
        id: number,
        title: string,
        company: string,
        newPositions: number,
        location: string,
        salary: string
      
}
export interface Trending{
  id: number,
  tag: string,
  posts: number,
  category: string,
  trending: boolean
}

export interface UserData {
  id: string;
  username: string;
  avatar: string;
  cover: string;
  bio: string;
  position: string;
  company: string;
  location: string;
  website: string;
  joinDate: string;
  following: number;
  followers: number;
  about: string;
  skills: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  status: string;
  featured: boolean;
  createdAt: string | Date;
}
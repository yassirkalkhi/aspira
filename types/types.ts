export interface Message {
    id: number;
    user: {
        name: string;
        avatar: string;
        isOnline: boolean;
        lastSeen: string;
    };
    conversation: {
        id: number;
        sender: 'them' | 'me';
        text: string;
        time: string;
    }[];
    unreadCount: number;
    lastMessage: string;
}

export interface Post{
        id: string,
        type: string,
        source: string,
        author: {
          name: string,
          avatar: string,
          title:string,
        },
        content: string,
        mediaURL? : string | null,
        timestamp:string,
        likes: string,
        comments: string ,
        shares: string,
      }

export interface PopularJob {
        id: number,
        title: string,
        company: string,
        newPositions: number,
        location: string,
        salary: string
      
}
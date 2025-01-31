import { Message, Notification } from "@/types/types";

export const popularJobs = [
    {
      id: 2,
      title: 'Product Designer',
      company: 'Design Co',
      newPositions: 5,
      location: 'New York',
      salary: '$90k - $120k'
    },
    {
      id: 3,
      title: 'Data Scientist',
      company: 'AI Solutions',
      newPositions: 3,
      location: 'San Francisco',
      salary: '$130k - $160k'
    },
    {
      id: 4,
      title: 'DevOps Engineer',
      company: 'Cloud Tech',
      newPositions: 6,
      location: 'Remote',
      salary: '$115k - $145k'
    }
  ];
  
  
  
 
  export const trending = [
    {
      id: 1,
      tag: '#TechNews',
      posts: 1234,
      category: 'Technology',
      trending: true
    },
    {
      id: 2,
      tag: '#Innovation',
      posts: 892,
      category: 'Business',
      trending: true
    },
    {
      id: 3,
      tag: '#Programming',
      posts: 654,
      category: 'Development',
      trending: true
    },
    {
      id: 4,
      tag: '#AI',
      posts: 432,
      category: 'Technology',
      trending: false
    },
    {
      id: 5,
      tag: '#DesignThinking',
      posts: 321,
      category: 'Design',
      trending: true
    }
  ];
  
  
  
  export const projects = [
    {
      id: 1,
      title: "Modern Social Platform",
      description: "A full-stack social media platform built with React, Node.js, and MongoDB",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
      technologies: ["React", "Node.js", "MongoDB", "Socket.io"],
      githubUrl: "https://github.com/username/project",
      liveUrl: "https://project-demo.com",
      status: "Completed",
      featured: true
    },
    {
      id: 2,
      title: "AI Image Generator",
      description: "An AI-powered image generation tool using OpenAI's DALL-E API",
      image: "https://images.unsplash.com/photo-1547954575-855750c57bd3?w=800&h=500&fit=crop",
      technologies: ["Python", "Flask", "OpenAI", "React"],
      githubUrl: "https://github.com/username/ai-project",
      liveUrl: "https://ai-demo.com",
      status: "In Progress",
      featured: true
    },
    {
      id: 3,
      title: "E-commerce Dashboard",
      description: "A comprehensive admin dashboard for e-commerce businesses",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
      technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
      githubUrl: "https://github.com/username/dashboard",
      liveUrl: "https://dashboard-demo.com",
      status: "Completed",
      featured: false
    },
    {
      id: 4,
      title: "Real-time Chat Application",
      description: "End-to-end encrypted chat application with real-time messaging",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop",
      technologies: ["React Native", "Firebase", "WebRTC"],
      githubUrl: "https://github.com/username/chat-app",
      liveUrl: "https://chat-demo.com",
      status: "In Progress",
      featured: true
    }
  ];

  export const Notifications : Notification[] = [
      {
        link: "#",
        imageUrl: "https://picsum.photos/200",
        from: "Jese Leos",
        message: "Hey, what's up? All set for the presentation?",
        time: "a few moments ago"
      },
      {
        link: "#",
        imageUrl: "https://picsum.photos/200",
        from: "John Doe",
        message: "Can you review the latest changes?",
        time: "10 minutes ago"
      },
      {
        link: "#",
        imageUrl: "https://picsum.photos/200",
        from: "Jane Smith",
        message: "Meeting rescheduled to 3 PM.",
        time: "30 minutes ago"
      },
      {
        link: "#",
        imageUrl: "https://picsum.photos/200",
        from: "Alice Johnson",
        message: "Don't forget to submit your report.",
        time: "1 hour ago"
      },
      {
        link: "#",
        imageUrl: "https://picsum.photos/200",
        from: "Bob Brown",
        message: "Happy Birthday!",
        time: "2 hours ago"
      },
  ]
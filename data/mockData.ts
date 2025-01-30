import { Message } from "@/types/types";

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
  
  export const posts = [
    {
      id: 1,
      type: 'text',
      source: 'friend',
      author: {
        name: 'John Doe',
        avatar: 'https://i.pravatar.cc/40?img=1',
        title: 'Senior Software Engineer at Tech Co'
      },
      content: "Just launched our new feature! Really excited about the possibilities this opens up. What do you think about the latest developments in AI and machine learning? #TechNews #Innovation",
      mediaURL : null,
      timestamp: '2 hours ago',
      likes: 42,
      comments: 12,
      shares: 5
    },
    {
      id: 2,
      type: 'video',
      source: 'company',
      author: {
        name: 'Sarah Wilson',
        avatar: 'https://i.pravatar.cc/40?img=2',
        title: 'Product Designer at Design Hub'
      },
      content: "Check out our latest product demo!",
      mediaURL: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnailUrl: 'https://picsum.photos/800/450',
      timestamp: '4 hours ago',
      likes: 89,
      comments: 24,
      shares: 15
    },
    {
      id: 3,
      type: 'image',
      source: 'suggested',
      author: {
        name: 'Mike Johnson',
        avatar: 'https://i.pravatar.cc/40?img=3',
        title: 'Tech Lead at StartUp Inc'
      },
      content: "Our team celebrating the successful launch of our new feature! 🎉",
      mediaURL: 'https://picsum.photos/800/600',
      timestamp: '6 hours ago',
      likes: 156,
      comments: 34,
      shares: 42
    },
    {
      id: 4,
      type: 'video',
      author: {
        name: 'Emily Chen',
        avatar: 'https://i.pravatar.cc/40?img=4',
        title: 'Senior Product Manager'
      },
      content: "Here's a walkthrough of our new features. Let me know what you think! 📱",
      mediaURL: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4',
      thumbnailUrl: 'https://picsum.photos/800/450?random=1',
      timestamp: '8 hours ago',
      likes: 234,
      comments: 45,
      shares: 28
    },
    {
      id: 5,
      type: 'image',
      author: {
        name: 'Alex Thompson',
        avatar: 'https://i.pravatar.cc/40?img=5',
        title: 'UI/UX Designer'
      },
      content: "New design system components hot off the press! What do you think about the color palette? 🎨",
      mediaURL: 'https://picsum.photos/800/600?random=2',
      timestamp: '12 hours ago',
      likes: 312,
      comments: 56,
      shares: 23
    }
  ];
  
  export const messages : Message[] = [
    {
      id: 1,
      user: {
        name: 'Sarah Wilson',
        avatar: 'https://i.pravatar.cc/32',
        isOnline: true,
        lastSeen: 'now'
      },
      conversation: [
        { id: 1, sender: 'them', text: "Hey, how's it going?", time: '10:30 AM' },
        { id: 2, sender: 'me', text: "I'm good! Just working on the new project.", time: '10:31 AM' },
        { id: 3, sender: 'them', text: "That's great! Need any help?", time: '10:32 AM' },
        { id: 4, sender: 'me', text: "I might need some feedback later!", time: '10:33 AM' }
      ],
      unreadCount: 2,
      lastMessage: "I might need some feedback later!"
    },
    {
      id: 2,
      user: {
        name: 'Alex Thompson',
        avatar: 'https://i.pravatar.cc/32',
        isOnline: true,
        lastSeen: '2m ago'
      },
      conversation: [
        { id: 1, sender: 'them', text: "Did you see the latest updates?", time: '11:20 AM' },
        { id: 2, sender: 'me', text: "Yes, they look amazing!", time: '11:22 AM' }
      ],
      unreadCount: 1,
      lastMessage: "Yes, they look amazing!"
    },
    {
      id: 3,
      user: {
        name: 'Emily Davis',
        avatar: 'https://i.pravatar.cc/32',
        isOnline: false,
        lastSeen: '1h ago'
      },
      conversation: [
        { id: 1, sender: 'them', text: "Let's catch up later...", time: '12:15 PM' }
      ],
      unreadCount: 0,
      lastMessage: "Let's catch up later..."
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
  
  export const jobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Google',
      logo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$120k - $180k',
      isRemote: true,
      level: 'Senior Level',
      description: 'We are looking for a Senior Software Engineer to join our growing team.',
      requirements: [
        '7+ years of experience in software development',
        'Strong expertise in React, Node.js, and TypeScript',
        'Experience with cloud platforms (AWS/GCP)',
        'Strong problem-solving skills'
      ],
      postedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 45
    },
    {
      id: 2,
      title: 'Product Designer',
      company: 'Microsoft',
      logo: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31',
      location: 'San Francisco, CA',
      type: 'Contract',
      salary: '$90k - $130k',
      isRemote: true,
      level: 'Mid Level',
      description: 'Join our design team to create beautiful and functional user experiences.',
      requirements: [
        '4+ years of product design experience',
        'Proficiency in Figma and design systems',
        'Strong portfolio showcasing UX/UI work',
        'Experience with user research'
      ],
      postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 68
    },
    {
      id: 3,
      title: 'Data Scientist',
      company: 'Amazon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png',
      location: 'Boston, MA',
      type: 'Full-time',
      salary: '$130k - $160k',
      isRemote: false,
      level: 'Senior Level',
      description: 'Looking for a Data Scientist to work on cutting-edge AI projects.',
      requirements: [
        'PhD in Computer Science or related field',
        'Experience with machine learning frameworks',
        'Strong mathematical background',
        'Published research is a plus'
      ],
      postedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 27
    },
    {
      id: 4,
      title: 'Frontend Developer',
      company: 'Meta',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/2560px-Meta_Platforms_Inc._logo.svg.png',
      location: 'morroco, safi',
      type: 'Part-time',
      salary: '$60k - $80k',
      isRemote: true,
      level: 'Entry Level',
      description: 'Seeking a Frontend Developer to join our web development team.',
      requirements: [
        '2+ years of frontend development experience',
        'Strong HTML, CSS, and JavaScript skills',
        'Experience with React or Vue.js',
        'Good eye for design'
      ],
      postedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 92
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      company: 'Apple',
      logo: 'https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png',
      location: 'Seattle, WA',
      type: 'Full-time',
      salary: '$140k - $180k',
      isRemote: true,
      level: 'Senior Level',
      description: 'Join our DevOps team to build and maintain cloud infrastructure.',
      requirements: [
        '5+ years of DevOps experience',
        'Strong AWS/Azure knowledge',
        'Experience with Kubernetes and Docker',
        'Infrastructure as Code expertise'
      ],
      postedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 31
    },
    {
      id: 6,
      title: 'UX Researcher',
      company: 'Netflix',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png',
      location: 'Chicago, IL',
      type: 'Full-time',
      salary: '$85k - $120k',
      isRemote: false,
      level: 'Mid Level',
      description: 'Looking for a UX Researcher to conduct user studies and improve our products.',
      requirements: [
        '3+ years of UX research experience',
        'Experience with various research methodologies',
        'Strong analytical and presentation skills',
        'Background in psychology or related field'
      ],
      postedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 54
    },
    {
      id: 7,
      title: 'Mobile Developer',
      company: 'Spotify',
      logo: 'https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png',
      location: 'Miami, FL',
      type: 'Full-time',
      salary: '$100k - $150k',
      isRemote: true,
      level: 'Mid Level',
      description: 'Join our mobile development team to create high-quality mobile applications.',
      requirements: [
        '5+ years of mobile development experience',
        'Strong Android and iOS development skills',
        'Experience with React Native or Flutter',
        'Good eye for design'
      ],
      postedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 73
    },
    {
      id: 8,
      title: 'Technical Writer',
      company: 'Adobe',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Adobe_Corporate_Logo.png/1280px-Adobe_Corporate_Logo.png',
      location: 'Portland, OR',
      type: 'Contract',
      salary: '$70k - $90k',
      isRemote: true,
      level: 'Entry Level',
      description: 'Looking for a Technical Writer to join our content team.',
      requirements: [
        '2+ years of technical writing experience',
        'Strong communication skills',
        'Experience with Markdown and HTML',
        'Ability to write clear and concise documentation'
      ],
      postedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 41
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
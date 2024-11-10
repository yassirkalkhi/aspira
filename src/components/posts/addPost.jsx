// src/components/posts/AddPost.jsx
import { useState, useRef } from 'react';
import { 
  Image, 
  FileText, 
  Calendar,
  Video,
  X,
} from 'lucide-react';

const AddPost = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...imageUrls]);
    setIsExpanded(true);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Action buttons data with black colors
  const actionButtons = [
    {
      icon: Image,
      label: 'Media',
      onClick: () => fileInputRef.current?.click()
    },
    {
      icon: Calendar,
      label: 'Event'
    },
    {
      icon: FileText,
      label: 'Article'
    },
    {
      icon: Video,
      label: 'Video'
    }
  ];

  return (
    <div className="bg-white dark:bg-dark-primary rounded-lg shadow-sm">
      {/* Main Input Area */}
      <div className="p-4">
        <div className="flex gap-3">
          <img
            src="https://github.com/shadcn.png"
            alt="User avatar"
            className="h-12 w-12 rounded-full"
          />
          <button
            onClick={() => setIsExpanded(true)}
            className={`flex-1 text-left px-4 py-3 rounded-full border 
                     border-gray-300 dark:border-dark-secondary 
                     hover:bg-gray-100 dark:hover:bg-dark-secondary 
                     text-gray-500 dark:text-white/50 transition-colors
                     ${isExpanded ? 'bg-gray-100 dark:bg-dark-secondary' : ''}`}
          >
            Start a post
          </button>
        </div>

        {/* Expanded Input */}
        {isExpanded && (
          <div className="mt-4">
            <textarea
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What do you want to talk about?"
              className="w-full bg-transparent resize-none outline-none 
                       text-gray-700 dark:text-[#c9d1d9] 
                       placeholder-gray-500 dark:placeholder-[#8b949e]
                       min-h-[120px]"
              rows={4}
            />

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="rounded-lg w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 rounded-full 
                             bg-[#0d1117]/75 text-[#c9d1d9] 
                             opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="border-t dark:border-[#21262d] px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left side buttons */}
          <div className="flex items-center -ml-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              multiple
              accept="image/*"
              className="hidden"
            />
            
            {actionButtons.map((button, index) => {
              const Icon = button.icon;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={button.onClick}
                  className="inline-flex items-center p-2 rounded transition-colors gap-2
                         hover:bg-gray-100 dark:hover:bg-dark-secondary group"
                >
                  <Icon className="h-5 w-5 text-gray-900/60 dark:text-[#c9d1d9]" />
                  <span className="text-sm hidden sm:block text-gray-900 dark:text-[#c9d1d9]">
                    {button.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right side buttons */}
          {isExpanded && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsExpanded(false);
                  setContent('');
                  setImages([]);
                }}
                className="px-3 py-1.5 text-sm font-medium 
                         text-gray-900 dark:text-[#c9d1d9] 
                         hover:bg-gray-100 dark:hover:bg-dark-secondary 
                         rounded transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!content.trim() && images.length === 0}
                className="px-4 py-1.5 text-sm font-medium  bg-theme-primary text-white
                         rounded disabled:opacity-50 
                         transition-all"
              >
                Post
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPost;
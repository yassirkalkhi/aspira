import { TrendingUp } from "lucide-react";

const TrendingTopics = ({ topics }) => {
    return (
      <div className="bg-white dark:bg-dark-primary rounded-lg shadow-sm p-4">
        <h2 className="font-semibold mb-4 text-black dark:text-[#c9d1d9]">Trending</h2>
        {topics.map((topic) => (
          <div key={topic.id} className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-5 w-5 text-theme-primary" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-[#c9d1d9]">{topic.tag}</p>
              <p className="text-xs text-gray-500 dark:text-[#8b949e]">{topic.posts} posts</p>
            </div>
          </div>
        ))}
      </div>
    );
  };
  export default TrendingTopics;
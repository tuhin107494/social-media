import React from 'react';
import { User, Story } from '../types';
import { Loader2, Plus } from 'lucide-react';

interface Props {
  currentUser: User;
  stories: Story[];
  isUploadingStory: boolean;
  onStoryClick: () => void;
}

const FeedStories: React.FC<Props> = ({ currentUser, stories, isUploadingStory, onStoryClick }) => {
  return (
    <div className="flex gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      <div 
        className="relative flex-shrink-0 w-32 h-48 rounded-2xl overflow-hidden cursor-pointer shadow-sm group bg-gray-200"
        onClick={onStoryClick}
      >
         {isUploadingStory ? (
           <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
             <Loader2 className="w-6 h-6 animate-spin text-primary" />
           </div>
         ) : (
            <>
             <img src={currentUser.avatar} alt="My Story" className="w-full h-3/4 object-cover filter brightness-75" />
             <div className="absolute inset-x-0 bottom-0 h-1/4 bg-white z-10 flex flex-col items-center justify-end pb-3">
                <span className="text-xs font-bold text-gray-900">Your Story</span>
             </div>
             <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
                <div className="bg-primary text-white p-1.5 rounded-full border-4 border-white transition-transform group-hover:scale-110">
                   <Plus className="w-4 h-4" />
                </div>
             </div>
            </>
         )}
      </div>

      {stories.map(story => (
         <div key={story.id} className="relative flex-shrink-0 w-32 h-48 rounded-2xl overflow-hidden cursor-pointer shadow-sm group bg-black">
            <img src={story.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
            <div className="absolute top-3 right-3 p-0.5 bg-primary rounded-full ring-2 ring-primary ring-offset-2 ring-offset-transparent">
               <img src={story.user.avatar} className="w-8 h-8 rounded-full border-2 border-white" alt="" />
            </div>
            <div className="absolute bottom-3 left-3 right-3">
               <p className="text-white text-xs font-semibold truncate">{story.user.firstName} {story.user.lastName}</p>
            </div>
         </div>
      ))}
    </div>
  );
};

export default FeedStories;

import React from 'react';
import { User } from '../types';
import { Image as ImageIcon, Video, Calendar, FileText, X, Send } from 'lucide-react';
import { Button, Input } from 'antd';

interface Props {
  currentUser: User;
  newPostContent: string;
  setNewPostContent: (v: string) => void;
  newPostImage: string;
  setNewPostImage: (v: string) => void;
  newPostPrivacy: 'public'|'private';
  setNewPostPrivacy: (v: 'public'|'private') => void;
  isPosting: boolean;
  postError?: string;
  onOpenFile: () => void;
  onCreatePost: () => void;
}

const CreatePostCard: React.FC<Props> = ({ currentUser, newPostContent, setNewPostContent, newPostImage, setNewPostImage, newPostPrivacy, setNewPostPrivacy, isPosting, postError, onOpenFile, onCreatePost }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex gap-3 mb-4 items-center  pb-4">
         <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full bg-gray-200" />
         <div className="flex-1 relative">
            <Input
              type="text" 
              placeholder="Write something ..." 
             className="!border-none"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
         </div>
      </div>

      {newPostImage && (
        <div className="mb-4 relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
           {newPostImage.startsWith('data:video') ? (
               <video src={newPostImage} controls className="w-full max-h-64 object-contain" />
           ) : (
               <img src={newPostImage} alt="Preview" className="w-full max-h-64 object-contain" />
           )}
           <button 
            onClick={() => setNewPostImage('')}
            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition-colors"
           >
             <X className="w-4 h-4" />
           </button>
        </div>
      )}

      {postError && (
         <div className="mb-4 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200 font-medium">
            {postError}
         </div>
      )}

      <div className="flex items-center justify-between bg-blue-50 p-3 rounded-xl">
        <div className="flex gap-1 md:gap-4 overflow-x-auto">
          <button 
            onClick={onOpenFile}
            className="flex items-center gap-1.5 px-3 py-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap"
          >
            <ImageIcon className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium">Photo</span>
          </button>
          <button 
            onClick={onOpenFile}
            className="flex items-center gap-1.5 px-3 py-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap"
          >
            <Video className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium">Video</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap">
            <Calendar className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium">Event</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap">
            <FileText className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium">Article</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
            <Button 
                onClick={onCreatePost} 
                disabled={(!newPostContent.trim() && !newPostImage) || isPosting}
                className="w-auto !p-6 text-sm flex items-center gap-2 !bg-blue-500 text-white !font-bold"
            >
            <Send className="w-4 h-4" />
            Post
            </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostCard;

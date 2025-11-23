import React, { useState } from 'react';
import { Post, Comment } from '../types';
import { MoreHorizontal, Heart, MessageCircle, Share2, Send } from 'lucide-react';

const CommentNode: React.FC<{
  comment: Comment;
  onReply: (text: string, parentId: string) => void;
  depth?: number;
}> = ({ comment, onReply, depth = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleSubmit = () => {
    if (replyText.trim()) {
      onReply(replyText, comment.id);
      setIsReplying(false);
      setReplyText('');
    }
  };

  return (
    <div className={`flex gap-2 items-start mt-3 ${depth > 0 ? 'ml-4' : ''}`}>
      <img src={comment.user.avatar} alt="" className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="bg-gray-200 rounded-2xl px-3 py-2 inline-block">
          <p className="text-xs font-bold">{comment.user.firstName}</p>
          <p className="text-sm text-gray-800 break-words">{comment.content}</p>
        </div>
        <div className="flex gap-3 px-2 mt-1 text-xs text-gray-500 font-medium items-center">
           <button className="hover:underline">Like</button>
           <button 
             className="hover:underline text-primary" 
             onClick={() => setIsReplying(!isReplying)}
           >
             Reply
           </button>
           <span>2m</span>
        </div>

        {isReplying && (
          <div className="flex gap-2 mt-2 items-center">
             <input 
                autoFocus
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder={`Reply to ${comment.user.firstName}...`}
                className="flex-1 bg-gray-100 rounded-full px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-primary"
             />
             <button onClick={handleSubmit} className="text-primary hover:bg-blue-50 p-1 rounded-full">
               <Send className="w-3 h-3" />
             </button>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
           <div className="pl-2 mt-2 border-l-2 border-gray-200">
              {comment.replies.map(reply => (
                <CommentNode key={reply.id} comment={reply} onReply={onReply} depth={depth + 1} />
              ))}
           </div>
        )}
      </div>
    </div>
  );
};

const PostCard: React.FC<{ 
  post: Post; 
  currentUserId: string; 
  onLike: () => void;
  onComment: (text: string, parentId?: string) => void;
  timeAgo: string;
}> = ({ post, currentUserId, onLike, onComment, timeAgo }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const isLiked = post.likes.includes(currentUserId);
  const isVideo = post.imageUrl?.startsWith('data:video') || post.imageUrl?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 flex justify-between items-start">
        <div className="flex gap-3">
          <img src={post.user.avatar} alt="" className="w-10 h-10 rounded-full bg-gray-200" />
          <div>
            <h4 className="font-bold text-gray-900 text-sm">{post.user.firstName} {post.user.lastName}</h4>
            <div className="flex items-center text-xs text-gray-500 gap-1">
              <span>{timeAgo}</span>
              <span>•</span>
              <span>{post.privacy === 'public' ? 'Public' : 'Private'}</span>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:bg-gray-100 p-1 rounded-full">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {post.content && (
        <div className="px-4 pb-2">
            <p className="text-gray-800 whitespace-pre-wrap mb-3">{post.content}</p>
        </div>
      )}
      {post.imageUrl && (
        <div className="w-full h-auto bg-black/5 border-y border-gray-100">
           {isVideo ? (
               <video src={post.imageUrl} controls className="w-full max-h-[500px] object-contain" />
           ) : (
               <img src={post.imageUrl} alt="Post content" className="w-full h-auto max-h-[500px] object-contain" />
           )}
        </div>
      )}

      <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500 border-b border-gray-50">
         <div className="flex items-center gap-1">
            {post.likes.length > 0 && (
              <>
                <div className="bg-primary text-white p-0.5 rounded-full">
                   <Heart className="w-2 h-2 fill-current" />
                </div>
                <span>{post.likes.length} Likes</span>
              </>
            )}
         </div>
         <div className="flex gap-3">
            <span>{post.comments.length} Comments</span>
         </div>
      </div>

      <div className="px-2 py-1 flex items-center justify-between">
        <button 
          onClick={onLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium ${isLiked ? 'text-primary' : 'text-gray-600'}`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          Like
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-600"
        >
          <MessageCircle className="w-5 h-5" />
          Comment
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-600">
          <Share2 className="w-5 h-5" />
          Share
        </button>
      </div>

      {showComments && (
        <div className="p-4 bg-gray-50 border-t">
          <div className="space-y-4 mb-4">
             {post.comments.map(comment => (
               <CommentNode 
                  key={comment.id} 
                  comment={comment} 
                  onReply={(text, parentId) => onComment(text, parentId)} 
               />
             ))}
          </div>
          <div className="flex gap-2">
             <img src={`https://ui-avatars.com/api/?name=${currentUserId}`} alt="" className="w-8 h-8 rounded-full" />
             <div className="flex-1 flex relative">
                <input 
                   type="text" 
                   value={commentText}
                   onChange={(e) => setCommentText(e.target.value)}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter' && commentText.trim()) {
                       onComment(commentText);
                       setCommentText('');
                     }
                   }}
                   placeholder="Write a comment..." 
                   className="w-full rounded-full bg-gray-100 px-4 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button 
                  onClick={() => {
                    if (commentText.trim()) {
                      onComment(commentText);
                      setCommentText('');
                    }
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-primary p-1 hover:bg-blue-50 rounded-full"
                >
                  <Send className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;

import React, { useState, useEffect, useRef } from 'react';
import { User, Post, Story } from '../types';

import FeedNavbar from './FeedNavbar';
import LeftSidebar from './FeedLeftSidebar';
import RightSidebar from './FeedRightSidebar';
import PostCard from './PostCard';
import CreatePostCard from './CreatePostCard';
import FeedStories from './FeedStories';


interface FeedProps {
    currentUser: User;
    onLogout: () => void;
}

const Feed: React.FC<FeedProps> = ({ currentUser, onLogout }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Create Post State
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostImage, setNewPostImage] = useState('');
    const [newPostPrivacy, setNewPostPrivacy] = useState<'public' | 'private'>('public');
    const [isPosting, setIsPosting] = useState(false);
    const [postError, setPostError] = useState('');
    const postFileInputRef = useRef<HTMLInputElement>(null);

    // Create Story State
    const [isUploadingStory, setIsUploadingStory] = useState(false);
    const storyFileInputRef = useRef<HTMLInputElement>(null);


    const events = [
        { id: '1', title: 'Tech Startup Meetup', location: 'Modina Market, Sylhet', date: 'Nov 25', imageUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSx7kSpkDFKydq2-qUOBPiNOra50wSovAwO5OyqzhUx2yMcN2uYveMhGItyvRAUMwo5rtapOY1OHhwT42c8qI_UHxop342w2JH0MFlgfN7-LV-EGm2taxgnukuXNnVMRr4izyvBb=s1360-w1360-h1020-rw' },
        { id: '2', title: 'Tech Contest', location: 'Modina Market, Sylhet', date: 'Nov 28', imageUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxPkGCOa6Lj_fx6wlFPkxpG1PdKt2KcUFfJQ7IO-YM5cjQssRPqO5tUJHU5WQC9yFUqjBA04ds9BF_gJ_pna-dpJvWEIhMoOXvI3HnF6NLp3sIQpXcWY2eby8uIfjmXkW2HFyNXVeWwDZTD=s1360-w1360-h1020-rw' },
    ];


    //   const loadData = async () => {
    //     try {
    //       const [fetchedPosts, fetchedUsers, fetchedStories] = await Promise.all([
    //         getPosts(currentUser),
    //         getAllUsers(),
    //         getStories()
    //       ]);
    //       setPosts(fetchedPosts);
    //       setUsers(fetchedUsers);
    //       setStories(fetchedStories);
    //     } catch (error) {
    //       console.error("Failed to load feed", error);
    //     } finally {
    //       setIsLoading(false);
    //     }
    //   };

    useEffect(() => {
        // loadData();
    }, [currentUser]);

    // Utility to compress images
    const processFile = async (file: File): Promise<string> => {
        // Basic validation
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            throw new Error("File is too large. Please upload files smaller than 10MB.");
        }

        // Return Video directly (cannot compress client-side easily without heavy libs)
        if (file.type.startsWith('video/')) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });
        }

        // Compress Image
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Resize if too big (max 1024px)
                    const MAX_SIZE = 1024;
                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height *= MAX_SIZE / width;
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width *= MAX_SIZE / height;
                            height = MAX_SIZE;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG 0.7 quality
                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                };
                img.onerror = (e) => reject(new Error("Failed to load image"));
            };
            reader.onerror = (e) => reject(new Error("Failed to read file"));
        });
    };

    const handleCreatePost = async () => {

    };




    const handleLike = async (postId: string) => {

    };

    const formatTime = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        return new Date(timestamp).toLocaleDateString();
    };


    return (
        <div className="min-h-screen bg-[#F0F2F5]">

            <FeedNavbar currentUser={currentUser} onLogout={onLogout} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col lg:flex-row gap-6">

                    <LeftSidebar users={users} events={events} />
                    <div className="flex-1 min-w-0">
                        <FeedStories currentUser={currentUser} stories={stories} isUploadingStory={isUploadingStory} onStoryClick={() => !isUploadingStory && storyFileInputRef.current?.click()} />

                        <CreatePostCard
                            currentUser={currentUser}
                            newPostContent={newPostContent}
                            setNewPostContent={setNewPostContent}
                            newPostImage={newPostImage}
                            setNewPostImage={setNewPostImage}
                            newPostPrivacy={newPostPrivacy}
                            setNewPostPrivacy={setNewPostPrivacy}
                            isPosting={isPosting}
                            postError={postError}
                            onOpenFile={() => postFileInputRef.current?.click()}
                            onCreatePost={handleCreatePost}
                        />

                        {/* Posts List */}
                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-white rounded-xl shadow-sm p-4 h-64 animate-pulse">
                                        <div className="flex gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                            <div className="flex-1 space-y-2 py-1">
                                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                                            </div>
                                        </div>
                                        <div className="h-32 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {posts.map(post => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        // currentUserId={currentUser.id}
                                        onLike={() => handleLike(post.id)}
                                        // onComment={(text, parentId) => handleComment(post.id, text, parentId)}
                                        timeAgo={formatTime(post.createdAt)}
                                    />
                                ))}
                                {posts.length === 0 && (
                                    <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">
                                        No posts yet. Be the first to share something!
                                    </div>
                                )}
                            </div>
                        )}

                    </div>

          


                </div>
            </div>
            </div>
            );
};

            export default Feed;
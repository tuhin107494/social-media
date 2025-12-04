<?php
namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use App\Jobs\ToggleLikeJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class LikeController extends Controller
{
    public function toggle(Request $request)
    {
        $request->validate([
            'likeable_id' => 'required|integer',
            'likeable_type' => 'required|string|in:post,comment',
        ]);

        $userId = auth()->id();

        // Identify target
        $likeable = $request->likeable_type === 'post'
            ? Post::findOrFail($request->likeable_id)
            : Comment::findOrFail($request->likeable_id);

        $type = $likeable::class;

        // Redis keys
        $likesSetKey = "{$request->likeable_type}:{$likeable->id}:liked_users";
        $likesCountKey = "{$request->likeable_type}:{$likeable->id}:likes_count";

        // Ensure counter is initialized in Redis
        Redis::setnx($likesCountKey, $likeable->likes_count);

        // Check if user already liked (O(1) Redis set)
        $alreadyLiked = Redis::sismember($likesSetKey, $userId);

        if ($alreadyLiked) {
            // Unlike
            Redis::srem($likesSetKey, $userId);   // remove user from set
            Redis::decr($likesCountKey);          // decrement counter
            ToggleLikeJob::dispatchAfterResponse($likeable, $userId, false); // DB update
            $liked = false;

        } else {
            // Like
            Redis::sadd($likesSetKey, $userId);   // add user to set
            Redis::incr($likesCountKey);          // increment counter
            ToggleLikeJob::dispatchAfterResponse($likeable, $userId, true); // DB update
            $liked = true;
        }

        return response()->json([
            'liked' => $liked,
            'likes_count' => Redis::get($likesCountKey),
        ]);
    }
}

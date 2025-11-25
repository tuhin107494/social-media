<?php
namespace App\Http\Controllers;
use App\Models\Like;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\Response;


class LikeController extends Controller
{
    public function toggle(Request $request)
    {
        $request->validate([
            'likeable_id' => 'required|integer',
            'likeable_type_id' => 'required|integer',
        ]);

        $likeableType = Like::getLikeableModel($request->likeable_type_id);

        $likeable = $likeableType::findOrFail($request->likeable_id);

        $existingLike = Like::where('user_id', auth()->id())
            ->where('likeable_id', $request->likeable_id)
            ->where('likeable_type', $likeableType)
            ->first();

        if ($existingLike) {
            $existingLike->delete();
            $liked = false;
        } else {
            Like::create([
                'user_id' => auth()->id(),
                'likeable_id' => $request->likeable_id,
                'likeable_type' => $likeableType,
            ]);
            $liked = true;
        }
     
        // Return liked status and updated like count
        return response()->json([
            'liked' => $liked,
            'likes_count' => $likeable->likes()->count(),
        ], Response::HTTP_OK);
    }
}

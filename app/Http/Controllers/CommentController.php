<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\CommentResource;

class CommentController extends Controller
{
    public function store(Request $request, Post $post)
    {
        $request->validate([
            'body' => 'required|string',
            'parent_id' => 'nullable|exists:comments,id',
        ]);
   
        $filePaths = $this->storeUploadedFiles($request);

        $comment = $post->comments()->create([
            'user_id' => $request->user()->id,
            'body' => $request->body,
            'parent_id' => $request->parent_id,
            'image_path' => $filePaths ? json_encode($filePaths) : null,
        ]);

       return new CommentResource($comment->load('user', 'children.user'));
    }

    public function update(Request $request, Comment $comment)
    {
        $this->authorize('update', $comment);

        $request->validate(['body' => 'required|string']);

        $comment->update(['body' => $request->body]);

        return new CommentResource($comment);
    }

    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment);
        $comment->delete();
        return response()->json()->noContent();
    }
    
     private function storeUploadedFiles(Request $request): array
    {
        if (!$request->hasFile('files')) {
            return [];
        }

        $paths = [];
        foreach ($request->file('files') as $file) {
            $paths[] = $file->store('comments', 'public');
        }

        return $paths;
    }
}

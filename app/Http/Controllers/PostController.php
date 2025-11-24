<?php

namespace App\Http\Controllers;


use App\Models\Post;
use Illuminate\Http\Request;
use App\Http\Requests\PostRequest;
use App\Http\Resources\PostResource;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with(['user', 'comments', 'likes'])
            ->where('is_public', true)
            ->latest()
            ->paginate(15);
        return PostResource::collection($posts);
    }

    public function store(PostRequest $request)
    {
        $stored = $this->storeUploadedFiles($request);

        $validated = $request->validated();
        $data = ['user_id' => $request->user()->id];

        if (array_key_exists('body', $validated)) {
            $data['body'] = $validated['body'];
        }
        if (array_key_exists('is_public', $validated)) {
            $data['is_public'] = $validated['is_public'];
        }

        if (!empty($stored)) {
            $data['image_path'] = count($stored) === 1 ? $stored[0] : json_encode($stored);
        }

        $post = Post::create($data);

        return (new PostResource($post))->response()->setStatusCode(201);
    }


    public function show(Post $post)
    {
        $post->load(['user', 'comments.user', 'likes']);
        return new PostResource($post);
    }

    public function update(Request $request, Post $post)
    {
        $this->authorize('update', $post); // optional: add policy

        $validated = $request->validate([
            'body' => 'nullable|string',
            'files' => 'nullable|array',
            'files.*' => 'file|mimes:jpg,jpeg,png,gif,mp4,mov,webm|max:10240',
            'image_path' => 'nullable|string',
            'is_public' => 'boolean',
        ]);

        $stored = $this->storeUploadedFiles($request);

        $data = [];
        if (array_key_exists('body', $validated)) {
            $data['body'] = $validated['body'];
        }
        if (array_key_exists('is_public', $validated)) {
            $data['is_public'] = $validated['is_public'];
        }

        if (!empty($stored)) {
            $data['image_path'] = count($stored) === 1 ? $stored[0] : json_encode($stored);
        } elseif (array_key_exists('image_path', $validated)) {
            $data['image_path'] = $validated['image_path'];
        }

        $post->update($data);

        return new PostResource($post);
    }

    private function storeUploadedFiles(Request $request): array
    {
        if (! $request->hasFile('files')) {
            return [];
        }

        $paths = [];
        foreach ($request->file('files') as $file) {
            $paths[] = $file->store('posts', 'public');
        }

        return $paths;
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post); // optional
        $post->delete();
        return response()->noContent();
    }
}

<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'      => $this->id,
            'content' => $this->body,
            'image'   => $this->image,
            'author'  => [
                'id'   => $this->user->id,
                'name' => $this->user->name,
            ],
            'likes_count'    => $this->likes()->count(),
            'comments_count' => $this->comments()->count(),
            'created_at' => $this->created_at->diffForHumans()
        ];
    }
}

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FriendshipController;

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);


Route::middleware('auth:api')->group(function () {

    // Auth user actions
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);

    // Profile
    Route::apiResource('profiles', ProfileController::class)->only(['show', 'update']);

    // Posts
    Route::apiResource('posts', PostController::class);

    // Comments inside posts
    Route::apiResource('posts.comments', CommentController::class)
        ->shallow()
        ->only(['index', 'store', 'update', 'destroy']);

    // Likes
    Route::post('/posts/{post}/like', [LikeController::class, 'store']);
    Route::delete('/posts/{post}/like', [LikeController::class, 'destroy']);

    // Friendships (Follow/Unfollow)
    Route::post('/follow/{user}', [FriendshipController::class, 'follow']);
    Route::delete('/unfollow/{user}', [FriendshipController::class, 'unfollow']);
    Route::get('/friends', [FriendshipController::class, 'index']);
});


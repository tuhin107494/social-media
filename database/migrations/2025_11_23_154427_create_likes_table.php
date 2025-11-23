<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLikesTable extends Migration
{
    public function up()
    {
        Schema::create('likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // polymorphic fields
            $table->unsignedBigInteger('likeable_id');
            $table->string('likeable_type');

            $table->timestamps();

            $table->unique(['user_id', 'likeable_id', 'likeable_type'], 'user_like_unique');
        });
    }

    public function down()
    {
        Schema::dropIfExists('likes');
    }
}

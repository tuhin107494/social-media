<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username'      => ['required', 'string', 'max:50', 'unique:users,username'],
            'email'         => ['required', 'email', 'max:255', 'unique:users,email'],
            'password'      => ['required', 'string', 'min:6', 'confirmed'],
            'first_name'    => ['required', 'string', 'max:255'],
            'last_name'     => ['nullable', 'string', 'max:255'],
            'bio'           => ['nullable', 'string', 'max:300'],
            'gender'        => ['nullable', 'in:male,female,other'],
            'dob'           => ['nullable', 'date', 'before:today'],
            'profile_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'cover_image'   => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:4096'],
        ];
    }
}

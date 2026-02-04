<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StartWorkShiftRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'exists:employees,code'],
        ];
    }

    public function messages()
    {
        return [
            'code.exists' => 'The provided employee code is invalid.',
        ];
    }
}

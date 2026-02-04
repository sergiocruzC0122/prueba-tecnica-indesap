<?php

use App\Http\Controllers\API\WorkShiftController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('work-shifts')->group(function () {
    Route::post('/start', [WorkShiftController::class, 'start']);
    Route::post('/end', [WorkShiftController::class, 'end']);
    Route::get('/', [WorkShiftController::class, 'index']);
});

<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\EndWorkShiftRequest;
use App\Http\Requests\StartWorkShiftRequest;
use App\Services\WorkShiftService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WorkShiftController extends Controller
{
    use \App\Traits\ApiResponse;

    protected $workShiftService;

    public function __construct(WorkShiftService $workShiftService)
    {
        $this->workShiftService = $workShiftService;
    }

    public function start(StartWorkShiftRequest $request)
    {
        try {
            $workShift = $this->workShiftService->startShift($request->code);
            return $this->success($workShift, 'Work shift started successfully.');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    public function end(EndWorkShiftRequest $request)
    {
        try {
            $workShift = $this->workShiftService->endShift($request->code);
            return $this->success($workShift, 'Work shift ended successfully.');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    public function index(Request $request)
    {
        try {
            $history = $this->workShiftService->getHistory($request->query('code'));
            return $this->success($history);
        } catch (\Exception $e) {
            return $this->error('Error retrieving history: ' . $e->getMessage(), 500);
        }
    }
}

<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\WorkShift;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

class WorkShiftService
{
    public function startShift(string $code): WorkShift
    {
        $employee = Employee::where('code', $code)->firstOrFail();

        $activeShift = WorkShift::where('employee_id', $employee->id)
            ->whereNull('end_time')
            ->first();

        if ($activeShift) {
            throw new \Exception('Employee already has an active shift.');
        }

        return WorkShift::create([
            'employee_id' => $employee->id,
            'start_time' => Carbon::now(),
        ]);
    }
    public function endShift(string $code): WorkShift
    {
        $employee = Employee::where('code', $code)->firstOrFail();
        $activeShift = WorkShift::where('employee_id', $employee->id)
            ->whereNull('end_time')
            ->first();

        if (!$activeShift) {
            throw new \Exception('No active shift found for this employee.');
        }

        $endTime = Carbon::now();
        $startTime = Carbon::parse($activeShift->start_time);
        
        $diff = $startTime->diff($endTime);
        $totalTime = $diff->format('%H:%I:%S');

        $activeShift->update([
            'end_time' => $endTime,
            'total_time' => $totalTime,
        ]);

        return $activeShift;
    }
    public function getHistory(?string $code = null): Collection
    {
        $query = WorkShift::with('employee');

        if ($code) {
            $query->whereHas('employee', function ($q) use ($code) {
                $q->where('code', $code);
            });
        }

        return $query->orderBy('start_time', 'desc')->get();
    }
}

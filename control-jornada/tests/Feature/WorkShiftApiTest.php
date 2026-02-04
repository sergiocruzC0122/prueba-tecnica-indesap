<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\WorkShift;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class WorkShiftApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Seed the specific seeder or create factory data
        $this->seed(\Database\Seeders\EmployeeSeeder::class);
    }

    public function test_employee_can_start_shift()
    {
        $response = $this->postJson('/api/work-shifts/start', [
            'code' => 'EMP001',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => ['id', 'start_time', 'employee_id']
            ]);

        $this->assertDatabaseHas('work_shifts', [
            'employee_id' => Employee::where('code', 'EMP001')->first()->id,
        ]);
    }

    public function test_employee_cannot_start_double_shift()
    {
        // Start first shift
        $this->postJson('/api/work-shifts/start', ['code' => 'EMP001']);

        // Try start again
        $response = $this->postJson('/api/work-shifts/start', ['code' => 'EMP001']);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'Employee already has an active shift.'
            ]);
    }

    public function test_employee_can_end_shift()
    {
        // Start shift
        $this->postJson('/api/work-shifts/start', ['code' => 'EMP001']);

        // End shift
        $response = $this->postJson('/api/work-shifts/end', ['code' => 'EMP001']);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => ['id', 'end_time', 'total_time']
            ]);

        $shift = WorkShift::where('employee_id', Employee::where('code', 'EMP001')->first()->id)->first();
        $this->assertNotNull($shift->end_time);
        $this->assertNotNull($shift->total_time);
    }

    public function test_employee_cannot_end_without_active_shift()
    {
        $response = $this->postJson('/api/work-shifts/end', ['code' => 'EMP001']);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'No active shift found for this employee.'
            ]);
    }

    public function test_get_history()
    {
        $this->postJson('/api/work-shifts/start', ['code' => 'EMP001']);
        $this->postJson('/api/work-shifts/end', ['code' => 'EMP001']);

        $response = $this->getJson('/api/work-shifts?code=EMP001');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_404_response()
    {
        $response = $this->getJson('/api/non-existent-route');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'Resource not found.',
                'data' => null
            ]);
    }
}

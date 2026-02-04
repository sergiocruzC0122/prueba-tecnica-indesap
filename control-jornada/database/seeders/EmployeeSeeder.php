<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $employees = [];
        for ($i = 1; $i <= 10; $i++) {
            $employees[] = [
                'first_name' => 'Employee ' . $i,
                'last_name' => 'Test',
                'code' => 'EMP' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'email' => 'employee' . $i . '@example.com',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('employees')->insert($employees);
    }
}

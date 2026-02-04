<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Throwable $e, \Illuminate\Http\Request $request) {
            if ($request->is('api/*')) {
                $status = 500;
                $message = 'Server Error';
                $data = null;

                if ($e instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
                    $status = 404;
                    $message = 'Resource not found.';
                } elseif ($e instanceof \Illuminate\Validation\ValidationException) {
                    $status = 422;
                    $message = $e->getMessage();
                    return response()->json([
                        'status' => 'error',
                        'message' => $message,
                        'data' => $e->errors(),
                    ], $status);
                } else {
                    // Only show debug info for unknown 500 errors
                    if (config('app.debug')) {
                        $data = [
                            'exception' => get_class($e),
                            'message' => $e->getMessage(),
                            'trace' => $e->getTrace(),
                        ];
                    }
                }

                return response()->json([
                    'status' => 'error',
                    'message' => $message,
                    'data' => $data,
                ], $status);
            }
        });
    })->create();

<?php

namespace App\Providers;

use App\Models\UserLevel;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('global', function (Request $request) {
            return [
                Limit::perMinute(60)->by($request->ip())->response(function () {
                    return response('Too Many Requests', 429)
                        ->header('Retry-After', '60');
                }),

                // Burst kecil per 10 detik untuk meredam spike
                Limit::perMinute(120)->by($request->ip() . ':burst'),
            ];
        });

        RateLimiter::for('auth-sensitive', function (Request $request) {
            return Limit::perMinute(30)->by($request->ip());
        });

        // Share user level data with Inertia
        inertia()->share([
            'userLevel' => UserLevel::currentLevel(),
        ]);
    }
}

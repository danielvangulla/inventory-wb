<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RejectLargeBodies
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Hanya cek untuk metode yang membawa body
        if (!in_array($request->getMethod(), ['POST', 'PUT', 'PATCH'], true)) {
            return $next($request);
        }

        $limit = (int) config('security.max_body_bytes', 200 * 1024);

        // Gunakan Content-Length jika ada
        $contentLength = (int) $request->headers->get('Content-Length', 0);

        if ($contentLength > 0 && $contentLength > $limit) {
            return response()->json([
                'message' => 'Invalid Payload',
            ], Response::HTTP_REQUEST_ENTITY_TOO_LARGE); // 413
        }

        // Jika tidak ada Content-Length, kita bisa ambil ukuran input mentah (best effort)
        // Perhatian: membaca body bisa mahal; jangan dipakai jika tidak perlu.
        // if ($contentLength === 0) { ... }

        return $next($request);
    }
}

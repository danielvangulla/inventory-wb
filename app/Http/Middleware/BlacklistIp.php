<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\BlacklistedIp;

class BlacklistIp
{
    public function handle(Request $request, Closure $next)
    {
        return $next($request);

        $ip = $request->ip();

        if ($ip == '127.0.0.1') {
            return $next($request);
        }

        $row = BlacklistedIp::where('ip_address', $ip)
            ->where('updated_at', '>=', now()->subDays(1))
            ->first();

        if ($row && $row->abuse_score > 0) {
            return response()->json(['message' => 'Invalid Request.'], 403);
        }

        if (!$row) {
            $abusePDBKey = config('services.abuseipdb.key');

            if ($abusePDBKey) {
                try {
                    $response = $this->checkEndpoint($ip, $abusePDBKey);

                    if (isset($response['data']['abuseConfidenceScore'])) {
                        $data = BlacklistedIp::where('ip_address', $ip)->first();

                        if ($data) {
                            BlacklistedIp::where('id', $data->id)->update([
                                'check_count' => $data->check_count + 1,
                                'country' => $response['data']['countryCode'],
                                'isp' => $response['data']['isp'],
                                'usage' => $response['data']['usageType'],
                                'domain' => $response['data']['domain'],
                                'abuse_score' => $response['data']['abuseConfidenceScore'],
                            ]);
                        } else {
                            BlacklistedIp::create([
                                'ip_address' => $ip,
                                'check_count' => 1,
                                'country' => $response['data']['countryCode'],
                                'isp' => $response['data']['isp'],
                                'usage' => $response['data']['usageType'],
                                'domain' => $response['data']['domain'],
                                'abuse_score' => $response['data']['abuseConfidenceScore'],
                            ]);
                        }

                        if ($response['data']['abuseConfidenceScore'] > 0) {
                            return response()->json(['message' => 'Invalid Request.'], 403);
                        }
                    }
                } catch (\Throwable $th) {
                    return $next($request);
                }
            }
        }

        return $next($request);
    }

    private function checkEndpoint($ip, $abusePDBKey)
    {
        $client = new \GuzzleHttp\Client();
        $response = $client->request('GET', "https://api.abuseipdb.com/api/v2/check", [
            'query' => [
                'ipAddress' => $ip,
                'maxAgeInDays' => 90,
            ],
            'headers' => [
                'Key' => $abusePDBKey,
                'Accept' => 'application/json',
            ],
        ]);

        return json_decode($response->getBody(), true);
    }
}

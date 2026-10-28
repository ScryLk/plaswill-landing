import { publicAnalyticsConfig } from "@/lib/analytics-policy";

// Runtime configuration: the same Docker image can run with analytics disabled or in staging.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(publicAnalyticsConfig(process.env) ?? { enabled: false }, {
    headers: { "Cache-Control": "no-store" },
  });
}

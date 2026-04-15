import HealthCheckFlow from "@/components/health-check/health-check-flow";

export const metadata = {
  title: "Free Legal Health Check — Orion",
  description:
    "Find out where your startup stands legally. Free, no signup required. Get a personalised risk assessment in minutes.",
};

export default function HealthCheckPage() {
  return <HealthCheckFlow />;
}

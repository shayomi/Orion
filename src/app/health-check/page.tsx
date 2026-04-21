import { getPublishedAssessment } from "@/app/actions/assessment";
import { AssessmentFlow } from "@/components/health-check/assessment-flow";

export const metadata = {
  title: "Free Legal Health Check \u2014 Orion",
  description:
    "Find out where your startup stands legally. Free, no signup required. Get a personalised risk assessment in minutes.",
};

export default async function HealthCheckPage() {
  const data = await getPublishedAssessment();

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
            <span className="text-xl font-bold text-white">O</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">
            Legal Health Check
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            The assessment is being set up. Please check back shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AssessmentFlow
      template={data.template}
      sections={data.sections}
      questions={data.questions}
    />
  );
}

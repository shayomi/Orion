import { getPublishedAssessment } from "@/app/actions/assessment";
import { OnboardingAssessment } from "@/components/onboarding/onboarding-assessment";

export const metadata = {
  title: "Onboarding — Orion",
  description: "Complete your legal health check to set up your dashboard.",
};

export default async function OnboardingPage() {
  const data = await getPublishedAssessment();

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
            <span className="text-xl font-bold text-white">O</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">
            Setting things up
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            The assessment is being prepared. Please check back shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <OnboardingAssessment
      template={data.template}
      sections={data.sections}
      questions={data.questions}
    />
  );
}

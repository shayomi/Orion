import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OrganizationTabProps {
  startup: {
    name: string;
    stage: string | null;
    structure: string | null;
    primaryJurisdiction: string | null;
  } | null;
}

export default function OrganizationTab({ startup }: OrganizationTabProps) {
  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Startup Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Company Name</label>
            <input
              defaultValue={startup?.name || ""}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Stage</label>
            <select
              defaultValue={startup?.stage || ""}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
            >
              <option value="">Select stage</option>
              <option value="idea">Idea</option>
              <option value="pre_seed">Pre-seed</option>
              <option value="seed">Seed</option>
              <option value="series_a">Series A</option>
              <option value="series_b">Series B+</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Entity Structure
            </label>
            <select
              defaultValue={startup?.structure || ""}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white outline-none focus:border-indigo-400"
            >
              <option value="">Select structure</option>
              <option value="UK Ltd">UK Ltd</option>
              <option value="Delaware C-Corp">Delaware C-Corp</option>
              <option value="Wyoming LLC">Wyoming LLC</option>
              <option value="Nigerian RC">Nigerian RC</option>
              <option value="Free Zone Entity">Free Zone Entity</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Jurisdiction</label>
            <input
              defaultValue={startup?.primaryJurisdiction || ""}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
            />
          </div>
          <div className="pt-2">
            <Button size="md">Save Changes</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

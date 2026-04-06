import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockOrganization } from "@/lib/mock-data";

export default function OrganizationTab() {
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
              defaultValue={mockOrganization.name}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Stage</label>
            <select className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50">
              <option>Idea</option>
              <option defaultValue="Pre-seed">Pre-seed</option>
              <option>Seed</option>
              <option>Series A</option>
              <option>Series B+</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Entity Structure
            </label>
            <select className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white outline-none focus:border-indigo-400">
              <option>UK Ltd</option>
              <option defaultValue="Delaware C-Corp">Delaware C-Corp</option>
              <option>Wyoming LLC</option>
              <option>Nigerian RC</option>
              <option>Free Zone Entity</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Jurisdiction</label>
            <input
              defaultValue={mockOrganization.jurisdiction}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Funding Status
            </label>
            <select className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white outline-none focus:border-indigo-400">
              <option defaultValue="Bootstrapped">Bootstrapped</option>
              <option>Pre-seed raised</option>
              <option>Seed raised</option>
              <option>Series A raised</option>
            </select>
          </div>
          <div className="pt-2">
            <Button size="md">Save Changes</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

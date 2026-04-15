import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function InputField({
  label,
  value,
  readOnly,
  hint,
}: {
  label: string;
  value: string;
  readOnly?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        defaultValue={value}
        readOnly={readOnly}
        className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors outline-none ${
          readOnly
            ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white border-gray-200 text-gray-900 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
        }`}
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

interface ProfileTabProps {
  user: { name: string; email: string };
}

export default function ProfileTab({ user }: ProfileTabProps) {
  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-xl font-semibold">
                {getInitials(user.name)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <button className="text-xs text-indigo-600 hover:underline mt-0.5">
                Change avatar
              </button>
            </div>
          </div>
          <InputField label="Full Name" value={user.name} />
          <InputField
            label="Email Address"
            value={user.email}
            readOnly
            hint="Contact support to change your email address"
          />
          <InputField label="Password" value="••••••••••" readOnly />
          <div className="pt-2">
            <Button size="md">Save Changes</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

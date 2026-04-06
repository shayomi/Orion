import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const notificationItems = [
  { label: "Workflow updates", desc: "When a workflow step is completed" },
  { label: "Document ready", desc: "When a generated document is available" },
  { label: "Legal alerts", desc: "Risk alerts and time-sensitive reminders" },
  { label: "Product updates", desc: "New features and improvements" },
];

export default function NotificationsTab() {
  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notificationItems.map((item) => (
            <div
              key={item.label}
              className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
              <button
                className="w-10 h-5 bg-indigo-600 rounded-full relative flex-shrink-0 mt-0.5"
                role="switch"
              >
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

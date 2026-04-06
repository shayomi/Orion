import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Info, Zap } from "lucide-react";
import { mockAlerts } from "@/lib/mock-data";

const iconMap = {
  warning: <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />,
  success: <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />,
  info: <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />,
};

const bgMap = {
  warning: "bg-amber-50 border-amber-100",
  success: "bg-emerald-50 border-emerald-100",
  info: "bg-blue-50 border-blue-100",
};

export default function AlertsPanel() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Alerts</CardTitle>
          <Zap className="w-4 h-4 text-amber-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-lg border ${bgMap[alert.type as keyof typeof bgMap]}`}
            >
              <div className="flex items-start gap-2.5">
                {iconMap[alert.type as keyof typeof iconMap]}
                <div>
                  <p className="text-xs font-semibold text-gray-900">{alert.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{alert.description}</p>
                  {alert.action && (
                    <button className="text-xs text-indigo-600 font-medium mt-1.5 hover:underline">
                      {alert.action} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

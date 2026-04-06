import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BillingTab() {
  return (
    <div className="max-w-xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">No active plan</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Subscribe to unlock full legal operations
              </p>
            </div>
            <Button size="sm">Upgrade</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400">No payment method on file.</p>
          <Button variant="outline" size="sm" className="mt-3">
            Add Payment Method
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

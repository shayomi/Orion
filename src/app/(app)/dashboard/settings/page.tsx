"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockUser, mockOrganization } from "@/lib/mock-data";

const tabs = ["Profile", "Organization", "Billing", "Notifications"];

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

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div>
      <Topbar title="Settings" />
      <div className="p-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Profile" && (
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                  <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-white text-xl font-semibold">
                      {mockUser.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{mockUser.name}</p>
                    <button className="text-xs text-indigo-600 hover:underline mt-0.5">
                      Change avatar
                    </button>
                  </div>
                </div>
                <InputField label="Full Name" value={mockUser.name} />
                <InputField
                  label="Email Address"
                  value={mockUser.email}
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
        )}

        {activeTab === "Organization" && (
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle>Startup Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <InputField label="Company Name" value={mockOrganization.name} />
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Stage
                  </label>
                  <select className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50">
                    <option>Idea</option>
                    <option selected>Pre-seed</option>
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
                    <option selected>Delaware C-Corp</option>
                    <option>Wyoming LLC</option>
                    <option>UK Ltd</option>
                    <option>Cayman Islands</option>
                  </select>
                </div>
                <InputField label="Jurisdiction" value={mockOrganization.jurisdiction} />
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Funding Status
                  </label>
                  <select className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white outline-none focus:border-indigo-400">
                    <option selected>Bootstrapped</option>
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
        )}

        {activeTab === "Billing" && (
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
        )}

        {activeTab === "Notifications" && (
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "Workflow updates", desc: "When a workflow step is completed" },
                  { label: "Document ready", desc: "When a generated document is available" },
                  { label: "Legal alerts", desc: "Risk alerts and time-sensitive reminders" },
                  { label: "Product updates", desc: "New features and improvements" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
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
        )}
      </div>
    </div>
  );
}

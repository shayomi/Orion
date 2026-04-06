"use client";

import { useState } from "react";
import ProfileTab from "./profile-tab";
import OrganizationTab from "./organization-tab";
import BillingTab from "./billing-tab";
import NotificationsTab from "./notifications-tab";

const tabs = ["Profile", "Organization", "Billing", "Notifications"];

export default function SettingsPanel() {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div>
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

      {activeTab === "Profile" && <ProfileTab />}
      {activeTab === "Organization" && <OrganizationTab />}
      {activeTab === "Billing" && <BillingTab />}
      {activeTab === "Notifications" && <NotificationsTab />}
    </div>
  );
}

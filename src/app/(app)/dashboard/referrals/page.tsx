import { Topbar } from "@/components/layout/topbar";
import ReferralPanel from "@/components/dashboard/referrals/referral-panel";

export default function ReferralsPage() {
  return (
    <div>
      <Topbar title="Expert Referrals" subtitle="Get matched with qualified legal professionals" />
      <div className="p-6 max-w-2xl">
        <ReferralPanel />
      </div>
    </div>
  );
}

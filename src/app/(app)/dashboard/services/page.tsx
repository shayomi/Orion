import { Topbar } from "@/components/layout/topbar";
import ServicePackages from "@/components/dashboard/services/service-packages";

export default function ServicesPage() {
  return (
    <div>
      <Topbar title="Services" subtitle="Work with our legal team" />
      <div className="p-6">
        <ServicePackages />
      </div>
    </div>
  );
}

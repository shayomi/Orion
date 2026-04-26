export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular: boolean;
  cta: string;
}

export const SERVICES: ServicePackage[] = [
  {
    id: "svc_01",
    name: "Launch",
    price: 999,
    description: "Incorporate and structure your company properly",
    features: [
      "Incorporation in UK, US, or Nigeria (incl. Free Zones)",
      "Share structure & governance setup",
      "Founder agreements (up to 4 founders)",
      "IP assignment agreements",
      "Vesting schedule configuration",
      "AI co-pilot access",
    ],
    popular: false,
    cta: "Get Started",
  },
  {
    id: "svc_02",
    name: "Fund",
    price: 2499,
    description: "Structure your raise and close your round",
    features: [
      "Everything in Launch",
      "SAFE & convertible note drafting",
      "Deal structuring & terms advice",
      "Term sheet review & negotiation support",
      "Investor due diligence preparation",
      "Cap table modeling",
    ],
    popular: true,
    cta: "Get Started",
  },
  {
    id: "svc_03",
    name: "Scale",
    price: 4999,
    description: "Full legal operations as your company grows",
    features: [
      "Everything in Fund",
      "Ongoing contracts & compliance support",
      "Regulatory guidance across jurisdictions",
      "Employee & option pool documentation",
      "Board resolutions & governance",
      "Priority legal counsel (10 hrs/mo)",
    ],
    popular: false,
    cta: "Talk to Us",
  },
];

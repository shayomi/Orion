import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageSquare } from "lucide-react";
import { mockServices } from "@/lib/mock-data";

export default function ServicePackages() {
  return (
    <div className="space-y-8">
      <div>
        <div className="mb-5">
          <h2 className="text-base font-semibold text-gray-900">Choose a package</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Flat-fee legal services — no hourly surprises
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {mockServices.map((service) => (
            <Card
              key={service.id}
              className={`relative ${service.popular ? "border-indigo-300 shadow-md" : ""}`}
            >
              {service.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="info" className="shadow-sm">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className={service.popular ? "pt-8" : ""}>
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
                <div className="mt-3">
                  <span className="text-3xl font-bold text-gray-900">
                    ${service.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-400 ml-1">one-time</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5 mb-5">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={service.popular ? "primary" : "outline"}
                  className="w-full"
                >
                  {service.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Need something custom?</h3>
              <p className="text-sm text-gray-500 mt-1">
                Have a specific legal need? Our team can help with ad-hoc legal work, international
                jurisdictions, or complex structures.
              </p>
            </div>
            <Button variant="outline" className="flex-shrink-0 ml-6">
              <MessageSquare className="w-4 h-4" /> Contact Team
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

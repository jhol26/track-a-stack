"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Briefcase, DollarSign, Package } from "lucide-react";

const resources = {
  freelance: {
    title: "Best Freelance Platforms",
    icon: Briefcase,
    items: [
      {
        name: "Upwork",
        url: "https://upwork.com",
        description: "Largest freelance marketplace for all skill levels",
      },
      {
        name: "Fiverr",
        url: "https://fiverr.com",
        description: "Gig-based platform for quick projects",
      },
      {
        name: "Toptal",
        url: "https://toptal.com",
        description: "Elite network for top 3% of freelancers",
      },
      {
        name: "Freelancer",
        url: "https://freelancer.com",
        description: "Competitive bidding on diverse projects",
      },
    ],
  },
  affiliate: {
    title: "Best Affiliate Networks",
    icon: DollarSign,
    items: [
      {
        name: "ShareASale",
        url: "https://shareasale.com",
        description: "4,000+ merchants across all niches",
      },
      {
        name: "Commission Junction (CJ)",
        url: "https://cj.com",
        description: "Premium brands and high commissions",
      },
      {
        name: "Amazon Associates",
        url: "https://affiliate-program.amazon.com",
        description: "Earn on any Amazon product purchase",
      },
      {
        name: "ClickBank",
        url: "https://clickbank.com",
        description: "Digital products with up to 75% commissions",
      },
      {
        name: "Impact",
        url: "https://impact.com",
        description: "Modern partnership management platform",
      },
    ],
  },
  digitalProducts: {
    title: "Best Digital Product Platforms",
    icon: Package,
    items: [
      {
        name: "Gumroad",
        url: "https://gumroad.com",
        description: "Simple platform for selling digital products",
      },
      {
        name: "Lemon Squeezy",
        url: "https://lemonsqueezy.com",
        description: "Modern merchant of record for SaaS & digital",
      },
      {
        name: "Podia",
        url: "https://podia.com",
        description: "All-in-one for courses, downloads, memberships",
      },
      {
        name: "Teachable",
        url: "https://teachable.com",
        description: "Leading platform for online courses",
      },
      {
        name: "Etsy",
        url: "https://etsy.com",
        description: "Marketplace for handmade & digital goods",
      },
    ],
  },
};

export default function ResourcesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Resource Library</h1>
        <p className="text-muted-foreground">
          Curated tools and platforms to grow your hustles
        </p>
      </div>

      {Object.entries(resources).map(([key, category]) => {
        const Icon = category.icon;
        return (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-primary" />
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((item) => (
                  <div
                    key={item.name}
                    className="p-4 border rounded-lg hover:border-primary transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary" />
                      </a>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {item.description}
                    </p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" variant="outline" className="w-full">
                        Visit Site
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Card>
        <CardHeader>
          <CardTitle>Pro Tip</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Diversify your income streams! The most successful side hustlers 
            combine multiple approaches: freelancing for immediate cash flow, 
            affiliate marketing for passive income, and digital products for 
            scalability. Start with one, then expand as you gain traction.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, BarChart3, Clock, DollarSign, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            Track A Stack
          </Link>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Track Your Side Hustle{" "}
          <span className="text-primary">Income & Expenses</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          All-in-one platform to manage multiple hustles, track time, estimate taxes, 
          and hit your financial goals.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              Start Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={DollarSign}
            title="Income Tracking"
            description="Log income and expenses per hustle with receipt uploads"
          />
          <FeatureCard
            icon={BarChart3}
            title="Profit Dashboard"
            description="Visual overview of revenue, expenses, and net profit"
          />
          <FeatureCard
            icon={Clock}
            title="Time Tracking"
            description="Track hours and calculate $/hour efficiency"
          />
          <FeatureCard
            icon={Target}
            title="Goal System"
            description="Set milestones and track progress to financial freedom"
          />
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard
            tier="Free"
            price="$0"
            features={[
              "1 hustle",
              "Basic income/expense tracking",
              "Manual time entry",
              "Email support"
            ]}
          />
          <PricingCard
            tier="Pro"
            price="$9"
            period="/month"
            features={[
              "Unlimited hustles",
              "Receipt OCR scanning",
              "Time tracking with timer",
              "Tax estimates",
              "Goal tracking",
              "Priority support"
            ]}
            popular
          />
          <PricingCard
            tier="Business"
            price="$19"
            period="/month"
            features={[
              "Everything in Pro",
              "Advanced analytics",
              "CSV/PDF exports",
              "Quarterly tax reports",
              "What-if projections",
              "Resource library access"
            ]}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-primary rounded-2xl p-12 text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Hustles?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of entrepreneurs tracking their side income with Track A Stack
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="gap-2">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2026 Vestro. Built for hustlers.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
  return (
    <div className="p-6 rounded-lg border bg-card">
      <Icon className="w-12 h-12 text-primary mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function PricingCard({ tier, price, period, features, popular }: { 
  tier: string, 
  price: string, 
  period?: string, 
  features: string[],
  popular?: boolean
}) {
  return (
    <div className={`p-8 rounded-lg border ${popular ? 'border-primary shadow-lg' : ''}`}>
      {popular && (
        <div className="text-primary text-sm font-semibold mb-2">Most Popular</div>
      )}
      <h3 className="text-2xl font-bold mb-2">{tier}</h3>
      <div className="text-4xl font-bold mb-6">
        {price}<span className="text-lg font-normal text-muted-foreground">{period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>
      <Link href="/signup">
        <Button className="w-full" variant={popular ? "default" : "outline"}>
          Choose {tier}
        </Button>
      </Link>
    </div>
  );
}

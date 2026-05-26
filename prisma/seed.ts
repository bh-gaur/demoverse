import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with initial data...");

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "user@demoverse.com" },
      update: {},
      create: {
        email: "user@demoverse.com",
        name: "Demo User",
        password: await hash("password123", 10),
        role: "user",
      },
    }),
    prisma.user.upsert({
      where: { email: "vendor@demoverse.com" },
      update: {},
      create: {
        email: "vendor@demoverse.com",
        name: "Vendor User",
        password: await hash("password123", 10),
        role: "vendor",
      },
    }),
    prisma.user.upsert({
      where: { email: "admin@demoverse.com" },
      update: {},
      create: {
        email: "admin@demoverse.com",
        name: "Admin User",
        password: await hash("password123", 10),
        role: "admin",
      },
    }),
  ]);

  console.log("✓ Users created");

  const platforms = [
    {
      slug: "nexuscrm",
      name: "NexusCRM",
      tagline: "Next-generation customer relationship management for modern sales teams",
      description:
        "NexusCRM streamlines your entire sales pipeline with AI-powered insights, automated workflows, and seamless integrations. Perfect for teams of any size looking to close more deals faster.",
      category: "CRM",
      coverColor: "#FF6B6B",
      demoUrl: "https://nexuscrm.example.com/demo",
      teamSizeFit: "All sizes",
      pricingModel: "freemium",
      verified: true,
      features: [
        { name: "Lead Management", icon: "Target", description: "Track and qualify leads" },
        { name: "Pipeline Automation", icon: "Zap", description: "Automate your sales workflows" },
        { name: "Real-time Analytics", icon: "BarChart3", description: "Get actionable insights" },
        { name: "Team Collaboration", icon: "Users", description: "Work together seamlessly" },
      ],
      pricingTiers: [
        { name: "Starter", price: 0, period: "month", features: ["5 users", "Unlimited contacts"] },
        { name: "Professional", price: 99, period: "month", features: ["Unlimited users", "Advanced automation"] },
        { name: "Enterprise", price: null, period: "month", features: ["Custom integration", "Dedicated support"] },
      ],
      reviews: [
        { rating: 5, body: "Game-changer for our sales team", role: "Sales Director", company: "TechCorp" },
        { rating: 4, body: "Great features, steep learning curve", role: "VP Sales", company: "RetailCo" },
        { rating: 5, body: "Best CRM we've used", role: "Founder", company: "StartupXYZ" },
      ],
    },
    {
      slug: "pipelineai",
      name: "PipelineAI",
      tagline: "AI-powered sales intelligence that predicts deals before they close",
      description:
        "PipelineAI uses machine learning to forecast sales cycles, identify at-risk deals, and recommend next actions. Increase win rates by 30% on average.",
      category: "CRM",
      coverColor: "#4ECDC4",
      demoUrl: "https://pipelineai.example.com/demo",
      teamSizeFit: "Mid-market to Enterprise",
      pricingModel: "paid",
      verified: true,
      features: [
        { name: "Deal Forecasting", icon: "TrendingUp", description: "Predict revenue accurately" },
        { name: "Risk Scoring", icon: "AlertCircle", description: "Identify deals at risk" },
        { name: "Opportunity Insights", icon: "Lightbulb", description: "AI-powered recommendations" },
        { name: "Custom Dashboards", icon: "Layout", description: "Visualize your pipeline" },
      ],
      pricingTiers: [
        { name: "Growth", price: 199, period: "month", features: ["Up to 25 users"] },
        { name: "Scale", price: 499, period: "month", features: ["Up to 100 users"] },
        { name: "Enterprise", price: null, period: "month", features: ["Custom deployment"] },
      ],
      reviews: [
        { rating: 5, body: "Incredible accuracy in predictions", role: "SVP Sales", company: "Fortune500" },
        { rating: 4, body: "Worth the investment", role: "Sales Manager", company: "MidMarketCo" },
      ],
    },
    {
      slug: "luminous-analytics",
      name: "Luminary Analytics",
      tagline: "Advanced analytics platform for data-driven decision making",
      description:
        "Transform raw data into actionable intelligence with Luminary's visual analytics engine. Connect to any data source and get answers in seconds.",
      category: "Analytics",
      coverColor: "#45B7D1",
      demoUrl: "https://luminous.example.com/demo",
      teamSizeFit: "Enterprise, Mid-market",
      pricingModel: "paid",
      verified: true,
      features: [
        { name: "Visual Queries", icon: "Eye", description: "No coding required" },
        { name: "Real-time Dashboards", icon: "Activity", description: "Live data updates" },
        { name: "Data Connectors", icon: "Database", description: "Connect any data source" },
        { name: "Collaborative Reports", icon: "Share2", description: "Work with your team" },
      ],
      pricingTiers: [
        { name: "Professional", price: 299, period: "month", features: ["100GB storage"] },
        { name: "Enterprise", price: 999, period: "month", features: ["Unlimited storage"] },
      ],
      reviews: [
        { rating: 5, body: "Changed how we analyze data", role: "Data Director", company: "DataCorp" },
      ],
    },
    {
      slug: "databridge",
      name: "DataBridge",
      tagline: "Connect and sync data across all your tools instantly",
      description:
        "DataBridge eliminates manual data entry and syncs information in real-time across 500+ integrations. Never manually update data again.",
      category: "Analytics",
      coverColor: "#FFA07A",
      demoUrl: "https://databridge.example.com/demo",
      teamSizeFit: "All sizes",
      pricingModel: "freemium",
      verified: false,
      features: [
        { name: "Pre-built Integrations", icon: "Plug", description: "500+ ready-to-go" },
        { name: "Real-time Sync", icon: "RefreshCw", description: "Always up-to-date" },
        { name: "Conflict Resolution", icon: "CheckCircle", description: "Handle data conflicts" },
        { name: "Audit Logs", icon: "FileText", description: "Track all changes" },
      ],
      pricingTiers: [
        { name: "Starter", price: 0, period: "month", features: ["3 integrations"] },
        { name: "Professional", price: 49, period: "month", features: ["Unlimited integrations"] },
      ],
      reviews: [
        { rating: 4, body: "Solid integration platform", role: "IT Lead", company: "TechCo" },
      ],
    },
    {
      slug: "devpilot",
      name: "DevPilot",
      tagline: "Your AI coding copilot for faster development",
      description:
        "DevPilot accelerates development with AI-powered code completion, automated testing, and intelligent debugging. Reduce bug rates by 40%.",
      category: "DevTools",
      coverColor: "#98D8C8",
      demoUrl: "https://devpilot.example.com/demo",
      teamSizeFit: "Startups, SMB",
      pricingModel: "freemium",
      verified: true,
      features: [
        { name: "Code Completion", icon: "Code", description: "Intelligent suggestions" },
        { name: "Bug Detection", icon: "Bug", description: "Find issues before QA" },
        { name: "Test Generation", icon: "CheckSquare", description: "Auto-generate tests" },
        { name: "Documentation", icon: "FileText", description: "Auto-doc your code" },
      ],
      pricingTiers: [
        { name: "Individual", price: 0, period: "month", features: ["Limited AI credits"] },
        { name: "Team", price: 29, period: "user/month", features: ["Unlimited AI credits"] },
      ],
      reviews: [
        { rating: 5, body: "Game changer for coding", role: "Senior Dev", company: "DevShop" },
      ],
    },
    {
      slug: "codeship-pro",
      name: "CodeShip Pro",
      tagline: "Enterprise CI/CD platform trusted by 10,000+ teams",
      description:
        "Deploy with confidence using CodeShip Pro's fast, reliable CI/CD pipelines. Supports 50+ frameworks and languages out of the box.",
      category: "DevTools",
      coverColor: "#F7DC6F",
      demoUrl: "https://codeship.example.com/demo",
      teamSizeFit: "Enterprise, Mid-market",
      pricingModel: "paid",
      verified: true,
      features: [
        { name: "Fast Builds", icon: "Zap", description: "Sub-minute deployments" },
        { name: "Multi-cloud", icon: "Cloud", description: "Deploy anywhere" },
        { name: "Security", icon: "Shield", description: "Enterprise-grade" },
        { name: "Rollback", icon: "RotateCcw", description: "One-click rollbacks" },
      ],
      pricingTiers: [
        { name: "Growth", price: 399, period: "month", features: ["100 builds/month"] },
        { name: "Scale", price: 999, period: "month", features: ["Unlimited builds"] },
      ],
      reviews: [
        { rating: 5, body: "Reliable and fast", role: "DevOps Lead", company: "ScaleCo" },
      ],
    },
    {
      slug: "talentflow",
      name: "TalentFlow",
      tagline: "Modern HRIS that your team will actually use",
      description:
        "TalentFlow combines HRIS, recruitment, and performance management in one beautiful platform. Perfect for growing teams.",
      category: "HR",
      coverColor: "#BB8FCE",
      demoUrl: "https://talentflow.example.com/demo",
      teamSizeFit: "SMB, Mid-market",
      pricingModel: "freemium",
      verified: false,
      features: [
        { name: "Employee Directory", icon: "Users", description: "Centralized info" },
        { name: "Hiring Tools", icon: "Briefcase", description: "Recruit easily" },
        { name: "Performance Reviews", icon: "Star", description: "Annual reviews" },
        { name: "Leave Management", icon: "Calendar", description: "Track time off" },
      ],
      pricingTiers: [
        { name: "Startup", price: 0, period: "month", features: ["Up to 10 employees"] },
        { name: "Growth", price: 4, period: "employee/month", features: ["Unlimited employees"] },
      ],
      reviews: [
        { rating: 4, body: "Great for small teams", role: "HR Manager", company: "SmallCorp" },
      ],
    },
    {
      slug: "hireos",
      name: "HireOS",
      tagline: "AI-powered recruiting platform that finds top talent 10x faster",
      description:
        "HireOS uses machine learning to screen candidates, schedule interviews, and predict job fit. Cut hiring time from months to weeks.",
      category: "HR",
      coverColor: "#85C1E9",
      demoUrl: "https://hireos.example.com/demo",
      teamSizeFit: "Enterprise",
      pricingModel: "paid",
      verified: true,
      features: [
        { name: "Smart Screening", icon: "Filter", description: "AI-powered filtering" },
        { name: "Candidate Ranking", icon: "Award", description: "Top matches first" },
        { name: "Video Interviews", icon: "Video", description: "Async interviews" },
        { name: "Offer Management", icon: "FileCheck", description: "Streamline offers" },
      ],
      pricingTiers: [
        { name: "Professional", price: 499, period: "month", features: ["5 concurrent hires"] },
        { name: "Enterprise", price: null, period: "month", features: ["Unlimited hires"] },
      ],
      reviews: [
        { rating: 5, body: "Transformed our hiring", role: "Chief Talent Officer", company: "BigCorp" },
      ],
    },
    {
      slug: "growthpulse",
      name: "GrowthPulse",
      tagline: "Marketing automation that drives real growth",
      description:
        "GrowthPulse combines email, SMS, social, and web marketing in one platform. Increase conversions with AI-powered personalization.",
      category: "Marketing",
      coverColor: "#FF6B6B",
      demoUrl: "https://growthpulse.example.com/demo",
      teamSizeFit: "SMB, Mid-market",
      pricingModel: "freemium",
      verified: true,
      features: [
        { name: "Email Campaigns", icon: "Mail", description: "Beautiful templates" },
        { name: "Segmentation", icon: "Layers", description: "Advanced targeting" },
        { name: "A/B Testing", icon: "GitCompare", description: "Optimize everything" },
        { name: "Analytics", icon: "BarChart3", description: "Track ROI" },
      ],
      pricingTiers: [
        { name: "Starter", price: 0, period: "month", features: ["Up to 5k contacts"] },
        { name: "Growth", price: 49, period: "month", features: ["Unlimited contacts"] },
      ],
      reviews: [
        { rating: 5, body: "Perfect for growing teams", role: "Marketing Manager", company: "GrowCo" },
      ],
    },
    {
      slug: "ampli",
      name: "Ampli",
      tagline: "Customer engagement platform built for SaaS",
      description:
        "Ampli helps SaaS companies engage customers with in-app messaging, push notifications, and email. Reduce churn and increase retention.",
      category: "Marketing",
      coverColor: "#4ECDC4",
      demoUrl: "https://ampli.example.com/demo",
      teamSizeFit: "SaaS companies",
      pricingModel: "paid",
      verified: false,
      features: [
        { name: "In-app Messaging", icon: "MessageSquare", description: "Contextual popups" },
        { name: "User Segmentation", icon: "Sliders", description: "Target by behavior" },
        { name: "Journey Builder", icon: "GitBranch", description: "Visual workflows" },
        { name: "Surveys", icon: "HelpCircle", description: "Gather feedback" },
      ],
      pricingTiers: [
        { name: "Starter", price: 199, period: "month", features: ["Up to 100k users"] },
        { name: "Scale", price: 599, period: "month", features: ["Unlimited users"] },
      ],
      reviews: [
        { rating: 4, body: "Good for retention", role: "Product Manager", company: "SaaS Inc" },
      ],
    },
    {
      slug: "ledgr",
      name: "Ledgr",
      tagline: "Modern accounting software for freelancers and small businesses",
      description:
        "Ledgr makes accounting simple with automatic invoice tracking, expense categorization, and tax prep. Never worry about bookkeeping again.",
      category: "Finance",
      coverColor: "#45B7D1",
      demoUrl: "https://ledgr.example.com/demo",
      teamSizeFit: "Freelancers, SMB",
      pricingModel: "freemium",
      verified: true,
      features: [
        { name: "Invoicing", icon: "FileText", description: "Professional invoices" },
        { name: "Expense Tracking", icon: "CreditCard", description: "Automatic sync" },
        { name: "Tax Reports", icon: "Calculator", description: "Tax-ready reports" },
        { name: "Bank Sync", icon: "TrendingUp", description: "Auto-categorize" },
      ],
      pricingTiers: [
        { name: "Free", price: 0, period: "month", features: ["Basic features"] },
        { name: "Pro", price: 9, period: "month", features: ["Advanced reports"] },
      ],
      reviews: [
        { rating: 5, body: "Perfect for freelancers", role: "Freelancer", company: "Solo" },
      ],
    },
    {
      slug: "cashflow360",
      name: "CashFlow360",
      tagline: "Cash flow forecasting and management for growing businesses",
      description:
        "CashFlow360 predicts your cash position weeks in advance and recommends actions. Avoid cash crunches before they happen.",
      category: "Finance",
      coverColor: "#FFA07A",
      demoUrl: "https://cashflow360.example.com/demo",
      teamSizeFit: "Mid-market, Enterprise",
      pricingModel: "paid",
      verified: true,
      features: [
        { name: "Cash Flow Forecasting", icon: "TrendingUp", description: "14-90 day ahead" },
        { name: "Scenario Planning", icon: "Layers", description: "What-if analysis" },
        { name: "AR/AP Optimization", icon: "Zap", description: "Improve cash position" },
        { name: "Financial Dashboards", icon: "BarChart3", description: "Real-time visibility" },
      ],
      pricingTiers: [
        { name: "Professional", price: 299, period: "month", features: ["1 user"] },
        { name: "Enterprise", price: 999, period: "month", features: ["Unlimited users"] },
      ],
      reviews: [
        { rating: 5, body: "Saved our company", role: "CFO", company: "TechStartup" },
      ],
    },
  ];

  for (const platformData of platforms) {
    const { features, pricingTiers, reviews, ...platformCore } = platformData;

    await prisma.platform.upsert({
      where: { slug: platformCore.slug },
      update: {},
      create: {
        ...platformCore,
        rating: Math.random() * 0.7 + 4.2,
        reviewCount: Math.floor(Math.random() * 100) + 20,
        features: {
          create: features.map((f) => ({
            name: f.name,
            icon: f.icon,
            description: f.description,
          })),
        },
        pricingTiers: {
          create: pricingTiers.map((t) => ({
            name: t.name,
            price: t.price,
            period: t.period,
            features: JSON.stringify(t.features),
            highlighted: t.name === "Professional",
          })),
        },
        reviews: {
          create: reviews.map((r) => ({
            rating: r.rating,
            body: r.body,
            role: r.role,
            company: r.company,
            userId: users[0].id,
          })),
        },
      },
    });
  }

  console.log("✓ 12 Platforms seeded with features, pricing, and reviews");

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

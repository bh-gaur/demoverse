import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning database...");
  await prisma.bookmark.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.feature.deleteMany({});
  await prisma.pricingTier.deleteMany({});
  await prisma.demoRequest.deleteMany({});
  await prisma.platform.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Seeding users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "user@demoverse.com",
      password: hashedPassword,
      role: "user",
    },
  });

  const vendor = await prisma.user.create({
    data: {
      name: "Demo Vendor",
      email: "vendor@demoverse.com",
      password: hashedPassword,
      role: "vendor",
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Demo Admin",
      email: "admin@demoverse.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  const users = [user, vendor, admin];

  console.log("Seeding platforms...");

  const platformsData = [
    // CRM
    {
      name: "NexusCRM",
      slug: "nexuscrm",
      tagline: "Unify your sales pipeline with next-gen automated intelligence.",
      description: "NexusCRM offers seamless pipeline management, email tracking, and AI-driven contact profiling. It is designed to help high-growth sales teams close deals faster without the administrative clutter.",
      category: "CRM",
      coverColor: "#10b981", // Emerald
      demoUrl: "https://example.com",
      demoType: "embed",
      teamSizeFit: JSON.stringify(["11-50", "51-200", "200+"]),
      pricingModel: "freemium",
      rating: 4.8,
      verified: true,
      features: [
        { name: "Pipeline Automation", icon: "GitFork", description: "Automated deal stages progression" },
        { name: "Smart Contact Scoring", icon: "Target", description: "AI-based lead qualification scoring" },
        { name: "Email & Calendar Sync", icon: "Calendar", description: "Bi-directional GSuite & Outlook integration" },
        { name: "Sales Reports", icon: "TrendingUp", description: "Interactive custom reporting widgets" },
      ],
      pricingTiers: [
        { name: "Starter", price: 0, period: "month", highlighted: false, features: JSON.stringify(["Up to 3 users", "Basic pipeline tools", "Email integrations"]) },
        { name: "Professional", price: 29, period: "month", highlighted: true, features: JSON.stringify(["Unlimited users", "Advanced contact scoring", "Full custom reporting", "Priority support"]) },
        { name: "Enterprise", price: 99, period: "month", highlighted: false, features: JSON.stringify(["Dedicated database", "SAML SSO validation", "Custom AI training", "24/7 dedicated support"]) },
      ],
      reviews: [
        { rating: 5, body: "NexusCRM transformed our outbound sales flow. The lead scoring feature is incredibly accurate.", role: "Director of Sales", company: "Velocity Corp" },
        { rating: 4, body: "Great interface, highly responsive. Missing a few niche ERP integrations but standard tools work flawlessly.", role: "Ops Manager", company: "ScaleDigital" },
        { rating: 5, body: "Best value-for-money CRM on the market today. The transition from Salesforce was smooth.", role: "Founder", company: "Bootstrapped SaaS" },
      ],
    },
    {
      name: "PipelineAI",
      slug: "pipelineai",
      tagline: "Self-driving customer relationship manager for scaling startups.",
      description: "PipelineAI uses machine learning models to automatically log calls, emails, and predict deal closure probabilities. It acts as an autonomous sales assistant that keeps CRM database entries perfectly clean.",
      category: "CRM",
      coverColor: "#3b82f6", // Blue
      demoUrl: "https://example.com",
      demoType: "embed",
      teamSizeFit: JSON.stringify(["1-10", "11-50", "51-200"]),
      pricingModel: "paid",
      rating: 4.5,
      verified: true,
      features: [
        { name: "Predictive Forecasting", icon: "LineChart", description: "Closure probabilities powered by ML" },
        { name: "Auto Lead Enrichment", icon: "Sparkles", description: "Scrapes LinkedIn & web for lead details automatically" },
        { name: "Meeting Recorder", icon: "Mic", description: "Transcribes and analyzes sales calls" },
        { name: "Task Reminders", icon: "Bell", description: "Smart contextual trigger warnings for deal inertia" },
      ],
      pricingTiers: [
        { name: "Growth", price: 49, period: "month", highlighted: true, features: JSON.stringify(["5 team members", "Predictive forecasting", "Auto lead enrichment"]) },
        { name: "Scale", price: 99, period: "month", highlighted: false, features: JSON.stringify(["Unlimited team members", "Transcriptions & recording", "API access"]) },
        { name: "Custom Enterprise", price: null, period: "month", highlighted: false, features: JSON.stringify(["On-premise LLM options", "Custom SLA guarantees", "Dedicated account engineer"]) },
      ],
      reviews: [
        { rating: 5, body: "We no longer manually log anything. The auto enrichment saves hours every single day.", role: "SDR Lead", company: "OutreachHub" },
        { rating: 4, body: "Predictive modeling is helpful but needs a few weeks of data to become highly accurate.", role: "VP of Revenue", company: "GrowthWorks" },
        { rating: 4, body: "Super clean interface. Support was very helpful during initial onboarding.", role: "CRM Consultant", company: "Freelance" },
      ],
    },
    // Analytics
    {
      name: "Luminary Analytics",
      slug: "luminary-analytics",
      tagline: "Real-time product analytics without the performance overhead.",
      description: "Luminary Analytics tracks user behavior, session funnels, and retention curves in real-time. It is optimized for zero latency impact and is fully GDPR/CCPA compliant out of the box.",
      category: "Analytics",
      coverColor: "#6366f1", // Indigo
      demoUrl: "https://example.com",
      demoType: "embed",
      teamSizeFit: JSON.stringify(["11-50", "51-200", "200+"]),
      pricingModel: "freemium",
      rating: 4.9,
      verified: true,
      features: [
        { name: "Real-time Event Stream", icon: "Zap", description: "Zero-lag user clickstream monitoring" },
        { name: "Funnel Analysis", icon: "Filter", description: "Identify dropoff coordinates in multi-step flows" },
        { name: "GDPR Compliant", icon: "Shield", description: "Anonymous cookieless tracking mechanism" },
        { name: "Retention Cohorts", icon: "Grid", description: "Cohorts dashboard to audit product-market fit" },
      ],
      pricingTiers: [
        { name: "Hobby", price: 0, period: "month", highlighted: false, features: JSON.stringify(["10,000 monthly events", "Basic dashboards", "14 days retention data"]) },
        { name: "Pro", price: 79, period: "month", highlighted: true, features: JSON.stringify(["1,000,000 monthly events", "Advanced funnels & retention", "Custom metadata attributes", "Unlimited team seats"]) },
        { name: "Scale", price: 299, period: "month", highlighted: false, features: JSON.stringify(["10,000,000 monthly events", "Real-time raw data export", "SLA contract", "Dedicated support manager"]) },
      ],
      reviews: [
        { rating: 5, body: "Luminary is incredibly fast. Funnel tracking is a breeze compared to Mixpanel.", role: "VP of Product", company: "ClickSaaS" },
        { rating: 5, body: "We swapped Google Analytics for Luminary. Compliance issues resolved overnight.", role: "Head of Growth", company: "Fintech Startup" },
        { rating: 5, body: "Beautiful dashboards that everyone on the team actually understands.", role: "CEO", company: "DesignStudio" },
      ],
    },
    {
      name: "DataBridge",
      slug: "databridge",
      tagline: "Synchronize your data warehouses with a single declarative configuration.",
      description: "DataBridge connects Snowflake, BigQuery, Postgres, and SaaS APIs together. It enables data engineering teams to setup robust ETL pipelines in minutes with SQL-like mapping syntax.",
      category: "Analytics",
      coverColor: "#06b6d4", // Cyan
      demoUrl: "https://example.com",
      demoType: "embed",
      teamSizeFit: JSON.stringify(["51-200", "200+"]),
      pricingModel: "paid",
      rating: 4.3,
      verified: false,
      features: [
        { name: "Multi-Source Connectors", icon: "Link2", description: "Over 200+ pre-built integration nodes" },
        { name: "SQL Transformations", icon: "Database", description: "In-flight data scrubbing and formatting" },
        { name: "Alert Log Engine", icon: "AlertTriangle", description: "Slack & Email alerts for schema changes or pipeline breaks" },
        { name: "Data Deduplication", icon: "RefreshCw", description: "Built-in record deduplication logic" },
      ],
      pricingTiers: [
        { name: "Developer", price: 39, period: "month", highlighted: false, features: JSON.stringify(["5 connectors", "Hourly sync sync-frequency", "Email support"]) },
        { name: "Scale", price: 149, period: "month", highlighted: true, features: JSON.stringify(["20 connectors", "5-minute sync-frequency", "Historical data syncing", "Slack alerts channel"]) },
        { name: "Enterprise Custom", price: null, period: "month", highlighted: false, features: JSON.stringify(["Unlimited connectors", "Real-time syncing", "Dedicated data architect", "Custom connectors support"]) },
      ],
      reviews: [
        { rating: 4, body: "Setup was very simple. Saves us the trouble of writing custom cron scripts for database syncs.", role: "Data Engineer", company: "LogicApps" },
        { rating: 4, body: "Good service, syncs are reliable. Dashboard interface can feel slightly slow with heavy query sets.", role: "Analytics Lead", company: "RetailCo" },
        { rating: 5, body: "The schema change alerts saved our dashboard metrics multiple times.", role: "Head of BI", company: "FinLog" },
      ],
    },
    // Dev Tools
    {
      name: "DevPilot",
      slug: "devpilot",
      tagline: "Next-gen localized code review assistant for security and speed.",
      description: "DevPilot plugs into your git workflow to automatically scan for security vulnerabilities, API key leaks, and code styling defects. It provides inline pull-request suggestions that developers can accept in a click.",
      category: "Dev Tools",
      coverColor: "#8b5cf6", // Violet
      demoUrl: "https://example.com",
      demoType: "embed",
      teamSizeFit: JSON.stringify(["11-50", "51-200", "200+"]),
      pricingModel: "freemium",
      rating: 4.7,
      verified: true,
      features: [
        { name: "Static Security Scans", icon: "ShieldAlert", description: "Real-time OWASP top-10 audit checker" },
        { name: "Inline Suggestions", icon: "Code", description: "AI code optimization and rewrite recommendations" },
        { name: "Custom Style Linting", icon: "Terminal", description: "Import existing eslint/prettier rules configurations" },
        { name: "Leak Prevention", icon: "Lock", description: "Intercept secret keys or passwords before committing" },
      ],
      pricingTiers: [
        { name: "Individual", price: 0, period: "month", highlighted: false, features: JSON.stringify(["3 public repos", "Standard styling suggestions", "Community support"]) },
        { name: "Team License", price: 19, period: "user/month", highlighted: true, features: JSON.stringify(["Unlimited repos", "Full security scanning", "Custom rule builders", "PR webhook integration"]) },
        { name: "Enterprise License", price: null, period: "month", highlighted: false, features: JSON.stringify(["Self-hosted runners", "Active Directory integrations", "Custom security SLAs"]) },
      ],
      reviews: [
        { rating: 5, body: "Caught two secrets leaks on day one. Worth every single penny.", role: "Lead Engineer", company: "CyberShield" },
        { rating: 4, body: "The static analysis is solid. Sometimes the code style suggestions are subjective but overall great.", role: "Senior Developer", company: "TechHive" },
        { rating: 5, body: "Saves senior developers hours during review loops. Standardizes coding guidelines.", role: "VP of Engineering", company: "NeoSaaS" },
      ],
    },
    {
      name: "CodeShip Pro",
      slug: "codeship-pro",
      tagline: "Blazing fast cloud build runner designed for large Monorepos.",
      description: "CodeShip Pro runs complex build graphs concurrently, caching artifact structures intelligently. It reduces pipeline build waiting duration from hours down to single minutes.",
      category: "Dev Tools",
      coverColor: "#64748b", // Slate
      demoUrl: "https://example.com",
      demoType: "embed",
      teamSizeFit: JSON.stringify(["51-200", "200+"]),
      pricingModel: "paid",
      rating: 4.4,
      verified: false,
      features: [
        { name: "Cache Optimizer", icon: "Layers", description: "Prune unaffected package layers to accelerate runtimes" },
        { name: "Parallel Workers", icon: "Cpu", description: "Spin up to 64 virtual test runners simultaneously" },
        { name: "Matrix Builds", icon: "Server", description: "Verify multiple node/OS combinations in parallel" },
        { name: "Artifact Host", icon: "FolderOpen", description: "Secure internal package registry storage" },
      ],
      pricingTiers: [
        { name: "Developer", price: 29, period: "month", highlighted: false, features: JSON.stringify(["2 parallel execution jobs", "Shared caching", "Standard runner specs"]) },
        { name: "Squad", price: 129, period: "month", highlighted: true, features: JSON.stringify(["10 parallel execution jobs", "Dedicated remote caching", "High-performance CPU specifications", "Slack updates"]) },
        { name: "Scale Partner", price: 499, period: "month", highlighted: false, features: JSON.stringify(["Unlimited runners", "Dedicated bare-metal instances", "Custom VPC config", "24/7 hotline support"]) },
      ],
      reviews: [
        { rating: 5, body: "Reduced monorepo build times from 45 mins to 3.5 mins. Absolute game-changer.", role: "Staff Engineer", company: "Megacorp Ltd" },
        { rating: 4, body: "Documentation is extensive but initial configuration takes some effort.", role: "DevOps Architect", company: "CloudCore" },
        { rating: 4, body: "Extremely reliable runner machines. We have had zero pipeline downtime since onboarding.", role: "SRE Manager", company: "BlockFinance" },
      ],
    },
    // HR
    {
      name: "TalentFlow",
      slug: "talentflow",
      tagline: "Collaborative applicant tracking system built for modern teams.",
      description: "TalentFlow simplifies job postings, resume parsing, and interview loops. It enables recruiters and engineering managers to work together in a single dashboard to hire top talent.",
      category: "HR",
      coverColor: "#14b8a6", // Teal
      demoUrl: "https://example.com",
      demoType: "embed",
      teamSizeFit: JSON.stringify(["11-50", "51-200"]),
      pricingModel: "freemium",
      rating: 4.6,
      verified: true,
      features: [
        { name: "One-Click Multipost", icon: "Globe", description: "Publish vacancies to LinkedIn, Indeed, Glassdoor in a click" },
        { name: "Resume Parser", icon: "FileText", description: "Extract contact info, experience, skills from PDF files" },
        { name: "Integrated Schedulers", icon: "Calendar", description: "Integrates with Calendly style availability sheets" },
        { name: "Review Scorecards", icon: "ClipboardList", description: "Custom interview evaluation criteria checklists" },
      ],
      pricingTiers: [
        { name: "Starter", price: 0, period: "month", highlighted: false, features: JSON.stringify(["1 active job opening", "Basic applicant tracker", "Email templates"]) },
        { name: "Growth", price: 89, period: "month", highlighted: true, features: JSON.stringify(["10 active job openings", "Automated resume parsing", "Collaborative scoring cards", "Calendar sync"]) },
        { name: "Scale Premium", price: 249, period: "month", highlighted: false, features: JSON.stringify(["Unlimited openings", "Advanced analytics dashboards", "HRIS direct sync hooks", "Dedicated support manager"]) },
      ],
      reviews: [
        { rating: 5, body: "Resume parsing is super smart. Saved us hours of copy-pasting applicant details.", role: "Recruiter Specialist", company: "TalentHive" },
        { rating: 4, body: "Excellent visual board. Mobile version is a bit compact but desktop operates perfectly.", role: "HR Generalist", company: "InnoTech" },
        { rating: 5, body: "We hired 15 engineers in 2 months. The scorecard structure kept everyone fully aligned.", role: "VP Engineering", company: "SpeedySaaS" },
      ],
    },
    {
      name: "HireOS",
      slug: "hireos",
      tagline: "Streamline international payroll and employee compliance.",
      description: "HireOS manages global worker hiring, localized benefits management, and tax declarations. It ensures compliance across 150+ countries with automatic contract generator tools.",
      category: "HR",
      coverColor: "#f59e0b", // Amber
      demoUrl: "https://example.com",
      demoType: "embed",
      teamSizeFit: JSON.stringify(["1-10", "11-50", "51-200", "200+"]),
      pricingModel: "custom",
      rating: 4.2,
      verified: false,
      features: [
        { name: "Global Contracts Engine", icon: "FileSignature", description: "Compliant local contracts automatically structured" },
        { name: "Multi-Currency Payroll", icon: "CreditCard", description: "Pay staff across 40+ currencies in single invoice runs" },
        { name: "Tax Audit Vault", icon: "FolderLock", description: "Secure documentation repository for IRS/W2 validations" },
        { name: "Local Benefit Packages", icon: "Heart", description: "Health insurance, pension provisions tailored per country" },
      ],
      pricingTiers: [
        { name: "Contractors Plan", price: 29, period: "member/month", highlighted: true, features: JSON.stringify(["Global compliance checks", "Contract generation", "Invoice clearing", "Local tax filing"]) },
        { name: "Full-Time Employees", price: 199, period: "member/month", highlighted: false, features: JSON.stringify(["Employer of Record setup", "Full local benefits tracking", "Custom termination handling"]) },
        { name: "Enterprise Global", price: null, period: "month", highlighted: false, features: JSON.stringify(["Custom API integrations", "Dedicated compliance lawyer", "Bulk volume pricing options"]) },
      ],
      reviews: [
        { rating: 4, body: "Very helpful customer support. Settling our first contractor in Spain took under 20 minutes.", role: "Co-Founder", company: "Decentralized Corp" },
        { rating: 4, body: "Local tax calculations are accurate. Dashboard can be complex due to the sheer volume of compliance variables.", role: "Finance Manager", company: "AlphaTech" },
        { rating: 4, body: "HireOS took care of all our contract compliance headaches in Europe.", role: "Operations VP", company: "QuantumGroup" },
      ],
    },
    // Marketing
    {
      name: "GrowthPulse",
      slug: "growthpulse",
      tagline: "AI-driven social media sentiment auditor and scheduling dashboard.",
      description: "GrowthPulse listens to brand mentions across Reddit, X, and LinkedIn. It drafts smart replies and schedules contextual campaigns to maximize audience reach and brand reputation.",
      category: "Marketing",
      coverColor: "#f97316", // Orange
      demoUrl: "https://example.com",
      demoType: "embed",
      teamSizeFit: JSON.stringify(["1-10", "11-50", "51-200"]),
      pricingModel: "freemium",
      rating: 4.8,
      verified: false,
      features: [
        { name: "Sentiment Analysis Engine", icon: "Smile", description: "AI classification of reviews into positive/negative feelings" },
        { name: "Social Scheduler", icon: "Share2", description: "Queue marketing copies for all channels concurrently" },
        { name: "Mention Alert System", icon: "Radio", description: "Instantly alert slack channels when high-reach users mention your brand" },
        { name: "Competition Insights", icon: "Eye", description: "Track competitor engagement curves and top-performing themes" },
      ],
      pricingTiers: [
        { name: "Solo", price: 0, period: "month", highlighted: false, features: JSON.stringify(["3 social profiles", "10 mentions / month", "Basic scheduler"]) },
        { name: "Startup", price: 49, period: "month", highlighted: true, features: JSON.stringify(["10 social profiles", "1,000 mentions / month", "Sentiment analysis dashboard", "Slack alerts"]) },
        { name: "Agency", price: 149, period: "month", highlighted: false, features: JSON.stringify(["50 social profiles", "Unlimited mentions", "Competitive analysis report", "White-label reports"]) },
      ],
      reviews: [
        { rating: 5, body: "The sentiment detection is surprisingly accurate. We intercept customer concerns within minutes.", role: "Head of Support", company: "ExpressStore" },
        { rating: 5, body: "Helped us double our engagement on LinkedIn. Scheduling draft posts is very smooth.", role: "Social Marketer", company: "Freelance" },
        { rating: 4, body: "Excellent tool, very clean visual layout. Wish it supported TikTok analytics, but Twitter/LinkedIn are top tier.", role: "Growth Engineer", company: "HubApp" },
      ],
    },
    {
      name: "Ampli",
      slug: "ampli",
      tagline: "Visual email marketing flow builder built to convert customers.",
      description: "Ampli provides high-performance drag-and-drop newsletter builders, automated drip campaign configurations, and detailed subscriber analytics. It helps marketing teams scale their email lists reliably.",
      category: "Marketing",
      coverColor: "#ec4899", // Pink
      demoUrl: "https://example.com",
      demoType: "embed",
      teamSizeFit: JSON.stringify(["11-50", "51-200", "200+"]),
      pricingModel: "paid",
      rating: 4.5,
      verified: true,
      features: [
        { name: "Drag-Drop Email Designer", icon: "Brush", description: "Design responsive newsletter grids without coding HTML" },
        { name: "Automation Drips", icon: "Workflow", description: "Create sequence triggers based on subscriber behaviors" },
        { name: "A/B Testing Studio", icon: "Split", description: "Test subject titles and layouts to maximize open rates" },
        { name: "Spam Guard Filters", icon: "CheckSquare", description: "Analyze messages pre-delivery to prevent spam directory placements" },
      ],
      pricingTiers: [
        { name: "Starter Suite", price: 15, period: "month", highlighted: false, features: JSON.stringify(["Up to 2,000 subscribers", "Unlimited newsletters", "Basic templates"]) },
        { name: "Growth Suite", price: 49, period: "month", highlighted: true, features: JSON.stringify(["Up to 10,000 subscribers", "Advanced workflows & drips", "A/B testing studio", "Analytics export"]) },
        { name: "Enterprise Scale", price: 199, period: "month", highlighted: false, features: JSON.stringify(["Unlimited subscribers", "Dedicated email IP nodes", "SLA contract guarantee", "Dedicated account designer"]) },
      ],
      reviews: [
        { rating: 4, body: "Drip automation builder is highly visual and easy to configure. Open rates increased by 12%.", role: "Email Specialist", company: "ModaGroup" },
        { rating: 5, body: "Best email delivery rates we've had. The spam validator checks are awesome.", role: "Growth Director", company: "EduLearn" },
        { rating: 4, body: "Clean, reliable email editor. Sometimes large media files upload slowly but rendering is always crisp.", role: "Creative Lead", company: "PublishCo" },
      ],
    },
    // Finance
    {
      name: "Ledgr",
      slug: "ledgr",
      tagline: "Automate your bookkeeping and balance sheet reconciliation.",
      description: "Ledgr connects to bank accounts, corporate credit cards, and merchant processors. It uses machine learning to automatically match transaction line-items to the correct chart of accounts.",
      category: "Finance",
      coverColor: "#f43f5e", // Rose
      demoUrl: "https://example.com",
      demoType: "embed",
      teamSizeFit: JSON.stringify(["11-50", "51-200", "200+"]),
      pricingModel: "freemium",
      rating: 4.7,
      verified: true,
      features: [
        { name: "Bank Ledger Sync", icon: "Library", description: "Sync data from 12,000+ banks and financial institutions" },
        { name: "Auto Categorization", icon: "Tag", description: "Classifies line items based on custom accounting parameters" },
        { name: "Real-time P&L Sheets", icon: "Percent", description: "Dynamically compiles Profit & Loss reports automatically" },
        { name: "Receipt Matcher Scan", icon: "Camera", description: "OCR scanning to upload and bind physical receipts to card charges" },
      ],
      pricingTiers: [
        { name: "Basic", price: 0, period: "month", highlighted: false, features: JSON.stringify(["1 bank connection", "100 transactions / month", "Basic P&L reports"]) },
        { name: "Growth Ledger", price: 99, period: "month", highlighted: true, features: JSON.stringify(["Unlimited connections", "Auto categorization engines", "OCR receipt scanning", "Direct CPA export"]) },
        { name: "Corporate Partner", price: 299, period: "month", highlighted: false, features: JSON.stringify(["Multi-entity support", "Dedicated accountant audits", "Custom ERP system integrations", "Priority support"]) },
      ],
      reviews: [
        { rating: 5, body: "Saves us hours during month-end closing procedures. The OCR receipt scanner works perfectly.", role: "Finance Director", company: "ApexHoldings" },
        { rating: 4, body: "Outstanding synchronization reliability. Reconciliations are almost entirely hands-off.", role: "CPA Auditor", company: "TaxPartners" },
        { rating: 5, body: "As a small company, this keeps our records perfectly audit-ready with zero overhead.", role: "Founder", company: "SoloDesign" },
      ],
    },
    {
      name: "CashFlow360",
      slug: "cashflow360",
      tagline: "Dynamic cash runway forecasting and subscription billing analytics.",
      description: "CashFlow360 hooks into Stripe, PayPal, and Ledgr databases to simulate revenue runways. It allows management teams to model hiring scenarios and marketing spends against their burn rates.",
      category: "Finance",
      coverColor: "#ef4444", // Red
      demoUrl: "https://example.com",
      demoType: "embed",
      teamSizeFit: JSON.stringify(["1-10", "11-50", "51-200"]),
      pricingModel: "paid",
      rating: 4.3,
      verified: false,
      features: [
        { name: "Runway Projections", icon: "Hourglass", description: "Calculates burn rate and runway horizons under diverse parameters" },
        { name: "Stripe & Merchant Sync", icon: "CreditCard", description: "Retrieve subscription lifecycle cohorts in real-time" },
        { name: "Scenario Simulator", icon: "TrendingUp", description: "Simulate impacts of hiring or marketing spend changes on runway" },
        { name: "Investor Dashboard", icon: "PieChart", description: "Export quick read-only metric panels to share with stakeholders" },
      ],
      pricingTiers: [
        { name: "Starter Forecast", price: 39, period: "month", highlighted: false, features: JSON.stringify(["Stripe connector", "12-month runway projection", "Email reports"]) },
        { name: "Active Run", price: 119, period: "month", highlighted: true, features: JSON.stringify(["All merchant connectors", "Scenario simulators", "Investor dashboards", "Custom alerts"]) },
        { name: "Partner Scale", price: null, period: "month", highlighted: false, features: JSON.stringify(["Unlimited simulations", "Dedicated CFO consultation", "On-prem data syncing integrations"]) },
      ],
      reviews: [
        { rating: 5, body: "Modeling hiring plans before signing developers gives us immense confidence.", role: "CEO", company: "DevShop" },
        { rating: 4, body: "Integrates perfectly with Stripe. The scenario modeling is helpful, though UI takes some getting used to.", role: "CFO Advisor", company: "CFO-as-a-Service" },
        { rating: 4, body: "Saves us the pain of updating complex Excel sheets every single week.", role: "Co-Founder", company: "SwiftScale" },
      ],
    },
  ];

  for (const plat of platformsData) {
    const { features, pricingTiers, reviews, ...platformCore } = plat;

    console.log(`Creating platform ${platformCore.name}...`);
    const createdPlatform = await prisma.platform.create({
      data: {
        ...platformCore,
      },
    });

    // Create Features
    for (const feat of features) {
      await prisma.feature.create({
        data: {
          name: feat.name,
          icon: feat.icon,
          description: feat.description,
          platformId: createdPlatform.id,
        },
      });
    }

    // Create Pricing Tiers
    for (const tier of pricingTiers) {
      await prisma.pricingTier.create({
        data: {
          name: tier.name,
          price: tier.price,
          period: tier.period,
          features: tier.features,
          highlighted: tier.highlighted,
          platformId: createdPlatform.id,
        },
      });
    }

    // Create Reviews
    for (const rev of reviews) {
      // Pick a random user from seeded list for reference
      const randomUser = users[Math.floor(Math.random() * users.length)];
      await prisma.review.create({
        data: {
          rating: rev.rating,
          body: rev.body,
          role: rev.role,
          company: rev.company,
          userId: randomUser.id,
          platformId: createdPlatform.id,
        },
      });
    }

    // Update aggregate stats
    const aggReviews = await prisma.review.findMany({
      where: { platformId: createdPlatform.id },
    });
    const reviewCount = aggReviews.length;
    const avgRating = parseFloat(
      (aggReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
    );

    await prisma.platform.update({
      where: { id: createdPlatform.id },
      data: {
        reviewCount,
        rating: avgRating || platformCore.rating, // Fallback to preset rating if average is invalid
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

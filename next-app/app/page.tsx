
import { ChartBarLabel } from "./app/store/[id]/dashboard/components/barchart";
import { Info } from "./app/store/[id]/dashboard/components/info";
import { RevenueChart } from "./app/store/[id]/dashboard/components/revenueChart";
import { LandingPageNavbar as Navbar } from "./components/Navbar";

interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
    colorClass: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, colorClass }) => (
    <div className="p-6 rounded-xl bg-card hover:shadow-xl transition border border-border group">
        <div className={`w-12 h-12 ${colorClass} text-foreground rounded-lg flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition shadow-md`}>
            {icon}
        </div>
        <h3 className="font-bold text-lg mb-2 text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
    </div>
);

const dummyRevenueData  = [
    {
        date: "2022-12-01",
        revenue: 1000,
    },
    {
        date: "2023-01-02",
        revenue: 2000,
    },
    {
        date: "2023-02-03",
        revenue: 3500,
    },
    {
        date: "2023-03-04",
        revenue: 4000,
    },
    {
        date: "2023-04-05",
        revenue: 2000,
    },
    {
        date: "2023-05-06",
        revenue: 6000,
    }
]

const dummyChartData = [
    {
        item: "Item 1",
        revenue: 1000,
    },
    {
        item: "Item 2",
        revenue: 2000,
    },
    {
        item: "Item 3",
        revenue: 300,
    }
]

export default function Home() {
  const GradientText = ({ children }: { children: React.ReactNode }) => (
        <span className="gradient-text">
            {children}
        </span>
    );

    return (
        <div className="bg-bg1 text-foreground relative overflow-x-hidden">
            <Navbar />
            <section className="relative pt-36 pb-32 px-6 max-w-7xl mx-auto text-center">
                <div className="hero-blob"></div>
                <span className="inline-block py-1 px-3 rounded-full bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider mb-6 border border-border">
                    v1.0 is now live
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6">
                    Inventory management <br className="hidden md:block" />
                    for <GradientText>modern brands</GradientText>.
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                    Manage multiple stores, track real-time stock, and automate orders via API. 
                    The open-source alternative designed for scalability.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/app" className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition shadow-xl shadow-primary/20">
                        Start for Free
                    </a>
                    <a href="#features" className="px-8 py-4 bg-card text-foreground font-semibold rounded-lg border border-border hover:bg-secondary transition">
                        Explore Features
                    </a>
                </div>

                <div className="mt-20 relative mx-auto max-w-5xl">
                    <div className="absolute -inset-1 bg-gradient-to-r from-chart-1 to-chart-2 rounded-xl blur opacity-20"></div>
                    <div className="relative bg-card rounded-xl border border-border shadow-2xl overflow-hidden">
                        <div className="bg-bg2 border-b border-border p-3 flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-destructive/80"></div>
                            <div className="w-3 h-3 rounded-full bg-chart-4"></div>
                            <div className="w-3 h-3 rounded-full bg-chart-3"></div>
                        </div>
                        
                        <div className="flex flex-col gap-4 scale-90  ">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Info heading="Number of Items" value={"13"} />
                                <Info heading="Revenue" value={"$16000"} />
                                <Info heading="Profit" value={"$7300"} />
                                <Info heading="Low Stock" value={"6"} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <RevenueChart data={dummyRevenueData} />
                                <ChartBarLabel chartData={dummyChartData} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="py-24 bg-background">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-foreground">Everything you need to run your store</h2>
                        <p className="text-muted-foreground mt-4">Powerful features wrapped in a simple interface.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard icon="🏪" title="Multi-Store" description="Create and manage multiple storefronts from a single Quantefy account." colorClass="bg-chart-2/20 text-chart-2" />
                        <FeatureCard icon="📦" title="Smart Inventory" description="Track stock levels in real-time. Adjust quantities, manage variants, and prevent stockouts." colorClass="bg-chart-3/20 text-chart-3" />
                        <FeatureCard icon="⚡" title="Flexible Orders" description="Create orders manually for walk-ins or automate them via API/Webhooks for online sales." colorClass="bg-chart-4/20 text-chart-4" />
                        <FeatureCard icon="📊" title="Detailed Reports" description="Visualize your sales data. Know which products move fast and which stores perform best." colorClass="bg-chart-5/20 text-chart-5" />
                    </div>
                </div>
            </section>

            {/* --- API Section --- */}
            <section id="api" className="py-24 bg-primary text-primary-foreground overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/80 to-primary opacity-50"></div>
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Built for Developers,<br/>Loved by Managers.</h2>
                        <p className="text-primary-foreground/80 text-lg mb-8">
                            Quantefy allows you to connect your E-commerce platform, POS, or custom app directly via **Webhooks** and **REST APIs**.
                        </p>
                    </div>
                    <div className="bg-background/10 rounded-xl p-6 border border-primary-foreground/20 shadow-2xl font-mono text-sm">
                        <div className="flex gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-destructive/80"></div>
                            <div className="w-3 h-3 rounded-full bg-chart-4"></div>
                            <div className="w-3 h-3 rounded-full bg-chart-3"></div>
                        </div>
                        <div className="text-chart-2 mb-2">// Order Webhook</div>
                        <div className="text-primary-foreground/90">
                            <span className="text-chart-1">POST</span> /api/webhook/[store_id]/order/[item_id] <br/>
                            {'{'}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;"secret": <span className="text-chart-4">"YOUR_WEBHOOK_SECRET"</span>,<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;"quantity": <span className="text-chart-4">2</span>,<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;"price": <span className="text-chart-4">200</span>,<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;"cost": <span className="text-chart-4">120</span>,<br/>
                            {'}'}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 text-center px-6 bg-bg1">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold text-foreground mb-6">Ready to organize your inventory?</h2>
                    <p className="text-lg text-muted-foreground mb-10">
                        Join the open source community and take control of your supply chain today.
                    </p>
                    <a href="https://github.com/syed-minhaj/quantefy" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition transform hover:-translate-y-1 shadow-lg shadow-primary/30">
                        Deploy from GitHub
                    </a>
                </div>
            </section>

            <footer className="bg-background border-t border-border py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-muted-foreground text-sm">
                        &copy; 2025 Quantefy.
                    </div>
                    <div className="flex gap-6">
                        <a href="https://github.com/syed-minhaj/quantefy" className="text-muted-foreground hover:text-primary transition">GitHub</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

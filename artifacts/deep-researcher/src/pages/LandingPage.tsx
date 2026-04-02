import { motion } from "framer-motion";
import { Brain, Search, Menu, Sun, Moon, Shield, BarChart2, Network, AlertTriangle, Share2, ArrowRight } from "lucide-react";
import { SiX, SiGithub, SiDiscord } from "react-icons/si";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isWaitlistVisible = Date.now() < new Date("2026-04-16").getTime();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Sticky Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-[#10A37F] to-[#3B82F6] p-1.5 rounded-lg text-white shadow-sm">
              <Brain className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">Deep Researcher</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#home" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-home">Home</a>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-features">Features</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-pricing">Pricing</a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-about">About</a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
              aria-label="Toggle theme"
              data-testid="button-theme-toggle"
            >
              {mounted && theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Button variant="ghost" data-testid="button-login">Login</Button>
            <Button data-testid="button-signup">Sign Up</Button>
            {isWaitlistVisible && (
              <button 
                className="bg-gradient-to-r from-[#10A37F] to-[#3B82F6] text-white rounded-full px-4 py-2 font-semibold text-sm animate-pulse hover:opacity-90 transition-opacity"
                data-testid="button-waitlist"
              >
                Join Waiting List
              </button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
             <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground mr-2"
            >
              {mounted && theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] flex flex-col gap-6">
                <nav className="flex flex-col gap-4 mt-8">
                  <a href="#home" className="text-lg font-medium" data-testid="nav-mobile-home">Home</a>
                  <a href="#features" className="text-lg font-medium" data-testid="nav-mobile-features">Features</a>
                  <a href="#pricing" className="text-lg font-medium" data-testid="nav-mobile-pricing">Pricing</a>
                  <a href="#about" className="text-lg font-medium" data-testid="nav-mobile-about">About</a>
                </nav>
                <div className="flex flex-col gap-3 mt-auto mb-8">
                  <Button variant="outline" className="w-full" data-testid="button-mobile-login">Login</Button>
                  <Button className="w-full" data-testid="button-mobile-signup">Sign Up</Button>
                  {isWaitlistVisible && (
                    <Button className="w-full bg-gradient-to-r from-[#10A37F] to-[#3B82F6] text-white border-0 hover:opacity-90" data-testid="button-mobile-waitlist">
                      Join Waiting List
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="home" className="pt-32 pb-20 md:pt-48 md:pb-32 px-4 relative overflow-hidden flex flex-col items-center text-center min-h-[90vh] justify-center">
          {/* Decorative background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="z-10 flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border text-sm font-medium text-muted-foreground mb-8">
              <Brain className="w-4 h-4 text-[#10A37F]" />
              AI Conversation Intelligence
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl mb-6">
              <span className="bg-gradient-to-r from-[#10A37F] to-[#3B82F6] bg-clip-text text-transparent">
                Understand How AI Really Thinks
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mb-10">
              Paste any ChatGPT conversation — Get instant analysis
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base bg-gradient-to-r from-[#10A37F] to-[#3B82F6] text-white hover:opacity-90 border-0 group" data-testid="button-hero-start">
                Start Analyzing Free
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base" data-testid="button-hero-demo">
                Watch Demo
              </Button>
            </div>
            
            <div className="mt-8 text-sm text-muted-foreground font-medium flex items-center gap-2">
              <span className="flex -space-x-2">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className={`w-6 h-6 rounded-full border-2 border-background bg-gradient-to-br from-primary/80 to-accent/80 inline-block`} />
                ))}
              </span>
              Join 5,000+ researchers already using Deep Researcher
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to understand AI</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Go beyond the surface text and analyze the underlying cognitive patterns of your AI conversations.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Brain, title: "Reasoning Pattern Analysis", desc: "Identify logical structures, fallacies, and reasoning chains in AI responses" },
                { icon: Shield, title: "Bias Detection", desc: "Detect subtle biases and perspective skews in AI-generated content" },
                { icon: BarChart2, title: "Confidence Scoring", desc: "Measure how certain the AI was in its claims across the conversation" },
                { icon: Network, title: "Topic Mapping", desc: "Visualize how concepts connect and evolve throughout the conversation" },
                { icon: AlertTriangle, title: "Hallucination Flags", desc: "Automatically surface potential factual errors and unsupported claims" },
                { icon: Share2, title: "Export & Share", desc: "Export your analysis as PDF, JSON, or share a live link with teammates" },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                  data-testid={`feature-card-${i}`}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-4 border-t border-border/40">
          <div className="container mx-auto max-w-5xl">
             <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-8 left-[16.66%] right-[16.66%] h-0.5 bg-border -z-10" />
              
              {[
                { step: "01", title: "Paste Conversation", desc: "Export or copy your chat logs directly into the analysis engine." },
                { step: "02", title: "Run Deep Analysis", desc: "Our models parse the interaction for cognitive patterns and metadata." },
                { step: "03", title: "Get Insights", desc: "View detailed structured reports, confidence scores, and visual maps." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="flex flex-col items-center text-center relative z-10"
                >
                  <div className="w-16 h-16 rounded-full bg-background border-2 border-primary text-primary font-bold text-xl flex items-center justify-center shadow-sm mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm max-w-[250px]">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 bg-muted/30 px-4 border-t border-border/40">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Free */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-card border border-border p-8 rounded-2xl flex flex-col"
              >
                <h3 className="text-xl font-bold mb-2">Free</h3>
                <div className="text-4xl font-black mb-6">$0<span className="text-lg text-muted-foreground font-medium">/month</span></div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-2 text-sm"><Search className="w-4 h-4 text-primary" /> 5 analyses/month</li>
                  <li className="flex items-center gap-2 text-sm"><Search className="w-4 h-4 text-primary" /> Basic patterns</li>
                  <li className="flex items-center gap-2 text-sm"><Search className="w-4 h-4 text-primary" /> Export as text</li>
                </ul>
                <Button variant="outline" className="w-full" data-testid="button-pricing-free">Get Started</Button>
              </motion.div>

              {/* Pro */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-card border-2 border-primary p-8 rounded-2xl flex flex-col relative shadow-xl shadow-primary/5 transform md:-translate-y-4"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#10A37F] to-[#3B82F6] text-white px-4 py-1 rounded-full text-sm font-bold shadow-sm">
                  Most Popular
                </div>
                <h3 className="text-xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-black mb-6">$9.99<span className="text-lg text-muted-foreground font-medium">/month</span></div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-2 text-sm"><Search className="w-4 h-4 text-primary" /> Unlimited analyses</li>
                  <li className="flex items-center gap-2 text-sm"><Search className="w-4 h-4 text-primary" /> All detection features</li>
                  <li className="flex items-center gap-2 text-sm"><Search className="w-4 h-4 text-primary" /> PDF/JSON export</li>
                  <li className="flex items-center gap-2 text-sm"><Search className="w-4 h-4 text-primary" /> Priority support</li>
                </ul>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-pricing-pro">Get Started</Button>
              </motion.div>

              {/* Business */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-border p-8 rounded-2xl flex flex-col"
              >
                <h3 className="text-xl font-bold mb-2">Business</h3>
                <div className="text-4xl font-black mb-6">$29.99<span className="text-lg text-muted-foreground font-medium">/month</span></div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-2 text-sm"><Search className="w-4 h-4 text-primary" /> Everything in Pro</li>
                  <li className="flex items-center gap-2 text-sm"><Search className="w-4 h-4 text-primary" /> Team collaboration</li>
                  <li className="flex items-center gap-2 text-sm"><Search className="w-4 h-4 text-primary" /> API access</li>
                  <li className="flex items-center gap-2 text-sm"><Search className="w-4 h-4 text-primary" /> Custom integrations</li>
                  <li className="flex items-center gap-2 text-sm"><Search className="w-4 h-4 text-primary" /> SSO</li>
                </ul>
                <Button variant="outline" className="w-full" data-testid="button-pricing-business">Contact Sales</Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-4 border-t border-border/40">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by researchers and AI enthusiasts</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  text: "Deep Researcher completely changed how our team evaluates LLM outputs. The reasoning pattern maps instantly highlight logical leaps we used to miss manually.",
                  author: "Dr. Sarah Chen",
                  title: "AI Researcher at MIT",
                  initials: "SC"
                },
                { 
                  text: "As a prompt engineer, seeing the confidence scoring across a multi-turn conversation is invaluable. It's the debugger I didn't know I needed.",
                  author: "Marcus Thorne",
                  title: "Lead Prompt Engineer",
                  initials: "MT"
                },
                { 
                  text: "The hallucination flags catch subtle factual errors that even domain experts struggle to spot on a first pass. Highly recommended for production QA.",
                  author: "Elena Varga",
                  title: "Director of ML Ops",
                  initials: "EV"
                }
              ].map((review, i) => (
                <div key={i} className="bg-card border border-border p-6 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 text-yellow-500 mb-4">
                      {/* Using HTML stars since emojis are restricted per prompt guidelines */}
                      <span className="text-lg">★★★★★</span>
                    </div>
                    <p className="text-muted-foreground text-sm italic mb-6 leading-relaxed">"{review.text}"</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-foreground font-bold text-sm">
                      {review.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{review.author}</p>
                      <p className="text-xs text-muted-foreground">{review.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border pt-16 pb-8 px-4" id="about">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-[#10A37F] to-[#3B82F6] p-1.5 rounded-lg text-white">
                  <Brain className="w-5 h-5" />
                </div>
                <span className="font-bold text-xl">Deep Researcher</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-sm mb-6">
                Unveiling the cognitive architecture of artificial intelligence conversations through advanced structured analysis.
              </p>
              <div className="flex gap-4">
                <a href="#" data-testid="link-twitter" className="text-muted-foreground hover:text-foreground transition-colors"><SiX className="w-5 h-5" /></a>
                <a href="#" data-testid="link-github" className="text-muted-foreground hover:text-foreground transition-colors"><SiGithub className="w-5 h-5" /></a>
                <a href="#" data-testid="link-discord" className="text-muted-foreground hover:text-foreground transition-colors"><SiDiscord className="w-5 h-5" /></a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">© 2026 Deep Researcher. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

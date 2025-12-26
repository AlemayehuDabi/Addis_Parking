import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Car, Wifi, MapPin, CreditCard, BarChart3, Zap, 
  Shield, Clock, ArrowRight, Play, ChevronDown,
  Cpu, Radio, Cloud, Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

const LandingPage = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const features = [
    {
      icon: Wifi,
      title: "Real-Time Detection",
      description: "Live status updates via HC-SR04 ultrasonic sensors with sub-second latency.",
      color: "text-primary",
      size: "col-span-2 row-span-2",
    },
    {
      icon: MapPin,
      title: "GPS Navigation",
      description: "Turn-by-turn directions to your exact parking slot.",
      color: "text-accent",
      size: "col-span-1 row-span-1",
    },
    {
      icon: CreditCard,
      title: "Chapa Payments",
      description: "Ethiopia's fastest checkout integrated directly.",
      color: "text-success",
      size: "col-span-1 row-span-1",
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Data-driven insights for parking lot owners and operators.",
      color: "text-primary",
      size: "col-span-1 row-span-1",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Enterprise-grade security for all transactions.",
      color: "text-accent",
      size: "col-span-1 row-span-1",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden dark">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between rounded-2xl border border-border/30 bg-background/60 backdrop-blur-xl px-6 py-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">ParkSense</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#technology" className="text-muted-foreground hover:text-foreground transition-colors">
                Technology
              </a>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to="/auth">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  Sign In
                </Button>
              </Link>
              <Link to="/app">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6">
                  Launch App
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={targetRef} className="relative min-h-screen flex items-center justify-center pt-24">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div style={{ y, opacity }} className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          </motion.div>
          
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                               linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">IoT-Powered Smart Parking</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
              <span className="text-foreground">Parking,</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                Reimagined
              </span>
              <br />
              <span className="text-foreground">through IoT.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance">
              Real-time sensing, instant reservations, and seamless payments. 
              Experience the future of urban mobility.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth?mode=signup">
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 py-6 text-lg font-semibold group"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
                className="rounded-xl px-8 py-6 text-lg border-border/50 hover:bg-secondary/50"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-muted-foreground"
            >
              <span className="text-sm">Scroll to explore</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Hardware Sync Section */}
      <section id="technology" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 mb-6">
              <Cpu className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent font-medium">Hardware Integration</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              ESP32 + Ultrasonic Sensors
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Millisecond-accurate vehicle detection powered by industrial-grade IoT hardware
            </p>
          </motion.div>

          {/* Hardware Flow */}
          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            
            {[
              { icon: Radio, title: "HC-SR04 Sensor", desc: "Ultrasonic detection", delay: 0 },
              { icon: Cpu, title: "ESP32 MCU", desc: "Edge processing", delay: 0.1 },
              { icon: Cloud, title: "Cloud Sync", desc: "Real-time updates", delay: 0.2 },
              { icon: Smartphone, title: "Your Device", desc: "Instant notification", delay: 0.3 },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: item.delay }}
                className="relative"
              >
                <div className="glass-card rounded-2xl p-8 text-center relative z-10 hover:border-primary/50 transition-colors">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-primary/20 items-center justify-center z-20">
                    <ArrowRight className="w-3 h-3 text-primary" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Latency Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-12 flex justify-center"
          >
            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full border border-success/30 bg-success/10">
              <Clock className="w-5 h-5 text-success" />
              <span className="text-success font-mono font-semibold">&lt; 50ms latency</span>
              <span className="text-muted-foreground">from detection to display</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Everything you need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete solution for modern urban parking management
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-fr">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`${feature.size} glass-card rounded-2xl p-6 md:p-8 hover:border-primary/50 transition-all group cursor-pointer`}
              >
                <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Solving Urban Congestion,<br />
                <span className="text-primary">One Spot at a Time</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                30% of urban traffic is caused by drivers searching for parking. 
                ParkSense eliminates this waste by providing real-time visibility into every parking space.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Our IoT-first approach combines industrial-grade hardware with consumer-friendly software, 
                creating a seamless experience for drivers and operators alike.
              </p>
              <div className="flex gap-8">
                <div>
                  <div className="text-3xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">200+</div>
                  <div className="text-sm text-muted-foreground">Parking Lots</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl glass-card p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
                <div className="relative z-10 h-full flex flex-col justify-center items-center">
                  <div className="grid grid-cols-3 gap-3">
                    {[...Array(9)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className={`w-16 h-16 rounded-xl ${
                          i % 3 === 0 ? 'bg-success/30 border border-success/50' :
                          i % 3 === 1 ? 'bg-destructive/30 border border-destructive/50' :
                          'bg-accent/30 border border-accent/50'
                        } flex items-center justify-center`}
                      >
                        <Car className={`w-6 h-6 ${
                          i % 3 === 0 ? 'text-success' :
                          i % 3 === 1 ? 'text-destructive' :
                          'text-accent'
                        }`} />
                      </motion.div>
                    ))}
                  </div>
                  <p className="mt-6 text-sm text-muted-foreground">Live parking visualization</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 relative">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 md:p-12"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Get in Touch
              </h2>
              <p className="text-muted-foreground">
                Interested in deploying ParkSense at your facility? Let's talk.
              </p>
            </div>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-4 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all peer placeholder-transparent"
                    placeholder="Name"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-4 -top-2.5 text-xs text-muted-foreground bg-card px-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary"
                  >
                    Name
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-4 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all peer placeholder-transparent"
                    placeholder="Email"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-4 -top-2.5 text-xs text-muted-foreground bg-card px-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary"
                  >
                    Email
                  </label>
                </div>
              </div>
              <div className="relative">
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-4 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none peer placeholder-transparent"
                  placeholder="Message"
                />
                <label
                  htmlFor="message"
                  className="absolute left-4 -top-2.5 text-xs text-muted-foreground bg-card px-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary"
                >
                  Message
                </label>
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-6 text-lg font-semibold">
                Send Message
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <span className="text-lg font-bold text-foreground">ParkSense</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 ParkSense. Built with ❤️ in Ethiopia.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

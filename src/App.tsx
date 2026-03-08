import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  BrainCircuit,
  Briefcase,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  DatabaseZap,
  Globe,
  Linkedin,
  LineChart,
  Mail,
  MapPin,
  Menu,
  Phone,
  Users,
  UsersRound,
  X,
} from 'lucide-react';
import { motion } from 'framer-motion';
import ThreeBackground from './components/ThreeBackground';

const navLinks = [
  { label: 'Overview', href: '#overview' },
  { label: 'Demo', href: '#demo' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

type CompanyFact = {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  icon: typeof Globe;
};

const useCases = [
  {
    key: 'attrition',
    title: 'Attrition Risk',
    blurb: 'Identify high-risk teams and intervene with targeted retention nudges.',
    metric: '34% earlier signal detection',
  },
  {
    key: 'engagement',
    title: 'Engagement Intelligence',
    blurb: 'Correlate manager behavior, workload, and sentiment to improve team health.',
    metric: '2.7x faster action loops',
  },
  {
    key: 'performance',
    title: 'Performance Visibility',
    blurb: 'Unify goal progression, learning, and feedback for evidence-backed growth decisions.',
    metric: '91% leadership visibility',
  },
  {
    key: 'hiring',
    title: 'Hiring Funnel Intelligence',
    blurb: 'Track pipeline leakage, interview velocity, and quality-of-hire signals in one model.',
    metric: '41% faster hiring decisions',
  },
  {
    key: 'productivity',
    title: 'Productivity Optimization',
    blurb: 'Connect collaboration, workload, and outcome metrics to improve team effectiveness.',
    metric: '29% better manager response time',
  },
];

const demoSuggestions = [
  'Analyze attrition in Engineering for the last 2 quarters',
  'Create a plan to improve onboarding completion by 20%',
  'Detect burnout risk across customer support teams',
];

const platformPillars = [
  {
    title: 'Unified Data Fabric',
    copy: 'Integrate HRIS, payroll, ATS, LMS, and engagement systems into one governed data layer.',
  },
  {
    title: 'Agentic AI Systems',
    copy: 'AI assistants automate analysis, reporting, and repetitive HR workflows for faster execution.',
  },
  {
    title: 'HR → Business Impact',
    copy: 'Connect workforce insights directly to revenue, cost, and performance outcomes.',
  },
];

const flowContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.12,
    },
  },
};

const flowItem = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 16,
      mass: 0.8,
    },
  },
};

const companyFacts: CompanyFact[] = [
  {
    label: 'Website',
    value: 'https://www.dattamsha.co.in',
    href: 'https://www.dattamsha.co.in',
    external: true,
    icon: Globe,
  },
  { label: 'Phone', value: '+91 9013333243', href: 'tel:+919013333243', icon: Phone },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/company/dattamsha-data-labs',
    href: 'https://www.linkedin.com/company/dattamsha-data-labs/',
    external: true,
    icon: Linkedin,
  },
  { label: 'Industry', value: 'Technology, Information and Internet', icon: Briefcase },
  { label: 'Company Size', value: '2-10 employees', icon: Users },
  {
    label: 'Primary NCR Office',
    value: 'Tata Gurgaon Gateway, Sector 112-113, Tower B, 303, Gurugram, Haryana 122101, IN',
    href: 'https://www.google.com/maps/search/?api=1&query=Tata+Gurgaon+Gateway+Sector+112-113+Tower+B+303+Gurugram+Haryana+122101',
    external: true,
    icon: MapPin,
  },
  {
    label: 'Registered Office',
    value: 'Sainik Colony Road, G 16 Extension, Jammu, Jammu & Kashmir 180011, IN',
    href: 'https://www.google.com/maps/search/?api=1&query=Sainik+Colony+Road+G+16+Extension+Jammu+Jammu+and+Kashmir+180011',
    external: true,
    icon: MapPin,
  },
  { label: 'Founded', value: '2025', icon: CalendarDays },
  {
    label: 'CEO',
    value: 'Daksh Sahni',
    href: 'https://www.linkedin.com/in/dakshsahni92/',
    external: true,
    icon: UsersRound,
  },
];

const officeMapLink =
  'https://www.google.com/maps/search/?api=1&query=Tata+Gurgaon+Gateway+Sector+112-113+Tower+B+303+Gurugram+Haryana+122101';
const registeredOfficeMapLink =
  'https://www.google.com/maps/search/?api=1&query=Sainik+Colony+Road+G+16+Extension+Jammu+Jammu+and+Kashmir+180011';

const directors = [
  {
    name: 'Rakesh Chander Sahni',
    role: 'Director',
    gender: 'Male',
    initials: 'RS',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZPY2bfKdQKR8BvTigVyzx_Sw2J9aL1X07PA&s',
  },
  {
    name: 'Neera Sahni',
    role: 'Director',
    gender: 'Female',
    initials: 'NS',
    image:
      'https://static.vecteezy.com/system/resources/previews/036/594/082/non_2x/illustration-depicting-female-face-silhouettes-or-icons-serving-as-avatars-or-profiles-for-unknown-or-anonymous-individuals-the-illustration-portrays-woman-portrait-free-vector.jpg',
  },
];

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.floor(target * progress));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

function useTriggeredCountUp(target: number, start: boolean, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const begin = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - begin) / duration, 1);
      setValue(Math.floor(target * progress));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);

  return value;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navCondensed, setNavCondensed] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [command, setCommand] = useState('');
  const [log, setLog] = useState<string[]>([
    'Initializing Dattamsha Core... Done.',
    'Loading Gemini Neural Interface... Done.',
    'System Ready. I am Dattamsha Agent v2.0. Describe an HR Operations challenge.',
    '',
  ]);
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeUseCaseIndex, setActiveUseCaseIndex] = useState(0);
  const [activeHowIndex, setActiveHowIndex] = useState(0);
  const [activeComparisonIndex, setActiveComparisonIndex] = useState(0);
  const [pauseUseCaseAuto, setPauseUseCaseAuto] = useState(false);
  const [startImpactCount, setStartImpactCount] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState<'idle' | 'sent'>('idle');

  const coverage = useCountUp(94, 1300);
  const signals = useCountUp(320, 1500);
  const lagReduction = useCountUp(27, 1200);
  const impactRef = useRef<HTMLDivElement | null>(null);
  const impactMin = useTriggeredCountUp(15, startImpactCount, 950);
  const impactMax = useTriggeredCountUp(25, startImpactCount, 1250);
  const impactOps = useTriggeredCountUp(50, startImpactCount, 1150);
  const impactCompliance = useTriggeredCountUp(100, startImpactCount, 1450);

  const runCommand = async (input: string) => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    setCommand('');
    setLog((prev) => [...prev, `admin@dattamsha:~$ ${trimmed}`, 'Running autonomous HR workflow...']);
    setIsStreaming(true);
    setStreamingText('Analyzing workforce signals...');

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: trimmed }),
      });

      const raw = await response.text();
      let data: { response?: string; error?: string } | null = null;
      if (raw) {
        try {
          data = JSON.parse(raw) as { response?: string; error?: string };
        } catch {
          data = null;
        }
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            `AI service request failed (${response.status}). Ensure backend server is running on /api/agent.`,
        );
      }

      if (!data) {
        throw new Error('AI service returned an empty response. Please retry.');
      }

      const finalResponse =
        typeof data.response === 'string' && data.response.trim()
          ? data.response.trim()
          : 'Agent response was empty.';

      setStreamingText('');

      let index = 0;
      const timer = window.setInterval(() => {
        index += 3;
        if (index >= finalResponse.length) {
          window.clearInterval(timer);
          setStreamingText('');
          setIsStreaming(false);
          setLog((prev) => [...prev, finalResponse, '']);
          return;
        }
        setStreamingText(finalResponse.slice(0, index));
      }, 18);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error while running AI agent.';
      setIsStreaming(false);
      setStreamingText('');
      setLog((prev) => [...prev, `Error: ${message}`, '']);
    }
  };

  const handleDemoSubmit = (event: FormEvent) => {
    event.preventDefault();
    runCommand(command);
  };

  const handleContactSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = contactName.trim();
    const trimmedEmail = contactEmail.trim();
    const trimmedCompany = contactCompany.trim();
    const trimmedMessage = contactMessage.trim();
    if (!trimmedName || !trimmedEmail || !trimmedMessage) return;

    const subject = `New inquiry from ${trimmedName}`;
    const body = [
      `Name: ${trimmedName}`,
      `Email: ${trimmedEmail}`,
      `Company: ${trimmedCompany || 'Not provided'}`,
      '',
      'Message:',
      trimmedMessage,
    ].join('\n');

    window.location.href = `mailto:info@dataproducts.co.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setContactStatus('sent');
  };

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const ids = navLinks.map((item) => item.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0.1 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };

    window.addEventListener('keydown', onEsc);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onEsc);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      setNavCondensed(window.scrollY > 28);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const revealElements = document.querySelectorAll<HTMLElement>('.reveal-section');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('in-view');
        });
      },
      { threshold: 0.14 },
    );

    revealElements.forEach((el) => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    if (pauseUseCaseAuto) return;
    const timer = window.setInterval(() => {
      setActiveUseCaseIndex((prev) => (prev + 1) % useCases.length);
    }, 3800);
    return () => window.clearInterval(timer);
  }, [pauseUseCaseAuto]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHowIndex((prev) => (prev + 1) % platformPillars.length);
    }, 2300);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveComparisonIndex((prev) => (prev + 1) % 3);
    }, 2200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!impactRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStartImpactCount(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(impactRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="site-shell text-slate-100">
      <ThreeBackground />
      <div className="ambient-glow" />
      <div className="scroll-progress-track">
        <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
      </div>

      <header
        className={`fixed inset-x-0 top-0 z-50 px-4 transition-all duration-300 sm:px-6 lg:px-10 ${
          navCondensed ? 'pt-1.5 sm:pt-2 lg:pt-2' : 'pt-4'
        }`}
      >
        <div
          className={`nav-shell mx-auto flex w-full max-w-[92rem] items-center justify-between transition-all duration-300 ${
            navCondensed ? 'rounded-xl px-4 py-2.5 sm:px-5' : 'rounded-2xl px-4 py-3 sm:px-5'
          }`}
        >
          <a href="#overview" className="brand-lockup flex items-center gap-3" onClick={handleNavClick}>
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/15 shadow-lg shadow-cyan-950/30">
              <img src="/logo.png" alt="Dattamsha Data Labs logo" className="h-full w-full object-contain" />
            </span>
            <span className="font-display text-base text-white sm:text-lg">Dattamsha Data Labs</span>
          </a>

          <nav className="hidden items-center gap-2 md:flex">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={activeSection === item.href.slice(1) ? 'nav-link active' : 'nav-link'}
                onClick={handleNavClick}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button type="button" onClick={() => setMenuOpen((v) => !v)} className="mobile-toggle md:hidden">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <div className="absolute left-4 right-4 top-[calc(100%+0.5rem)] rounded-2xl border border-white/15 bg-slate-950/95 px-5 py-4 shadow-2xl shadow-black/35 backdrop-blur-xl sm:left-6 sm:right-6 lg:left-10 lg:right-10 md:hidden">
            <div className="flex flex-col gap-2 text-sm text-slate-200">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={
                    activeSection === item.href.slice(1)
                      ? 'rounded-lg bg-white/10 px-3 py-2 text-white'
                      : 'rounded-lg px-3 py-2 text-slate-200 transition hover:bg-white/5 hover:text-white'
                  }
                  onClick={handleNavClick}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-[92rem] px-4 pb-8 pt-28 sm:px-6 sm:pb-10 sm:pt-32 lg:px-10 lg:pt-36">
        <section id="overview" className="reveal-section grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="section-kicker">Autonomous Workforce Intelligence</p>
            <h1 className="hero-title">Building Autonomous HR Systems with AI & Data.</h1>
            <p className="section-copy max-w-2xl">
              Dattamsha Data Labs helps organizations unify people data, automate HR decisions, and
              connect workforce strategy directly to business outcomes.
            </p>
            <p className="section-copy mt-2 max-w-2xl">
              From fragmented HR tools to one intelligent operating layer, we enable faster, smarter,
              and measurable people decisions.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#solutions" className="btn-primary">
                Explore Platform
              </a>
              <a href="#contact" className="btn-secondary">
                Book Demo
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-cyan-300/35 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">
                Live Signals
              </span>
              <span className="rounded-full border border-cyan-300/35 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">
                Predictive Models
              </span>
              <span className="rounded-full border border-cyan-300/35 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">
                Agentic Execution
              </span>
            </div>
          </div>

          <div className="hero-3d-panel float-gentle section-frame rounded-[26px] border border-white/15 bg-slate-900/70">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="kpi-box">
                <p className="metric-number text-3xl font-semibold text-white">{coverage}%</p>
                <p className="mt-2 text-xs text-slate-300">Data coverage across HR stack</p>
              </div>
              <div className="kpi-box">
                <p className="metric-number text-3xl font-semibold text-white">{signals}+</p>
                <p className="mt-2 text-xs text-slate-300">Workforce signals tracked</p>
              </div>
              <div className="kpi-box">
                <p className="metric-number text-3xl font-semibold text-white">{lagReduction}%</p>
                <p className="mt-2 text-xs text-slate-300">Reduction in insight lag</p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-5">
              <p className="text-sm leading-relaxed text-slate-100">
                AI alerts surface burnout risk, attrition hotspots, and performance bottlenecks before
                they become business-level problems.
              </p>
            </div>
          </div>

          <div ref={impactRef} className="lg:col-span-2">
            <div className="section-frame rounded-[24px] border border-white/15 bg-slate-900/55">
              <div className="flex items-end justify-between gap-3">
                <p className="section-kicker !mb-0">Impact Metrics</p>
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Business Outcomes</p>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="kpi-box text-center">
                  <p className="metric-number font-display text-3xl text-cyan-200 sm:text-4xl">{impactMin}-{impactMax}%</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">Increase in employee engagement</p>
                </div>
                <div className="kpi-box text-center">
                  <p className="metric-number font-display text-3xl text-cyan-200 sm:text-4xl">{impactOps}%</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">Reduction in HR operations effort</p>
                </div>
                <div className="kpi-box text-center">
                  <p className="metric-number font-display text-3xl text-cyan-200 sm:text-4xl">{impactCompliance}%</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">Compliance workflow automation</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-block reveal-section">
          <div className="mx-auto max-w-4xl text-center">
            <p className="section-kicker">How It Works</p>
            <h2 className="section-title">Three Engines, One Autonomous HR System</h2>
          </div>
          <motion.div
            className="how-flow mt-8"
            variants={flowContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.28 }}
          >
            {platformPillars.map((pillar, index) => (
              <motion.div key={pillar.title} className="how-step-wrap" variants={flowItem}>
                <motion.article
                  className={index === activeHowIndex ? 'surface-card how-card active' : 'surface-card how-card'}
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 24 }}
                >
                  <p className="how-step-label">Step {index + 1}</p>
                  <h3 className="font-display text-2xl text-white">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{pillar.copy}</p>
                </motion.article>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="section-block reveal-section">
          <div className="mx-auto max-w-4xl text-center">
            <p className="section-kicker">Comparison</p>
            <h2 className="section-title">Traditional HR vs Autonomous HR</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <motion.div
              className="surface-card border border-rose-300/25 bg-rose-900/10"
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 240, damping: 22 }}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-rose-200">Traditional HR</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li className={activeComparisonIndex === 0 ? 'compare-point active traditional' : 'compare-point'}>
                  • Siloed tools and delayed reporting
                </li>
                <li className={activeComparisonIndex === 1 ? 'compare-point active traditional' : 'compare-point'}>
                  • Manual analysis and reactive decisions
                </li>
                <li className={activeComparisonIndex === 2 ? 'compare-point active traditional' : 'compare-point'}>
                  • Limited visibility into business impact
                </li>
              </ul>
            </motion.div>
            <motion.div
              className="surface-card border border-emerald-300/25 bg-emerald-900/10"
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 240, damping: 22 }}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-200">Autonomous HR</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li className={activeComparisonIndex === 0 ? 'compare-point active autonomous' : 'compare-point'}>
                  • Unified workforce data in one intelligence layer
                </li>
                <li className={activeComparisonIndex === 1 ? 'compare-point active autonomous' : 'compare-point'}>
                  • Agentic AI for continuous analysis and action
                </li>
                <li className={activeComparisonIndex === 2 ? 'compare-point active autonomous' : 'compare-point'}>
                  • HR initiatives linked to revenue and performance
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        <section id="about" className="section-block reveal-section">
          <div className="section-frame grid gap-8 rounded-[30px] border border-white/15 bg-slate-900/65 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="section-kicker">Founder Story + Vision</p>
              <h2 className="section-title">CEO-led. Employee-driven.</h2>
              <p className="section-copy">
                Dattamsha Data Labs is built by leaders and practitioners who combine HR analytics,
                data engineering, and AI systems to solve real workforce problems.
              </p>

              <a
                href="https://www.linkedin.com/in/dakshsahni92/"
                target="_blank"
                rel="noreferrer"
                className="founder-card mt-6"
              >
                <img src="/ceo.png" alt="Daksh Sahni" className="founder-avatar" />
                <div>
                  <h3 className="founder-name">Daksh Sahni</h3>
                  <p className="founder-role">Founder & CEO</p>
                  <p className="founder-copy">
                    Daksh Sahni spent 10+ years leading HR Analytics & Digitization at global
                    enterprises before founding Dattamsha Data Labs.
                  </p>
                </div>
              </a>

              <div className="director-grid mt-4">
                {directors.map((director) => (
                  <article key={director.name} className="director-card">
                    {director.image ? (
                      <img src={director.image} alt="Director avatar" className="director-avatar-image" />
                    ) : (
                      <div
                        className={
                          director.gender === 'Male'
                            ? 'director-avatar director-avatar-male'
                            : 'director-avatar director-avatar-female'
                        }
                      >
                        {director.initials}
                      </div>
                    )}
                    <div>
                      <h3 className="director-name">{director.name}</h3>
                      <p className="director-role">{director.role}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="mini-card">
                <UsersRound className="text-cyan-200" size={20} />
                <p>Small, high-impact team (2-10) focused on enterprise-grade delivery.</p>
              </div>
              <div className="mini-card">
                <BrainCircuit className="text-cyan-200" size={20} />
                <p>Employees build AI workflows that convert insights into measurable actions.</p>
              </div>
              <div className="mini-card">
                <Building2 className="text-cyan-200" size={20} />
                <p>Team experience spans HR analytics, digitization, and process automation.</p>
              </div>

              <div className="surface-card">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-300">Quick Facts</p>
                <div className="mt-3 grid gap-2">
                  {companyFacts
                    .filter((item) =>
                      ['Industry', 'Company Size', 'Primary NCR Office', 'Registered Office', 'Founded'].includes(
                        item.label,
                      ),
                    )
                    .map(({ label, value, href, external }) => (
                      <p key={label} className="text-sm text-slate-200">
                        <span className="font-semibold text-white">{label}:</span>{' '}
                        {href ? (
                          <a
                            href={href}
                            target={external ? '_blank' : undefined}
                            rel={external ? 'noreferrer' : undefined}
                            className="text-cyan-200 underline decoration-cyan-500/50 underline-offset-2 hover:text-cyan-100"
                          >
                            {value}
                          </a>
                        ) : (
                          value
                        )}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="solutions" className="section-block reveal-section">
          <div
            className="carousel-shell"
            onMouseEnter={() => setPauseUseCaseAuto(true)}
            onMouseLeave={() => setPauseUseCaseAuto(false)}
          >
            <button
              type="button"
              className="carousel-arrow left"
              aria-label="Previous slide"
              onClick={() => setActiveUseCaseIndex((activeUseCaseIndex - 1 + useCases.length) % useCases.length)}
            >
              <ChevronLeft size={18} />
            </button>

            <div className="result-panel section-frame rounded-3xl border border-white/15">
              <div className="carousel-viewport">
                <div
                  className="carousel-track"
                  style={{ transform: `translateX(-${activeUseCaseIndex * 100}%)` }}
                >
                  {useCases.map((item) => (
                    <div key={item.key} className="carousel-slide">
                      <div className="grid min-w-0 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                        <div className="min-w-0">
                          <h3 className="font-display text-2xl text-white sm:text-3xl lg:text-4xl">{item.title}</h3>
                          <p className="mt-4 max-w-none break-words text-sm leading-relaxed text-slate-300 sm:text-base">
                            {item.blurb}
                          </p>
                          <p className="mt-6 inline-flex rounded-full border border-emerald-300/40 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                            {item.metric}
                          </p>
                        </div>
                        <div className="surface-card pulse-glow min-w-0">
                          <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">System Response</p>
                          <ul className="mt-4 space-y-3 text-slate-200">
                            <li className="flex items-center gap-2">
                              <LineChart size={16} className="text-cyan-200" /> Predictive trend modelling
                            </li>
                            <li className="flex items-center gap-2">
                              <BrainCircuit size={16} className="text-cyan-200" /> AI recommendation sequencing
                            </li>
                            <li className="flex items-center gap-2">
                              <DatabaseZap size={16} className="text-cyan-200" /> Unified cross-system context
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="carousel-arrow right"
              aria-label="Next slide"
              onClick={() => setActiveUseCaseIndex((activeUseCaseIndex + 1) % useCases.length)}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="mt-5 flex justify-center gap-2">
            {useCases.map((item, index) => (
              <button
                key={item.key}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => setActiveUseCaseIndex(index)}
                className={index === activeUseCaseIndex ? 'carousel-dot active' : 'carousel-dot'}
              />
            ))}
          </div>
        </section>

        <section id="demo" className="section-block reveal-section">
          <div className="mx-auto max-w-4xl text-center">
            <p className="section-kicker">Interactive Demo</p>
            <h2 className="section-title">Experience Autonomous HR</h2>
            <p className="section-copy">
              Simulate an agentic workflow. Type a workforce challenge and watch Dattamsha Agent
              respond.
            </p>
          </div>

          <div className="terminal-shell pulse-glow section-frame mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-cyan-900/40">
            <div className="terminal-head flex items-center justify-between border-b border-white/10 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <p className="text-sm text-slate-300">Dattamsha_Agent_v2.0 -bash</p>
            </div>

            <div className="terminal-body">
              <div className="space-y-2 text-left font-mono text-lg leading-relaxed text-slate-200">
                {log.map((line, index) => (
                  <p key={`${line}-${index}`} className="whitespace-pre-wrap">
                    {line}
                  </p>
                ))}
                {isStreaming && (
                  <p className="whitespace-pre-wrap text-cyan-100">
                    {streamingText}
                    <span className="terminal-cursor">▋</span>
                  </p>
                )}
              </div>

              <form
                onSubmit={handleDemoSubmit}
                className="mt-6 flex flex-col items-stretch gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center"
              >
                <span className="font-mono text-cyan-300 sm:whitespace-nowrap">admin@dattamsha:~$</span>
                <input
                  value={command}
                  onChange={(event) => setCommand(event.target.value)}
                  placeholder="Type command..."
                  className="terminal-input w-full flex-1"
                  disabled={isStreaming}
                />
                <button type="submit" className="terminal-send" disabled={isStreaming}>
                  <ArrowRight size={16} />
                </button>
              </form>

              <div className="mt-5 flex flex-wrap gap-2">
                {demoSuggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => runCommand(item)}
                    className="suggest-chip"
                    disabled={isStreaming}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-block reveal-section">
          <div className="section-frame next-step-shell rounded-[30px] border border-cyan-300/25 bg-cyan-400/10">
            <div className="next-step-layout">
              <motion.div
                className="next-step-main"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="section-kicker">Next Step</p>
                <h2 className="section-title next-step-title">Start Building Autonomous HR.</h2>
                <p className="section-copy max-w-2xl">
                  Turn fragmented HR operations into one intelligent system that continuously analyzes,
                  recommends, and drives action.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <motion.span className="next-step-chip" whileInView={{ scale: [0.96, 1] }} transition={{ duration: 0.4 }}>
                    30-min strategy call
                  </motion.span>
                  <motion.span
                    className="next-step-chip"
                    whileInView={{ scale: [0.96, 1] }}
                    transition={{ duration: 0.4, delay: 0.08 }}
                  >
                    Custom workforce blueprint
                  </motion.span>
                  <motion.span
                    className="next-step-chip"
                    whileInView={{ scale: [0.96, 1] }}
                    transition={{ duration: 0.4, delay: 0.16 }}
                  >
                    Pilot-ready in weeks
                  </motion.span>
                </div>
              </motion.div>
              <motion.div
                className="next-step-cta"
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.32 }}
                transition={{ type: 'spring', stiffness: 130, damping: 16 }}
              >
                <p className="text-sm text-slate-300">
                  Speak with Dattamsha team and map your first autonomous HR use case.
                </p>
                <div className="mt-5 flex items-center gap-3 next-step-actions">
                  <a href="#contact" className="btn-primary next-step-btn-primary">
                    Start Building Autonomous HR <ArrowRight size={16} />
                  </a>
                  <a href="#demo" className="btn-secondary next-step-btn-secondary">
                    Try Interactive Demo
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="contact" className="section-block reveal-section">
          <div className="section-frame contact-panel mx-auto max-w-6xl rounded-[28px] border border-white/15 bg-slate-900/65">
            <div className="mx-auto max-w-3xl text-center">
              <p className="section-kicker">Contact</p>
              <h2 className="section-title">Connect with Dattamsha Data Labs</h2>
              <p className="section-copy">Talk to our team for workforce intelligence and AI-led HR transformation.</p>
            </div>
            <div className="contact-layout mt-8">
              <div className="contact-grid">
                <a href={officeMapLink} target="_blank" rel="noreferrer" className="contact-card">
                  <MapPin size={18} /> Primary NCR Office: Tata Gurgaon Gateway, Sector 112-113, Tower B, 303, Gurugram
                </a>
                <a href={registeredOfficeMapLink} target="_blank" rel="noreferrer" className="contact-card">
                  <MapPin size={18} /> Sainik Colony Road, G 16 Extension, Jammu, Jammu & Kashmir
                </a>
                <a href="mailto:info@dataproducts.co.in" className="contact-card">
                  <Mail size={18} /> info@dataproducts.co.in
                </a>
                <a href="tel:+919013333243" className="contact-card">
                  <Phone size={18} /> +91 9013333243
                </a>
                <a href="https://www.dattamsha.co.in" target="_blank" rel="noreferrer" className="contact-card">
                  <Globe size={18} /> dattamsha.co.in
                </a>
                <a
                  href="https://www.linkedin.com/company/dattamsha-data-labs/"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-card"
                >
                  <Linkedin size={18} /> Company LinkedIn
                </a>
                <a
                  href="https://www.linkedin.com/in/dakshsahni92/"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-card"
                >
                  <UsersRound size={18} /> CEO: Daksh Sahni
                </a>
              </div>

              <form className="contact-form" onSubmit={handleContactSubmit}>
                <label className="contact-label">
                  Name
                  <input
                    value={contactName}
                    onChange={(event) => {
                      setContactName(event.target.value);
                      if (contactStatus === 'sent') setContactStatus('idle');
                    }}
                    className="contact-input"
                    placeholder="Your name"
                    required
                  />
                </label>
                <label className="contact-label">
                  Work Email
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(event) => {
                      setContactEmail(event.target.value);
                      if (contactStatus === 'sent') setContactStatus('idle');
                    }}
                    className="contact-input"
                    placeholder="you@company.com"
                    required
                  />
                </label>
                <label className="contact-label">
                  Company
                  <input
                    value={contactCompany}
                    onChange={(event) => {
                      setContactCompany(event.target.value);
                      if (contactStatus === 'sent') setContactStatus('idle');
                    }}
                    className="contact-input"
                    placeholder="Company name"
                  />
                </label>
                <label className="contact-label">
                  Message
                  <textarea
                    value={contactMessage}
                    onChange={(event) => {
                      setContactMessage(event.target.value);
                      if (contactStatus === 'sent') setContactStatus('idle');
                    }}
                    className="contact-textarea"
                    rows={4}
                    placeholder="Tell us your HR analytics or AI challenge..."
                    required
                  />
                </label>
                <button type="submit" className="contact-submit">
                  Send Message <ArrowRight size={16} />
                </button>
                {contactStatus === 'sent' && (
                  <p className="contact-status">Email draft opened. Your message is ready to send.</p>
                )}
              </form>
            </div>
          </div>
        </section>

      </main>

      <footer className="mt-6 border-t border-white/10 px-4 pb-8 pt-6 sm:px-6 lg:px-10">
        <div className="footer-shell mx-auto w-full max-w-[92rem]">
          <div className="footer-top">
            <a href="#overview" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-white/20 bg-white/95 p-1.5">
                <img src="/logo.png" alt="Dattamsha Data Labs logo" className="h-full w-full object-contain" />
              </span>
              <div>
                <p className="font-display text-lg text-white">Dattamsha Data Labs</p>
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Autonomous HR Intelligence</p>
              </div>
            </a>

            <nav className="footer-nav">
              {navLinks.map((item) => (
                <a key={item.href} href={item.href} className="footer-link">
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="footer-meta">
            <a href={officeMapLink} target="_blank" rel="noreferrer" className="footer-badge footer-badge-link">
              <MapPin size={14} /> Primary NCR Office
            </a>
            <a href={registeredOfficeMapLink} target="_blank" rel="noreferrer" className="footer-badge footer-badge-link">
              <MapPin size={14} /> Registered Office
            </a>
            <span className="footer-badge">
              <CalendarDays size={14} /> Founded 2025
            </span>
            <a href="#contact" className="footer-cta">
              Start a conversation <ArrowRight size={14} />
            </a>
          </div>

          <p className="footer-copy">
            © {new Date().getFullYear()} Dattamsha Data Labs. Data-driven HR intelligence for modern enterprises.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

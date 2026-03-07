import { Check, Zap, Shield, Globe, Rocket } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useEffect, useState } from 'react';

export default function WhyDattamsha() {
  const [ref, isVisible] = useScrollAnimation();
  const [counters, setCounters] = useState({ accuracy: 0, insights: 0, reduction: 0, roi: 0 });

  useEffect(() => {
    if (!isVisible) return;

    const targets = { accuracy: 95, insights: 1000, reduction: 40, roi: 300 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setCounters({
        accuracy: Math.min(Math.floor(targets.accuracy * progress), targets.accuracy),
        insights: Math.min(Math.floor(targets.insights * progress), targets.insights),
        reduction: Math.min(Math.floor(targets.reduction * progress), targets.reduction),
        roi: Math.min(Math.floor(targets.roi * progress), targets.roi),
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible]);

  const benefits = [
    {
      icon: Zap,
      title: 'AI-Powered Workforce Insights',
      description: 'Advanced machine learning models predict attrition, identify flight risks, and surface opportunities for talent optimization.',
    },
    {
      icon: Shield,
      title: 'Unified Employee Data Platform',
      description: 'Break down data silos by consolidating information from every HR system into a single, accurate source of truth.',
    },
    {
      icon: Globe,
      title: 'Predictive HR Analytics',
      description: 'Move from reactive to proactive HR management with predictive models that forecast trends before they become problems.',
    },
    {
      icon: Rocket,
      title: 'Enhanced Employee Engagement',
      description: 'Leverage insights to create personalized experiences, improve retention, and build a more engaged workforce.',
    },
  ];

  return (
    <section className="relative py-32 bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-cyan-950/10 to-slate-950" />

      <div
        ref={ref}
        className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Why Choose
            </span>{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Dattamsha
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Transform your HR strategy with the power of unified data and AI intelligence
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Prediction Accuracy', value: counters.accuracy, suffix: '%', color: 'cyan' },
            { label: 'Daily Insights', value: counters.insights, suffix: '+', color: 'teal' },
            { label: 'Time Reduction', value: counters.reduction, suffix: '%', color: 'blue' },
            { label: 'ROI Increase', value: counters.roi, suffix: '%', color: 'purple' },
          ].map((stat, index) => (
            <div
              key={index}
              className={`p-8 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-cyan-500/50 transition-all duration-500 text-center ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={`text-5xl font-bold bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-300 bg-clip-text text-transparent mb-3`}>
                {stat.value}{stat.suffix}
              </div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`group p-8 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-cyan-500/50 transition-all duration-500 hover:scale-[1.02] ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150 + 400}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-slate-400 leading-relaxed mb-4">{benefit.description}</p>
                  <div className="flex items-center gap-2 text-sm text-cyan-400 font-medium">
                    <Check className="w-4 h-4" />
                    Enterprise-ready solution
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-10 rounded-3xl bg-gradient-to-br from-cyan-500/20 via-teal-500/20 to-blue-500/20 border border-cyan-500/30 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your HR Strategy?
            </h3>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Join leading organizations leveraging AI-powered workforce intelligence to make
              smarter decisions, reduce attrition, and build stronger teams.
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

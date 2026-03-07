import { ArrowRight, Database, Cpu, BarChart3, Lightbulb } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Architecture() {
  const [ref, isVisible] = useScrollAnimation();

  const stages = [
    {
      icon: Database,
      title: 'HR Systems',
      items: ['HRIS', 'ATS', 'Performance', 'Engagement'],
      color: 'cyan',
    },
    {
      icon: Cpu,
      title: 'Data Layer',
      items: ['Integration', 'Normalization', 'Storage', 'Pipeline'],
      color: 'teal',
    },
    {
      icon: BarChart3,
      title: 'AI Analytics',
      items: ['ML Models', 'Predictions', 'Insights', 'Patterns'],
      color: 'blue',
    },
    {
      icon: Lightbulb,
      title: 'Business Insights',
      items: ['Dashboards', 'Reports', 'Alerts', 'Actions'],
      color: 'purple',
    },
  ];

  return (
    <section className="relative py-32 bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950" />

      <div
        ref={ref}
        className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Platform
            </span>{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Architecture
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            End-to-end data flow from disparate HR systems to actionable business insights
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stages.map((stage, index) => (
              <div key={index} className="relative">
                <div
                  className={`group p-6 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-${stage.color}-500/50 transition-all duration-500 hover:scale-105 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${stage.color}-500/20 to-${stage.color}-600/20 border border-${stage.color}-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <stage.icon className={`w-7 h-7 text-${stage.color}-400`} />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4">{stage.title}</h3>

                  <div className="space-y-2">
                    {stage.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-sm text-slate-400"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {index < stages.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-20">
                    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                         style={{ transitionDelay: `${index * 200 + 400}ms` }}>
                      <ArrowRight className="w-6 h-6 text-cyan-400 animate-pulse" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <svg
            className="absolute inset-0 pointer-events-none hidden md:block"
            style={{ zIndex: 1 }}
          >
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(6, 182, 212, 0)" />
                <stop offset="50%" stopColor="rgba(6, 182, 212, 0.5)" />
                <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Intelligent Data Pipeline</h4>
              <p className="text-slate-400 leading-relaxed">
                Our architecture ensures seamless data flow with real-time processing, automated quality checks,
                and intelligent routing that adapts to your organization's unique needs. Every stage is
                optimized for speed, accuracy, and scalability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

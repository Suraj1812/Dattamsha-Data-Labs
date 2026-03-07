import { Layers, Zap, CircleUser as UserCircle, Sparkles } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function PlatformSolutions() {
  const [ref, isVisible] = useScrollAnimation();

  const solutions = [
    {
      icon: Layers,
      title: 'Unified Employee Data Fabric',
      description: 'Seamlessly integrate data from HRIS, ATS, performance management, and engagement tools into a cohesive data layer.',
      features: ['Multi-source integration', 'Real-time sync', 'Data normalization', 'Version control'],
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Zap,
      title: 'Always-On Insights Engine',
      description: 'Continuous AI-powered analysis that monitors workforce metrics and surfaces critical insights automatically.',
      features: ['Predictive analytics', 'Anomaly detection', 'Trend forecasting', 'Smart alerts'],
      gradient: 'from-teal-500 to-emerald-500',
    },
    {
      icon: UserCircle,
      title: 'Employee Relationship Management',
      description: 'Comprehensive portal for tracking employee journeys, engagement, and development throughout their lifecycle.',
      features: ['360° employee view', 'Journey mapping', 'Engagement tracking', 'Performance insights'],
      gradient: 'from-blue-500 to-indigo-500',
    },
    {
      icon: Sparkles,
      title: 'AI Nudge Engine',
      description: 'Intelligent recommendations and proactive nudges that guide managers and HR teams toward optimal decisions.',
      features: ['Smart recommendations', 'Action triggers', 'Intervention timing', 'Impact tracking'],
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <section className="relative py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/30 rounded-full filter blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/20 rounded-full filter blur-[120px]" />
      </div>

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
              Solutions
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Four powerful modules working in harmony to revolutionize your HR operations
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className={`group relative p-8 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-cyan-500/50 transition-all duration-500 hover:scale-[1.02] cursor-pointer ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                   style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />

              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${solution.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                <solution.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                {solution.title}
              </h3>

              <p className="text-slate-400 leading-relaxed mb-6">
                {solution.description}
              </p>

              <div className="space-y-2">
                {solution.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-500 group-hover:text-slate-400 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { TrendingUp, Users, AlertCircle, Target } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function DashboardPreview() {
  const [ref, isVisible] = useScrollAnimation();

  const metrics = [
    { label: 'Total Employees', value: '12,847', change: '+5.2%', trend: 'up' },
    { label: 'Attrition Risk', value: '8.3%', change: '-2.1%', trend: 'down' },
    { label: 'Engagement Score', value: '87%', change: '+3.5%', trend: 'up' },
    { label: 'Performance Avg', value: '4.2/5', change: '+0.3', trend: 'up' },
  ];

  return (
    <section className="relative py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-40 left-20 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-[120px]" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-teal-500/10 rounded-full filter blur-[120px]" />
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
              Powerful
            </span>{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Analytics Dashboard
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Real-time workforce insights at your fingertips
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-3xl filter blur-3xl" />

          <div className="relative p-8 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-cyan-500/50 transition-all duration-300 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="text-sm text-slate-400 mb-2">{metric.label}</div>
                  <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
                  <div className={`text-sm flex items-center gap-1 ${
                    metric.trend === 'up' ? 'text-emerald-400' : 'text-cyan-400'
                  }`}>
                    <TrendingUp className="w-4 h-4" />
                    {metric.change}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Attrition Prediction</h3>
                  <Target className="w-5 h-5 text-cyan-400" />
                </div>

                <div className="space-y-4">
                  {[
                    { dept: 'Engineering', risk: 12, color: 'bg-red-500' },
                    { dept: 'Sales', risk: 8, color: 'bg-yellow-500' },
                    { dept: 'Marketing', risk: 5, color: 'bg-emerald-500' },
                    { dept: 'Operations', risk: 3, color: 'bg-cyan-500' },
                  ].map((dept, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">{dept.dept}</span>
                        <span className="text-slate-400">{dept.risk}% at risk</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${dept.color} rounded-full transition-all duration-1000`}
                          style={{
                            width: isVisible ? `${dept.risk * 5}%` : '0%',
                            transitionDelay: `${idx * 100 + 500}ms`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Performance Distribution</h3>
                  <Users className="w-5 h-5 text-cyan-400" />
                </div>

                <div className="space-y-4">
                  {[
                    { rating: 'Exceptional', count: 2847, pct: 22 },
                    { rating: 'High Performer', count: 5123, pct: 40 },
                    { rating: 'Meets Expectations', count: 3891, pct: 30 },
                    { rating: 'Needs Improvement', count: 986, pct: 8 },
                  ].map((perf, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">{perf.rating}</span>
                        <span className="text-slate-400">{perf.count}</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full transition-all duration-1000"
                          style={{
                            width: isVisible ? `${perf.pct}%` : '0%',
                            transitionDelay: `${idx * 100 + 500}ms`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">AI-Powered Insights</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Engineering department shows 15% higher attrition risk this quarter. Recommend
                    implementing retention initiatives and conducting stay interviews with high performers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

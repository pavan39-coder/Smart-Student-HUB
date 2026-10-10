import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import {
  FiActivity,
  FiArrowRight,
  FiAward,
  FiBookOpen,
  FiCheck,
  FiLayers,
  FiStar,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi';

const HomePage = () => {
  const { user } = useAuth();

  if (user) {
    const homePath = user.role === 'admin' ? '/admin' : user.role === 'faculty' ? '/faculty' : '/dashboard';
    return <Navigate to={homePath} replace />;
  }

  const features = [
    {
      icon: FiActivity,
      title: 'Keep track of your activities',
      description: 'Bring your academic, extracurricular, and community achievements together in one organized record.',
      tone: 'bg-blue-50 text-blue-700',
    },
    {
      icon: FiLayers,
      title: 'Showcase your projects',
      description: 'Present the work you are proud of with project details, technology, and links in one place.',
      tone: 'bg-violet-50 text-violet-700',
    },
    {
      icon: FiAward,
      title: 'Build your portfolio',
      description: 'Turn your progress into a portfolio that makes your skills and accomplishments easy to share.',
      tone: 'bg-amber-50 text-amber-700',
    },
    {
      icon: FiTrendingUp,
      title: 'See your progress',
      description: 'Follow activity approvals, points, and rankings as you continue working toward your goals.',
      tone: 'bg-emerald-50 text-emerald-700',
    },
  ];

  const steps = [
    { number: '01', title: 'Create your account', description: 'Get started with a student account in just a few steps.' },
    { number: '02', title: 'Record your work', description: 'Add activities and projects as you achieve and create.' },
    { number: '03', title: 'Share your growth', description: 'Build a clear record of your progress and accomplishments.' },
  ];

  return (
    <div className="overflow-hidden bg-white text-slate-900">
      <section className="relative isolate border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
        <div className="absolute -right-40 -top-48 -z-10 h-[34rem] w-[34rem] rounded-full bg-indigo-100/60 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2 lg:gap-20 lg:px-10">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm">
              <FiStar className="text-amber-500" />
              A smarter way to tell your student story
            </div>
            <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Your progress deserves to be{' '}
              <span className="text-indigo-600">seen.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Keep your activities, projects, and achievements together. Build a meaningful record of what you do—and how far you go.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-200"
              >
                Get started <FiArrowRight />
              </Link>
              <Link
                to="/leaderboard"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100"
              >
                <FiTrendingUp /> Explore the leaderboard
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2"><FiCheck className="text-emerald-600" /> Keep achievements organized</span>
              <span className="inline-flex items-center gap-2"><FiCheck className="text-emerald-600" /> Share your work with confidence</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:ml-auto">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-indigo-100 via-sky-50 to-violet-100 blur-xl" />
            <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-2xl shadow-indigo-200/70 sm:p-9">
              <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border-[32px] border-white/5" />
              <div className="absolute -right-2 top-10 h-20 w-20 rounded-full bg-indigo-500/20 blur-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-200">SMART STUDENT HUB</p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight">Your journey, in one place.</h2>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-200">
                    <FiBookOpen size={23} />
                  </div>
                </div>
                <div className="mt-8 space-y-3">
                  {[
                    { icon: FiActivity, label: 'Activities', detail: 'Capture the moments that matter', color: 'text-sky-300' },
                    { icon: FiLayers, label: 'Projects', detail: 'Put your ideas on display', color: 'text-violet-300' },
                    { icon: FiAward, label: 'Achievements', detail: 'Celebrate every milestone', color: 'text-amber-300' },
                    { icon: FiUsers, label: 'Portfolio', detail: 'Share your story with others', color: 'text-emerald-300' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 ${item.color}`}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <p className="font-semibold">{item.label}</p>
                          <p className="mt-0.5 text-sm text-slate-400">{item.detail}</p>
                        </div>
                        <FiCheck className="ml-auto shrink-0 text-emerald-300" />
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5 text-sm text-slate-300">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-200">
                    <FiStar />
                  </span>
                  Every step forward is worth recording.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">Everything in one hub</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Make your hard work count</h2>
          <p className="mt-4 text-lg leading-7 text-slate-600">
            A simple home for the experiences and work that shape your student journey.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.tone}`}>
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="max-w-lg">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">Simple by design</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">A clearer path from effort to achievement</h2>
              <p className="mt-4 text-lg leading-7 text-slate-600">
                Start with what you have done. Keep adding to your story as you learn, build, and grow.
              </p>
            </div>
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-700">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="relative overflow-hidden rounded-3xl bg-indigo-700 px-6 py-12 text-center shadow-xl shadow-indigo-200 sm:px-12 sm:py-16">
          <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full border-[48px] border-white/5" />
          <div className="absolute -bottom-36 -left-24 h-72 w-72 rounded-full border-[48px] border-white/5" />
          <div className="relative mx-auto max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-200">Your next chapter starts here</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to make your progress visible?</h2>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-indigo-100">
              Start building a thoughtful record of your activities, projects, and achievements.
            </p>
            <Link
              to="/register"
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-indigo-700 transition hover:bg-indigo-50 focus:outline-none focus:ring-4 focus:ring-white/30"
            >
              Create your account <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <span className="font-semibold text-slate-700">SAR System</span>
          <span>Student Activity Record System</span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

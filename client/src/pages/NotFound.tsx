import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] text-slate-900 px-6">
      <div className="max-w-md text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Aura</p>
        <h1 className="mt-4 text-4xl font-semibold font-['Space_Grotesk']">Route not found</h1>
        <p className="mt-3 text-sm text-slate-600">
          The page you are looking for does not exist. Return to the Aura landing page or open the portal.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-2xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700"
          >
            Back to Aura
          </Link>
          <Link
            to="/portal"
            className="rounded-2xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
          >
            Open Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

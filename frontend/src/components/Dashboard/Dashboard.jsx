import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    api
      .get("/auth/me", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((res) => setUser(res.data.user))
      .catch(() => {
        window.location.href = "/login";
      });

    api
      .get("/assets/stats", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((res) => setStats(res.data.stats || []))
      .catch((err) => {
        console.log("Stats error:", err);
      });
  }, []);

  const totalCounts = stats.reduce(
    (acc, item) => ({
      working: acc.working + (Number(item.working) || 0),
      defective: acc.defective + (Number(item.defective) || 0),
      underService: acc.underService + (Number(item.under_service) || 0),
    }),
    { working: 0, defective: 0, underService: 0 }
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Header userName={user?.name} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-5 py-8 flex flex-col gap-8">
        
        {/* HERO SECTION */}
        <section className="rounded-3xl bg-slate-900 px-8 py-10 shadow-lg text-white">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">System Online</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Welcome back, {user?.name || "Asset Manager"}
            </h1>
            <p className="mt-4 text-base lg:text-lg text-slate-400 max-w-2xl leading-relaxed">
              Monitor equipment health, optimize performance, and keep your laboratory ecosystem thriving.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/assets"
              className="rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 transition"
            >
              Browse Assets
            </Link>
            <Link
              to="/services"
              className="rounded-lg border border-slate-700 bg-slate-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition"
            >
              Service Dashboard
            </Link>
          </div>
        </section>

        {/* METRICS */}
        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
               <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Healthy Assets</p>
               <p className="mt-2 text-5xl font-bold text-slate-900">{totalCounts.working}</p>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </span>
              <p className="text-sm text-slate-500">Active and ready for use.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
               <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Defective Units</p>
               <p className="mt-2 text-5xl font-bold text-slate-900">{totalCounts.defective}</p>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </span>
              <p className="text-sm text-slate-500">Immediate repair needed.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
               <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">In Service</p>
               <p className="mt-2 text-5xl font-bold text-slate-900">{totalCounts.underService}</p>
            </div>
             <div className="mt-6 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </span>
              <p className="text-sm text-slate-500">Currently deployed for repair.</p>
            </div>
          </div>
        </section>

        {/* DETAILED CATEGORY GRID */}
        <section className="rounded-3xl border border-slate-200 bg-white p-8 xl:p-10 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Granular Insights</h2>
              <p className="mt-1 text-sm text-slate-500">Operational metrics categorized by hardware type.</p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
            >
              Analyze Records
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {stats.length === 0 ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-2xl border border-slate-100 bg-slate-50 p-6 h-48 animate-pulse">
                </div>
              ))
            ) : (
              stats.map((item, index) => (
                <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition hover:shadow-md">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-6">
                    {item.type_name}
                  </h3>
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                       <div className="flex items-center gap-2">
                         <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                         <span className="text-xs font-semibold text-slate-600">Working</span>
                       </div>
                       <span className="text-sm font-bold text-slate-900">{item.working || 0}</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                       <div className="flex items-center gap-2">
                         <div className="h-1.5 w-1.5 rounded-full bg-rose-500"></div>
                         <span className="text-xs font-semibold text-slate-600">Defective</span>
                       </div>
                       <span className="text-sm font-bold text-slate-900">{item.defective || 0}</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                       <div className="flex items-center gap-2">
                         <div className="h-1.5 w-1.5 rounded-full bg-cyan-500"></div>
                         <span className="text-xs font-semibold text-slate-600">In Service</span>
                       </div>
                       <span className="text-sm font-bold text-slate-900">{item.under_service || 0}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [labFilter, setLabFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const uniqueStatuses = [...new Set(assets.map((a) => a.working_status))];
  const uniqueLabs = [...new Set(assets.map((a) => a.lab_name))];
  const uniqueTypes = [...new Set(assets.map((a) => a.type_name))];

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/assets", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => setAssets(res.data.assets))
      .catch((err) => {
        console.log("Stats error:", err);
      });
  }, []);

  const filteredAssets = assets.filter((a) => {
    const s = search.toLowerCase();

    const matchesSearch =
      (a.asset_name?.toLowerCase() || "").includes(s) ||
      (a.serial_no?.toLowerCase() || "").includes(s) ||
      (a.brand?.toLowerCase() || "").includes(s) ||
      (a.model?.toLowerCase() || "").includes(s) ||
      a.asset_id?.toString().includes(s);

    const matchesStatus = statusFilter ? a.working_status === statusFilter : true;
    const matchesLab = labFilter ? a.lab_name === labFilter : true;
    const matchesType = typeFilter ? a.type_name === typeFilter : true;

    return matchesSearch && matchesStatus && matchesLab && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-7xl px-5 py-8 flex flex-col gap-6">
        
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl bg-slate-900 px-8 py-10 shadow-lg text-white">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Asset Directory</h1>
            <p className="mt-2 text-slate-400 text-sm">
              Manage your laboratory equipment details.
            </p>
          </div>
          <Link
            to="/add"
            className="rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 transition"
          >
            + Add Asset
          </Link>
        </section>

        <section className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <input
            type="text"
            placeholder="Search by brand, model..."
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            {uniqueStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={labFilter}
            onChange={(e) => setLabFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500 cursor-pointer"
          >
            <option value="">All Labs</option>
            {uniqueLabs.map((lab) => (
              <option key={lab} value={lab}>{lab}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500 cursor-pointer"
          >
            <option value="">All Types</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </section>

        <section className="flex flex-col gap-3">
          {filteredAssets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-lg font-medium text-slate-600">No assets found</p>
              <p className="text-sm text-slate-500 mt-1">Try resetting your filters.</p>
            </div>
          ) : (
            filteredAssets.map((item) => (
              <article
                key={item.asset_id}
                onClick={() => navigate(`/assets/${item.asset_id}`)}
                className="group flex cursor-pointer flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">#{item.asset_id}</span>
                    <span className="rounded bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">{item.type_name}</span>
                    <span className="rounded bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">{item.lab_name}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                    {item.brand} • {item.model}
                  </h3>
                  <p className="text-sm text-slate-500">Serial: {item.serial_no}</p>
                </div>

                <div className="flex items-center sm:justify-end">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                      item.working_status.toLowerCase() === 'working' ? 'bg-emerald-100 text-emerald-800' :
                      item.working_status.toLowerCase() === 'defective' ? 'bg-rose-100 text-rose-800' :
                      item.working_status.toLowerCase() === 'under_service' ? 'bg-cyan-100 text-cyan-800' : 
                      'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {item.working_status}
                  </span>
                </div>
              </article>
            ))
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

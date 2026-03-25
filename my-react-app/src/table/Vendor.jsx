import { useState, useMemo } from "react";

const SAMPLE_VENDORS = [
  { id: 1, vendorId: "VND-001", name: "Sharma Traders", address: "12, MG Road", city: "Kanpur", pin: "208001", contactNo: "9876543210", gst: "09AAAAA0000A1Z5" },
  { id: 2, vendorId: "VND-002", name: "Gupta Enterprises", address: "45, Civil Lines", city: "Lucknow", pin: "226001", contactNo: "9123456780", gst: "09BBBBB0000B1Z3" },
  { id: 3, vendorId: "VND-003", name: "Singh & Sons", address: "7, Station Road", city: "Agra", pin: "282001", contactNo: "9988776655", gst: "09CCCCC0000C1Z1" },
];

const emptyForm = { vendorId: "", name: "", address: "", city: "", pin: "", contactNo: "", gst: "" };

export default function VendorTable() {
  const [vendors, setVendors] = useState(SAMPLE_VENDORS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const validate = () => {
    const e = {};
    if (!form.vendorId.trim()) e.vendorId = "Required";
    if (!form.name.trim()) e.name = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!/^\d{6}$/.test(form.pin)) e.pin = "6 digit PIN ";
    if (!/^\d{10}$/.test(form.contactNo)) e.contactNo = "10 digit number ";
    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(form.gst)) e.gst = "Valid GST ";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // TODO: replace with API call
    if (editId !== null) {
      setVendors(p => p.map(v => v.id === editId ? { ...form, id: editId } : v));
      showToast("Vendor update");
    } else {
      setVendors(p => [...p, { ...form, id: Date.now() }]);
      showToast("New vendor add ");
    }
    setForm(emptyForm); setErrors({}); setEditId(null); setShowForm(false); setLoading(false);
  };

  const handleEdit = (vendor) => {
    const { id, ...rest } = vendor;
    setForm(rest); setEditId(id); setErrors({}); setShowForm(true);
    setTimeout(() => document.getElementById("vendor-form")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleDelete = async (id) => {
    await new Promise(r => setTimeout(r, 300)); // TODO: replace with API call
    setVendors(p => p.filter(v => v.id !== id));
    setDeleteConfirm(null);
    showToast("Vendor delete ");
  };

  const handleCancel = () => { setForm(emptyForm); setErrors({}); setEditId(null); setShowForm(false); };

  const filtered = useMemo(() => vendors.filter(v => {
    const q = search.toLowerCase();
    return v.vendorId.toLowerCase().includes(q) || v.name.toLowerCase().includes(q) || v.city.toLowerCase().includes(q) || v.gst.toLowerCase().includes(q);
  }), [vendors, search]);

  const fields = [
    { label: "Vendor ID", name: "vendorId", placeholder: "VND-001", col: 1 },
    { label: "Name", name: "name", placeholder: "Vendor ka naam", col: 1 },
    { label: "Address", name: "address", placeholder: "Full address", col: 2 },
    { label: "City", name: "city", placeholder: "City", col: 1 },
    { label: "PIN Code", name: "pin", placeholder: "6-digit PIN", col: 1, maxLength: 6 },
    { label: "Contact No", name: "contactNo", placeholder: "10-digit number", col: 1, maxLength: 10 },
    { label: "GST Number", name: "gst", placeholder: "09AAAAA0000A1Z5", col: 1 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-mono">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-xl border ${toast.type === "danger" ? "bg-red-950 border-red-700 text-red-300" : "bg-emerald-950 border-emerald-700 text-emerald-300"}`}>
          {toast.msg}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm">
            <div className="w-12 h-12 bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="text-white font-bold text-center text-base mb-1">Vendor Delete ?</h3>
            <p className="text-slate-400 text-sm text-center mb-6">
              <span className="text-amber-400 font-semibold">{deleteConfirm.name}</span>  permanently delete 
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-400 text-sm hover:border-slate-500 transition-all">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all">Haan, Delete Karo</button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Vendor Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">List of all vendor management</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:from-amber-400 hover:to-orange-400 transition-all active:scale-95">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Vendor
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Vendors", value: vendors.length, color: "text-slate-200" },
          { label: "Is Search Mein", value: filtered.length, color: "text-amber-400" },
          { label: "Active States", value: [...new Set(vendors.map(v => v.city))].length, color: "text-emerald-400" },
        ].map(s => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-500 text-xs uppercase tracking-widest">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div id="vendor-form" className="bg-slate-900 border border-slate-700/60 rounded-2xl mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              <h2 className="text-white font-bold text-base">{editId ? "Vendor Edit " : "New Vendor Added"}</h2>
            </div>
            <button onClick={handleCancel} className="text-white/70 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="p-6 grid grid-cols-2 gap-4">
            {fields.map(({ label, name, placeholder, col, maxLength }) => (
              <div key={name} className={col === 2 ? "col-span-2" : "col-span-1"}>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
                  {label}<span className="text-amber-500 ml-0.5">*</span>
                </label>
                <input
                  name={name} value={form[name]} onChange={handleChange}
                  placeholder={placeholder} maxLength={maxLength}
                  className={`w-full bg-slate-800/70 border rounded-lg px-3 py-2.5 text-slate-100 text-sm placeholder:text-slate-600 outline-none transition-all focus:ring-2 ${errors[name] ? "border-red-500/60 focus:ring-red-500/20" : "border-slate-700 focus:border-amber-500/60 focus:ring-amber-500/20"}`}
                />
                {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 px-6 py-4 flex justify-end gap-3">
            <button onClick={handleCancel} className="px-5 py-2 rounded-lg border border-slate-700 text-slate-400 text-sm hover:border-slate-500 transition-all">Cancel</button>
            <button onClick={handleSubmit} disabled={loading}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${loading ? "bg-amber-600/40 text-amber-300/50 cursor-not-allowed" : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 active:scale-95"}`}>
              {loading
                ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</>
                : (editId ? "Update Karo" : "Save Karo")}
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Vendor ID, naam, city ya GST se dhundo..."
          className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-slate-100 text-sm placeholder:text-slate-600 outline-none focus:border-amber-500/60" />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                {["Vendor ID", "Name", "Address", "City", "PIN", "Contact No", "GST Number", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-4 text-slate-400 text-xs font-semibold uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2 text-slate-600">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-sm">Empty vendor</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((v, idx) => (
                <tr key={v.id} className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${idx % 2 !== 0 ? "bg-slate-800/10" : ""}`}>
                  <td className="px-4 py-3.5">
                    <span className="bg-amber-900/30 text-amber-400 border border-amber-700/40 px-2 py-0.5 rounded text-xs font-semibold">{v.vendorId}</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-100 font-medium whitespace-nowrap">{v.name}</td>
                  <td className="px-4 py-3.5 text-slate-400 max-w-[160px] truncate" title={v.address}>{v.address}</td>
                  <td className="px-4 py-3.5 text-slate-300 whitespace-nowrap">{v.city}</td>
                  <td className="px-4 py-3.5 text-slate-400 font-mono">{v.pin}</td>
                  <td className="px-4 py-3.5 text-slate-300 whitespace-nowrap">{v.contactNo}</td>
                  <td className="px-4 py-3.5 text-slate-400 font-mono text-xs">{v.gst}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(v)} title="Edit"
                        className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-amber-400 hover:border-amber-600/50 hover:bg-amber-900/20 transition-all">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => setDeleteConfirm(v)} title="Delete"
                        className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-600/50 hover:bg-red-900/20 transition-all">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-600">
          <span>{filtered.length} of {vendors.length} total vendor</span>
          <span>Backend </span>
        </div>
      </div>
    </div>
  );
}
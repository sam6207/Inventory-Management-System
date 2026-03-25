import { useState, useMemo } from "react";

const SAMPLE_CUSTOMERS = [
  { id: 1, customerId: "CUST-001", name: "Rahul Sharma", address: "23, Vijay Nagar, Kanpur", contactNo: "9876543210" },
  { id: 2, customerId: "CUST-002", name: "Priya Singh", address: "45, Civil Lines, Lucknow", contactNo: "9123456780" },
  { id: 3, customerId: "CUST-003", name: "Amit Gupta", address: "8, Sadar Bazar, Agra", contactNo: "9988776655" },
  { id: 4, customerId: "CUST-004", name: "Neha Verma", address: "12, Hazratganj, Lucknow", contactNo: "9812345670" },
];

const emptyForm = { customerId: "", name: "", address: "", contactNo: "" };

export default function CustomerTable() {
  const [customers, setCustomers] = useState(SAMPLE_CUSTOMERS);
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
    if (!form.customerId.trim()) e.customerId = "Required";
    if (!form.name.trim()) e.name = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!/^\d{10}$/.test(form.contactNo)) e.contactNo = "10 digit number chahiye";
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
    await new Promise(r => setTimeout(r, 600)); // TODO: replace with real API call
    if (editId !== null) {
      setCustomers(p => p.map(c => c.id === editId ? { ...form, id: editId } : c));
      showToast("Customer update ");
    } else {
      setCustomers(p => [...p, { ...form, id: Date.now() }]);
      showToast("New customer add ");
    }
    setForm(emptyForm); setErrors({}); setEditId(null); setShowForm(false); setLoading(false);
  };

  const handleEdit = (customer) => {
    const { id, ...rest } = customer;
    setForm(rest); setEditId(id); setErrors({}); setShowForm(true);
    setTimeout(() => document.getElementById("customer-form")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleDelete = async (id) => {
    await new Promise(r => setTimeout(r, 300)); // TODO: replace with real API call
    setCustomers(p => p.filter(c => c.id !== id));
    setDeleteConfirm(null);
    showToast("Customer delete ho gaya!", "danger");
  };

  const handleCancel = () => {
    setForm(emptyForm); setErrors({}); setEditId(null); setShowForm(false);
  };

  const filtered = useMemo(() => customers.filter(c => {
    const q = search.toLowerCase();
    return (
      c.customerId.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.contactNo.includes(q)
    );
  }), [customers, search]);

  const fields = [
    { label: "Customer ID", name: "customerId", placeholder: "CUST-001", col: 1 },
    { label: "Name",        name: "name",       placeholder: "Customer ka naam", col: 1 },
    { label: "Address",     name: "address",    placeholder: "Full address", col: 2 },
    { label: "Contact No",  name: "contactNo",  placeholder: "10-digit number", col: 1, maxLength: 10 },
  ];

  const initials = (name) => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  const avatarColors = [
    "bg-violet-900/60 text-violet-300 border-violet-700/50",
    "bg-sky-900/60 text-sky-300 border-sky-700/50",
    "bg-emerald-900/60 text-emerald-300 border-emerald-700/50",
    "bg-pink-900/60 text-pink-300 border-pink-700/50",
    "bg-amber-900/60 text-amber-300 border-amber-700/50",
  ];
  const getColor = (id) => avatarColors[id % avatarColors.length];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-mono">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-xl border transition-all ${toast.type === "danger" ? "bg-red-950 border-red-700 text-red-300" : "bg-emerald-950 border-emerald-700 text-emerald-300"}`}>
          {toast.msg}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm">
            <div className="w-12 h-12 bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-center text-base mb-1">Customer Delete </h3>
            <p className="text-slate-400 text-sm text-center mb-6">
              <span className="text-sky-400 font-semibold">{deleteConfirm.name}</span> permanently delete 
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
          <h1 className="text-2xl font-bold text-white tracking-wide">Customer Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">All customers list  management</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:from-sky-400 hover:to-blue-500 transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Customer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-500 text-xs uppercase tracking-widest">Total Customers</p>
          <p className="text-3xl font-bold mt-1 text-slate-200">{customers.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-500 text-xs uppercase tracking-widest">Search Results</p>
          <p className="text-3xl font-bold mt-1 text-sky-400">{filtered.length}</p>
        </div>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div id="customer-form" className="bg-slate-900 border border-slate-700/60 rounded-2xl mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h2 className="text-white font-bold text-base">
                {editId ? "Customer Edit Karo" : "Naya Customer Add Karo"}
              </h2>
            </div>
            <button onClick={handleCancel} className="text-white/70 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 grid grid-cols-2 gap-4">
            {fields.map(({ label, name, placeholder, col, maxLength }) => (
              <div key={name} className={col === 2 ? "col-span-2" : "col-span-1"}>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
                  {label}<span className="text-sky-500 ml-0.5">*</span>
                </label>
                <input
                  name={name} value={form[name]} onChange={handleChange}
                  placeholder={placeholder} maxLength={maxLength}
                  className={`w-full bg-slate-800/70 border rounded-lg px-3 py-2.5 text-slate-100 text-sm placeholder:text-slate-600 outline-none transition-all focus:ring-2 ${errors[name] ? "border-red-500/60 focus:ring-red-500/20" : "border-slate-700 focus:border-sky-500/60 focus:ring-sky-500/20"}`}
                />
                {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 px-6 py-4 flex justify-end gap-3">
            <button onClick={handleCancel} className="px-5 py-2 rounded-lg border border-slate-700 text-slate-400 text-sm hover:border-slate-500 transition-all">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={loading}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${loading ? "bg-sky-600/40 text-sky-300/50 cursor-not-allowed" : "bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-400 hover:to-blue-500 active:scale-95"}`}>
              {loading
                ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</>
                : (editId ? "Update Karo" : "Save Karo")}
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Customer ID, naam ya contact se dhundo..."
          className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-10 py-2.5 text-slate-100 text-sm placeholder:text-slate-600 outline-none focus:border-sky-500/60"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                {["Customer ID", "Name", "Address", "Contact No", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-slate-400 text-xs font-semibold uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2 text-slate-600">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm">Empty customer </span>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((c, idx) => (
                <tr key={c.id} className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${idx % 2 !== 0 ? "bg-slate-800/10" : ""}`}>
                  <td className="px-5 py-3.5">
                    <span className="bg-sky-900/30 text-sky-400 border border-sky-700/40 px-2 py-0.5 rounded text-xs font-semibold">{c.customerId}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0 ${getColor(idx)}`}>
                        {initials(c.name)}
                      </div>
                      <span className="text-slate-100 font-medium whitespace-nowrap">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 max-w-[200px] truncate" title={c.address}>{c.address}</td>
                  <td className="px-5 py-3.5 text-slate-300 whitespace-nowrap">{c.contactNo}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(c)} title="Edit"
                        className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-sky-400 hover:border-sky-600/50 hover:bg-sky-900/20 transition-all">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => setDeleteConfirm(c)} title="Delete"
                        className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-600/50 hover:bg-red-900/20 transition-all">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
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
          <span>{filtered.length} of {customers.length} </span>
          <span>Backend </span>
        </div>
      </div>
    </div>
  );
}
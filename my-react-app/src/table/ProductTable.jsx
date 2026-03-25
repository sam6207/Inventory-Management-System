import { useState, useMemo } from "react";

const CATEGORIES = ["Electronics", "Furniture", "Clothing", "Food & Beverage", "Raw Material", "Stationery", "Other"];

const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Delhi", "Gujarat", "Haryana",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Punjab",
  "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"
];

const SAMPLE_PRODUCTS = [
  { id: 1, productId: "PRD-001", name: "Dell Laptop 15",    price: 65000, quantity: 12, category: "Electronics",    date: "2025-03-20", time: "10:30", aisle: "A", rack: "3", shelf: "2", state: "Uttar Pradesh" },
  { id: 2, productId: "PRD-002", name: "Office Chair Ergo", price: 12000, quantity: 5,  category: "Furniture",      date: "2025-03-21", time: "14:00", aisle: "B", rack: "1", shelf: "1", state: "Uttar Pradesh" },
  { id: 3, productId: "PRD-003", name: "Cotton Shirt Pack", price: 1500,  quantity: 50, category: "Clothing",       date: "2025-03-22", time: "09:15", aisle: "C", rack: "5", shelf: "3", state: "Gujarat" },
  { id: 4, productId: "PRD-004", name: "Steel Rod 10mm",    price: 850,   quantity: 200,category: "Raw Material",   date: "2025-03-23", time: "11:45", aisle: "D", rack: "2", shelf: "4", state: "Maharashtra" },
];

const emptyForm = {
  productId: "", name: "", price: "", quantity: "",
  category: "", date: "", time: "",
  aisle: "", rack: "", shelf: "",
  state: ""
};

const categoryColors = {
  "Electronics":     "bg-violet-900/40 text-violet-300 border-violet-700/50",
  "Furniture":       "bg-amber-900/40 text-amber-300 border-amber-700/50",
  "Clothing":        "bg-pink-900/40 text-pink-300 border-pink-700/50",
  "Food & Beverage": "bg-emerald-900/40 text-emerald-300 border-emerald-700/50",
  "Raw Material":    "bg-orange-900/40 text-orange-300 border-orange-700/50",
  "Stationery":      "bg-sky-900/40 text-sky-300 border-sky-700/50",
  "Other":           "bg-slate-700/60 text-slate-300 border-slate-600/50",
};

export default function ProductTable() {
  const [products, setProducts]             = useState(SAMPLE_PRODUCTS);
  const [showForm, setShowForm]             = useState(false);
  const [form, setForm]                     = useState(emptyForm);
  const [errors, setErrors]                 = useState({});
  const [editId, setEditId]                 = useState(null);
  const [search, setSearch]                 = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterState, setFilterState]       = useState("All");
  const [loading, setLoading]               = useState(false);
  const [toast, setToast]                   = useState(null);
  const [deleteConfirm, setDeleteConfirm]   = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const validate = () => {
    const e = {};
    if (!form.productId.trim())                                        e.productId = "Required";
    if (!form.name.trim())                                             e.name      = "Required";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)  e.price     = "Valid price chahiye";
    if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) < 0) e.quantity = "Valid quantity chahiye";
    if (!form.category)                                                e.category  = "Required";
    if (!form.date)                                                    e.date      = "Required";
    if (!form.time)                                                    e.time      = "Required";
    if (!form.aisle.trim())                                            e.aisle     = "Required";
    if (!form.rack.trim())                                             e.rack      = "Required";
    if (!form.shelf.trim())                                            e.shelf     = "Required";
    if (!form.state)                                                   e.state     = "Required";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  // ─── Backend Integration Points ────────────────────────────────────────────
  // ADD:    POST   /api/products         body: form
  // EDIT:   PUT    /api/products/:id     body: form
  // DELETE: DELETE /api/products/:id
  // ──────────────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // TODO: replace with real API call
    const payload = { ...form, price: Number(form.price), quantity: Number(form.quantity) };
    if (editId !== null) {
      setProducts(p => p.map(x => x.id === editId ? { ...payload, id: editId } : x));
      showToast("Product update ho gaya!");
    } else {
      setProducts(p => [...p, { ...payload, id: Date.now() }]);
      showToast("Naya product add ho gaya!");
    }
    setForm(emptyForm); setErrors({}); setEditId(null); setShowForm(false); setLoading(false);
  };

  const handleEdit = (product) => {
    const { id, ...rest } = product;
    setForm({ ...rest, price: String(rest.price), quantity: String(rest.quantity) });
    setEditId(id); setErrors({}); setShowForm(true);
    setTimeout(() => document.getElementById("product-form")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleDelete = async (id) => {
    await new Promise(r => setTimeout(r, 300)); // TODO: replace with real API call
    setProducts(p => p.filter(x => x.id !== id));
    setDeleteConfirm(null);
    showToast("Product delete ho gaya!", "danger");
  };

  const handleCancel = () => {
    setForm(emptyForm); setErrors({}); setEditId(null); setShowForm(false);
  };

  const filtered = useMemo(() => products.filter(p => {
    const q = search.toLowerCase();
    const locStr = `aisle ${p.aisle} rack ${p.rack} shelf ${p.shelf}`.toLowerCase();
    const matchSearch  = p.productId.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || locStr.includes(q);
    const matchCat     = filterCategory === "All" || p.category === filterCategory;
    const matchState   = filterState    === "All" || p.state    === filterState;
    return matchSearch && matchCat && matchState;
  }), [products, search, filterCategory, filterState]);

  const InputField = ({ label, name, placeholder, type = "text", col = 1, maxLength }) => (
    <div className={col === 2 ? "col-span-2" : "col-span-1"}>
      <label className="block text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
        {label}<span className="text-violet-400 ml-0.5">*</span>
      </label>
      <input type={type} name={name} value={form[name]} onChange={handleChange}
        placeholder={placeholder} maxLength={maxLength}
        className={`w-full bg-slate-800/70 border rounded-lg px-3 py-2.5 text-slate-100 text-sm
          placeholder:text-slate-600 outline-none transition-all focus:ring-2
          ${errors[name] ? "border-red-500/60 focus:ring-red-500/20" : "border-slate-700 focus:border-violet-500/60 focus:ring-violet-500/20"}`}
      />
      {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  const SelectField = ({ label, name, options, col = 1 }) => (
    <div className={col === 2 ? "col-span-2" : "col-span-1"}>
      <label className="block text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
        {label}<span className="text-violet-400 ml-0.5">*</span>
      </label>
      <select name={name} value={form[name]} onChange={handleChange}
        className={`w-full bg-slate-800/70 border rounded-lg px-3 py-2.5 text-slate-100 text-sm
          outline-none transition-all focus:ring-2
          ${errors[name] ? "border-red-500/60 focus:ring-red-500/20" : "border-slate-700 focus:border-violet-500/60 focus:ring-violet-500/20"}`}>
        <option value="">-- Select --</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-mono">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-xl border
          ${toast.type === "danger" ? "bg-red-950 border-red-700 text-red-300" : "bg-emerald-950 border-emerald-700 text-emerald-300"}`}>
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
            <h3 className="text-white font-bold text-center text-base mb-1">Product Delete Karo?</h3>
            <p className="text-slate-400 text-sm text-center mb-6">
              <span className="text-violet-400 font-semibold">{deleteConfirm.name}</span> ko permanently delete kar doge. Yeh wapas nahi aayega.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-400 text-sm hover:border-slate-500 transition-all">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all">Haan, Delete Karo</button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Product Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Saare products ki list aur exact storage location</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:from-violet-400 hover:to-purple-500 transition-all active:scale-95">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Naya Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Products", value: products.length,                                    color: "text-slate-200" },
          { label: "Search Results", value: filtered.length,                                    color: "text-violet-400" },
          { label: "Categories",     value: [...new Set(products.map(p => p.category))].length, color: "text-amber-400" },
          { label: "Total Stock",    value: products.reduce((s, p) => s + p.quantity, 0),       color: "text-emerald-400" },
        ].map(s => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-500 text-xs uppercase tracking-widest">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div id="product-form" className="bg-slate-900 border border-slate-700/60 rounded-2xl mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h2 className="text-white font-bold text-base">{editId ? "Product Edit Karo" : "Naya Product Add Karo"}</h2>
            </div>
            <button onClick={handleCancel} className="text-white/70 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 grid grid-cols-2 gap-4">
            <InputField label="Product ID" name="productId" placeholder="PRD-001" />
            <InputField label="Name"       name="name"      placeholder="Product ka naam" />
            <InputField label="Price (₹)"  name="price"     placeholder="0.00" type="number" />
            <InputField label="Quantity"   name="quantity"  placeholder="0"    type="number" />
            <SelectField label="Category" name="category"  options={CATEGORIES} />
            <SelectField label="State"    name="state"     options={STATES} />
            <InputField label="Date"       name="date"      placeholder="" type="date" />
            <InputField label="Time"       name="time"      placeholder="" type="time" />

            {/* ── Storage Location Section ── */}
            <div className="col-span-2 mt-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-px bg-slate-700" />
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 border border-slate-700 rounded-full">
                  <svg className="w-3.5 h-3.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-violet-400 text-xs font-semibold uppercase tracking-widest">Storage Location</span>
                </div>
                <div className="flex-1 h-px bg-slate-700" />
              </div>

              {/* Live preview */}
              {(form.aisle || form.rack || form.shelf) && (
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-slate-500 text-xs">Preview:</span>
                  <span className="bg-violet-900/40 text-violet-300 border border-violet-700/50 px-3 py-1 rounded-full text-xs font-semibold">
                    Aisle {form.aisle || "?"} › Rack {form.rack || "?"} › Shelf {form.shelf || "?"}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Aisle", name: "aisle", placeholder: "A, B, C ...", prefix: "A›" },
                  { label: "Rack",  name: "rack",  placeholder: "1, 2, 3 ...", prefix: "R›" },
                  { label: "Shelf", name: "shelf", placeholder: "1, 2, 3 ...", prefix: "S›" },
                ].map(loc => (
                  <div key={loc.name}>
                    <label className="block text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
                      {loc.label}<span className="text-violet-400 ml-0.5">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold select-none">{loc.prefix}</span>
                      <input name={loc.name} value={form[loc.name]} onChange={handleChange}
                        placeholder={loc.placeholder}
                        className={`w-full bg-slate-800/70 border rounded-lg pl-8 pr-3 py-2.5 text-slate-100 text-sm
                          placeholder:text-slate-600 outline-none transition-all focus:ring-2 uppercase
                          ${errors[loc.name] ? "border-red-500/60 focus:ring-red-500/20" : "border-slate-700 focus:border-violet-500/60 focus:ring-violet-500/20"}`}
                      />
                    </div>
                    {errors[loc.name] && <p className="text-red-400 text-xs mt-1">{errors[loc.name]}</p>}
                  </div>
                ))}
              </div>
              <p className="text-slate-600 text-xs mt-2">
                Example: Aisle C › Rack 3 › Shelf 2 — shopkeeper seedha wahan jaayega
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 px-6 py-4 flex justify-end gap-3">
            <button onClick={handleCancel}
              className="px-5 py-2 rounded-lg border border-slate-700 text-slate-400 text-sm hover:border-slate-500 transition-all">Cancel</button>
            <button onClick={handleSubmit} disabled={loading}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all
                ${loading ? "bg-violet-600/40 text-violet-300/50 cursor-not-allowed" : "bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-400 hover:to-purple-500 active:scale-95"}`}>
              {loading
                ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</>
                : (editId ? "Update Karo" : "Save Karo")}
            </button>
          </div>
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-52">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Product ID, naam ya Aisle/Rack/Shelf se dhundo..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-10 py-2.5 text-slate-100 text-sm placeholder:text-slate-600 outline-none focus:border-violet-500/60" />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-300 text-sm outline-none focus:border-violet-500/60">
          <option>All</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filterState} onChange={e => setFilterState(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-300 text-sm outline-none focus:border-violet-500/60">
          <option>All</option>
          {STATES.map(s => <option key={s}>{s}</option>)}
        </select>
        {(filterCategory !== "All" || filterState !== "All" || search) && (
          <button onClick={() => { setSearch(""); setFilterCategory("All"); setFilterState("All"); }}
            className="px-4 py-2.5 rounded-lg border border-slate-700 text-slate-400 text-sm hover:border-slate-500 hover:text-slate-300 transition-all whitespace-nowrap">
            Reset
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                {["Product ID", "Name", "Price", "Qty", "Category", "Date", "Time", "Aisle", "Rack", "Shelf", "State", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-4 text-slate-400 text-xs font-semibold uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2 text-slate-600">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span className="text-sm">Koi product nahi mila</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((p, idx) => (
                <tr key={p.id} className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${idx % 2 !== 0 ? "bg-slate-800/10" : ""}`}>
                  <td className="px-4 py-3.5">
                    <span className="bg-violet-900/30 text-violet-300 border border-violet-700/40 px-2 py-0.5 rounded text-xs font-semibold">{p.productId}</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-100 font-medium whitespace-nowrap">{p.name}</td>
                  <td className="px-4 py-3.5 text-emerald-400 font-semibold whitespace-nowrap">₹{p.price.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-slate-200">{p.quantity}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${categoryColors[p.category] || categoryColors["Other"]}`}>
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 whitespace-nowrap">{p.date}</td>
                  <td className="px-4 py-3.5 text-slate-400 whitespace-nowrap">{p.time}</td>

                  {/* Location — 3 separate badges */}
                  <td className="px-4 py-3.5">
                    <span className="bg-indigo-900/40 text-indigo-300 border border-indigo-700/50 px-2.5 py-1 rounded text-xs font-bold">{p.aisle}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="bg-slate-800 border border-slate-700 text-slate-200 px-2.5 py-1 rounded text-xs font-bold">{p.rack}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="bg-slate-800 border border-slate-700 text-slate-200 px-2.5 py-1 rounded text-xs font-bold">{p.shelf}</span>
                  </td>

                  <td className="px-4 py-3.5 text-slate-400 whitespace-nowrap text-xs">{p.state}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(p)} title="Edit"
                        className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-violet-400 hover:border-violet-600/50 hover:bg-violet-900/20 transition-all">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => setDeleteConfirm(p)} title="Delete"
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
        <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-600">
          <span>{filtered.length} of {products.length} products dikh rahe hain</span>
          <span>Backend ready hone par API calls add karo</span>
        </div>
      </div>
    </div>
  );
}

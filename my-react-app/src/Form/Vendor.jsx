import { useState } from "react";

const initialState = {
  vendorId: "",
  name: "",
  address: "",
  city: "",
  pin: "",
  contactNo: "",
  gst: "",
};

export default function VendorForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.vendorId.trim()) newErrors.vendorId = "Vendor ID ";
    if (!form.name.trim()) newErrors.name = "Name ";
    if (!form.address.trim()) newErrors.address = "Address ";
    if (!form.city.trim()) newErrors.city = "City ";
    if (!/^\d{6}$/.test(form.pin)) newErrors.pin = "Valid 6-digit PIN ";
    if (!/^\d{10}$/.test(form.contactNo)) newErrors.contactNo = "Valid 10-digit number ";
    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(form.gst))
      newErrors.gst = "Valid GST number ";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

    const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      
      await new Promise((r) => setTimeout(r, 1000)); 
      console.log("Vendor data to send:", form);
      setSubmitted(true);
      setForm(initialState);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialState);
    setErrors({});
    setSubmitted(false);
  };

  const fields = [
    { label: "Vendor ID", name: "vendorId", placeholder: "VND-001", type: "text" },
    { label: "Name", name: "name", placeholder: "Vendor ka naam", type: "text" },
    { label: "Address", name: "address", placeholder: "Full address", type: "text", full: true },
    { label: "City", name: "city", placeholder: "City", type: "text" },
    { label: "PIN Code", name: "pin", placeholder: "6-digit PIN", type: "text", maxLength: 6 },
    { label: "Contact No", name: "contactNo", placeholder: "10-digit mobile", type: "tel", maxLength: 10 },
    { label: "GST Number", name: "gst", placeholder: "22AAAAA0000A1Z5", type: "text", full: true },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-mono">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Card */}
        <div className="bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">

          {/* Header strip */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-white text-xl font-bold tracking-wide">Vendor Registration</h1>
              <p className="text-amber-100/70 text-xs mt-0.5">Add New Vendor</p>
            </div>
            <div className="ml-auto bg-white/10 rounded-full px-3 py-1 text-white/60 text-xs border border-white/20">
              v1.0
            </div>
          </div>

          {/* Success Banner */}
          {submitted && (
            <div className="mx-6 mt-6 bg-emerald-950/60 border border-emerald-500/40 rounded-xl px-5 py-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-emerald-400 text-sm font-semibold">Vendor successfully </p>
                <p className="text-emerald-600 text-xs mt-0.5">Data </p>
              </div>
              <button onClick={handleReset} className="ml-auto text-emerald-500 hover:text-emerald-300 text-xs underline underline-offset-2 transition-colors">
                 New vendor
              </button>
            </div>
          )}

          {/* Form */}
          <div className="p-8 grid grid-cols-2 gap-5">
            {fields.map(({ label, name, placeholder, type, full, maxLength }) => (
              <div key={name} className={`flex flex-col gap-1.5 ${full ? "col-span-2" : "col-span-1"}`}>
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">
                  {label}
                  <span className="text-amber-500 ml-0.5">*</span>
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  maxLength={maxLength}
                  className={`
                    bg-slate-800/70 border rounded-lg px-4 py-3 text-slate-100 text-sm
                    placeholder:text-slate-600 outline-none transition-all duration-200
                    focus:bg-slate-800 focus:ring-2 focus:ring-amber-500/40
                    ${errors[name]
                      ? "border-red-500/60 focus:border-red-400 focus:ring-red-500/20"
                      : "border-slate-700 focus:border-amber-500/60"
                    }
                  `}
                />
                {errors[name] && (
                  <p className="text-red-400 text-xs flex items-center gap-1 mt-0.5">
                    <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors[name]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-8 border-t border-slate-800" />

          {/* Footer Buttons */}
          <div className="px-8 py-6 flex items-center justify-between gap-4">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-lg border border-slate-700 text-slate-400 text-sm hover:border-slate-500 hover:text-slate-300 transition-all duration-200"
            >
              Reset
            </button>

            <div className="flex items-center gap-3">
              <span className="text-slate-600 text-xs">* Required fields</span>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`
                  flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                  ${loading
                    ? "bg-amber-600/40 text-amber-300/50 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 hover:shadow-lg hover:shadow-amber-500/25 active:scale-95"
                  }
                `}
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Save 
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save Vendor
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Backend note */}
        <p className="text-center text-slate-600 text-xs mt-4">
          💡 Backend ready hone par <code className="text-amber-600">handleSubmit</code> mein API call add karo
        </p>
      </div>
    </div>
  );
}
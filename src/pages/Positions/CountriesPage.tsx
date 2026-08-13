import { useCountry } from "./useCountry"; 
import { Globe, Save, X, Edit2, Trash2, Power } from "lucide-react";
import { motion } from "framer-motion";

const CountriesPage = () => {
  const {
    formik,
    countries,
    loading,
    fetching,
    editId,
    handleEdit,
    handleCancelEdit,
    handleDelete,
    handleToggleStatus,
  } = useCountry();

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto pb-20">
      
      <div className="flex items-center gap-3 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="p-3 bg-emerald-50 text-[#10b981] rounded-2xl"><Globe className="w-6 h-6" /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-700 tracking-wider font-mono">Manage Countries</h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Add, edit or disable operating countries</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── FORM SECTION (Left) ── */}
        <div className="lg:col-span-1">
          <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#10b981] rounded-l-3xl" />
            
            <h2 className="text-lg font-bold text-gray-700 mb-6">{editId ? "Edit Country" : "Add New Country"}</h2>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2 block mb-1">Country Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Malta"
                  {...formik.getFieldProps("name")}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#10b981]/40 rounded-xl outline-none font-bold text-gray-800 transition-all focus:bg-white"
                />
                {formik.touched.name && formik.errors.name && <p className="text-red-500 text-xs mt-1 pl-2">{formik.errors.name}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2 block mb-1">Country Code</label>
                <input
                  type="text"
                  placeholder="e.g. MT"
                  {...formik.getFieldProps("code")}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#10b981]/40 rounded-xl outline-none font-bold text-gray-800 transition-all focus:bg-white uppercase"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-[#10b981] text-white rounded-xl font-bold hover:bg-emerald-600 disabled:opacity-70 transition-all"
                >
                  <Save className="w-4 h-4" /> {loading ? "Saving..." : editId ? "Update" : "Save"}
                </button>
                {editId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* ── LIST/TABLE SECTION (Right) ── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-700">Existing Countries</h2>
              <span className="text-xs font-black text-[#10b981] bg-emerald-50 px-3 py-1 rounded-full">{countries.length} Total</span>
            </div>

            {fetching ? (
              <div className="p-8 text-center text-gray-400 font-bold">Loading...</div>
            ) : countries.length === 0 ? (
              <div className="p-8 text-center text-gray-400 font-bold">No countries found.</div>
            ) : (
              <div className="max-h-125 overflow-y-auto custom-scrollbar p-2">
                {countries.map((country) => (
                  <div key={country._id} className={`flex items-center justify-between p-4 mb-2 rounded-2xl border transition-all ${country.isActive ? "bg-white border-gray-100 hover:border-emerald-200 hover:shadow-md" : "bg-gray-50 border-gray-200 opacity-70"}`}>
                    
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${country.isActive ? "bg-emerald-50 text-[#10b981]" : "bg-gray-200 text-gray-500"}`}>
                        {country.code || country.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-700 text-lg">{country.name}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase">{country.isActive ? "Active" : "Inactive"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(country._id, country.isActive)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          country.isActive ? "bg-emerald-500" : "bg-gray-300"
                        }`}
                        title={country.isActive ? "Deactivate Country" : "Activate Country"}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            country.isActive ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                      <button onClick={() => handleEdit(country)} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(country._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default CountriesPage;
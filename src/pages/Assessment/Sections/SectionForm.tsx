import { ArrowLeft } from "lucide-react";
import { useSectionForm } from "./useSectionForm";
import LoadingSpinner from "../../../components/UI/loadingSpinner/LoadingSpinner";

const SectionForm = () => {
  const { formik, parentSections, isLoading, isFetching, navigate } =
    useSectionForm();
  const isMaxScoreRequired = formik.values.underSection === "";

  if (isFetching) {
    return (
      <div className="w-full flex items-center justify-center py-40">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-xl hover:bg-gray-50 text-gray-600 shadow-sm border border-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-normal tracking-wide text-gray-700">
          Create New Section
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <form
          onSubmit={formik.handleSubmit}
          noValidate
          className="p-6 sm:p-8 flex flex-col gap-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SECTION NAME FIELD */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-gray-500">
                Section Name *
              </label>
              <input
                type="text"
                name="section"
                placeholder="e.g. LANGUAGE"
                value={formik.values.section}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl font-medium transition-all outline-none focus:border-blue-500 ${formik.touched.section && formik.errors.section ? "border-red-500 bg-red-50/30 focus:border-red-500" : "border-gray-200"}`}
              />

              {formik.touched.section && formik.errors.section ? (
                <div className="text-red-500 text-xs font-semibold mt-0.5 ml-1">
                  {String(formik.errors.section)}
                </div>
              ) : null}
            </div>

            {/* SHORT NAME FIELD */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-gray-500">
                Short Name *
              </label>
              <input
                type="text"
                name="shortName"
                placeholder="e.g. lang_main"
                value={formik.values.shortName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl font-medium transition-all outline-none focus:border-blue-500 ${formik.touched.shortName && formik.errors.shortName ? "border-red-500 bg-red-50/30 focus:border-red-500" : "border-gray-200"}`}
              />
              
              {formik.touched.shortName && formik.errors.shortName ? (
                <div className="text-red-500 text-xs font-semibold mt-0.5 ml-1">
                  {String(formik.errors.shortName)}
                </div>
              ) : null}
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* UNDER SECTION (PARENT) DROPDOWN */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-gray-500">
                Under Section
              </label>
              <select
                name="underSection"
                value={formik.values.underSection}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl font-medium text-gray-700 outline-none focus:border-blue-500 transition-all"
              >
                <option value="">-- None (Make this a Main Section) --</option>
                {parentSections.map((parent) => (
                  <option key={parent._id} value={parent._id}>
                    {parent.section}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-gray-400 ml-1">
                Leave as "None" if this is a main category.
              </p>
            </div>

            {/* MAX SCORE FIELD */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-gray-500">
                Max Score{" "}
                {isMaxScoreRequired && <span className="text-red-500">*</span>}
              </label>
              <input
                type="number"
                name="maxScore"
                placeholder="e.g. 90"
                value={formik.values.maxScore}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min="0"
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e" || e.key === "E") {
                    e.preventDefault();
                  }
                }}
                disabled={!!formik.values.underSection}
                className={`w-full px-4 py-3 border rounded-xl font-semibold transition-all outline-none 
    ${formik.values.underSection ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-50/50 text-gray-700"} 
    ${formik.touched.maxScore && formik.errors.maxScore ? "border-red-500 bg-red-50/30" : "border-gray-200 focus:border-blue-500"}`}
              />

              {formik.touched.maxScore && formik.errors.maxScore ? (
                <div className="text-red-500 text-xs font-semibold mt-0.5 ml-1">
                  {String(formik.errors.maxScore)}
                </div>
              ) : (
                <p className="text-[11px] text-gray-400 ml-1">
                  Mandatory for Main Sections. Must be less than 100.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-[#0D80F2] text-white font-semibold rounded-xl hover:bg-blue-600 shadow-sm transition-colors disabled:opacity-70"
            >
              {isLoading ? "Saving..." : "Save Section"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SectionForm;

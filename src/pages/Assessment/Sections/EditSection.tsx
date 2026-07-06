import { ArrowLeft } from "lucide-react";
import { useEditSection } from "./useEditSection";
import LoadingSpinner from "../../../components/UI/loadingSpinner/LoadingSpinner";

const EditSection = () => {
  const { formik, parentSections, isLoading, isFetching, navigate } =
    useEditSection();
  const isMaxScoreRequired = formik.values.underSection === "";

  if (isFetching) {
    return (
      <div className="w-full flex items-center justify-center py-40">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-xl hover:bg-gray-50 text-gray-600 shadow-2xl"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-medium text-gray-600">Edit Section</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <form
          onSubmit={formik.handleSubmit}
          noValidate
          className="p-6 sm:p-8 flex flex-col gap-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase text-gray-500">
                Section Name *
              </label>
              <input
                type="text"
                name="section"
                value={formik.values.section}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 bg-gray-100 shadow-inner rounded-xl font-medium ${formik.touched.section && formik.errors.section ? "border border-red-500" : ""}`}
              />

              {formik.touched.section && formik.errors.section ? (
                <div className="text-red-500 text-xs mt-1 font-medium">
                  {String(formik.errors.section)}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-gray-500">
                Short Name *
              </label>
              <input
                type="text"
                name="shortName"
                value={formik.values.shortName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 bg-gray-100 shadow-inner rounded-xl font-medium ${formik.touched.shortName && formik.errors.shortName ? "border border-red-500" : ""}`}
              />
              {formik.touched.shortName && formik.errors.shortName ? (
                <div className="text-red-500 text-xs mt-1 font-medium">
                  {String(formik.errors.shortName)}
                </div>
              ) : null}
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* UNDER SECTION FIELD */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-gray-500">
                Under Section
              </label>
              <select
                name="underSection"
                value={formik.values.underSection}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 bg-gray-100 shadow-inner rounded-xl font-medium text-gray-700"
              >
                <option value="">-- None (Make this a Main Section) --</option>
                {parentSections.map((parent) => (
                  <option key={parent._id} value={parent._id}>
                    {parent.section}
                  </option>
                ))}
              </select>
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
                <div className="text-red-500 text-xs mt-1 font-medium">
                  {String(formik.errors.maxScore)}
                </div>
              ) : (
                <p className="text-[10px] text-gray-400">
                  Max score must be less than 100 (e.g., 99).
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-[#0D80F2] text-white font-bold rounded-xl hover:bg-blue-600 shadow-md disabled:opacity-70"
            >
              {isLoading ? "Updating..." : "Update Section"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSection;

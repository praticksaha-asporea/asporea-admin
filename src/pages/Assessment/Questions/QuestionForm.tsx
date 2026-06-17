 
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useQuestionForm } from './useQuestionForm';
import LoadingSpinner from '../../../components/UI/loadingSpinner/LoadingSpinner';

 
const SECTION_OPTIONS = [
  { key: "ACADEMIC", label: "ACADEMIC QUALIFICATION" },
  { key: "PROFESSIONAL", label: "PROFESSIONAL QUALIFICATION" },
  { key: "LANGUAGE", label: "LANGUAGE ABILITIES (2ND & 3RD LANGUAGES)" },
  { key: "GENERAL", label: "GENERAL ABILITIES" },
  { key: "WORK_EXP", label: "WORK EXPERIENCE (RELEVANT TO ACADEMIC/PROFESSIONAL QUALIFICATION)" },
  { key: "ABROAD_EXP", label: "ABROAD WORK EXPERIENCE (RELEVENCE TO ACAMEDIC/PROFESSIONAL QUALIFICATION)" },
  { key: "STABILITY", label: "STABILITY " },
  { key: "CAREER_INIT", label: "CAREER INITIATIVE  (EACH EMPLOYMENT MUST BE MORE THAN 12 MONTHS PERIOD)" },
  { key: "AGE", label: "AGE" },
  { key: "LICENSE", label: "EXISTING PROFESSIONAL LICENSE" },
  { key: "ADAPTABILITY", label: "ADAPTABILITY" }
];

const QuestionForm = () => {
  const { isEdit, formData, isLoading, isFetching, handleChange, handleLevelChange, addLevel, removeLevel, handleSubmit, navigate } = useQuestionForm();

  return (
   <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button type="button" onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{isEdit ? 'Edit Question / Criteria' : 'Create New Question / Criteria'}</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-100">
        
       
        {isFetching ? (
        <div className="w-full flex items-center justify-center min-h-100 px-4 text-center mx-auto clear-both">
    <div className="flex flex-col items-center justify-center w-full">
      <LoadingSpinner />
    </div>
  </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 flex flex-col gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-gray-500">Section Dropdown *</label>
                <select name="section" value={formData.section} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0D80F2] font-medium text-gray-700" required>
                  <option value="">-- Select Predefined Section --</option>
                   {SECTION_OPTIONS.map((opt) => (
                    <option key={opt.key} value={opt.key}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-gray-500">Sub Section (For Languages)</label>
                <input type="text" name="subSection" value={formData.subSection} onChange={handleChange} placeholder="e.g. 2nd Language (English)" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0D80F2]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-gray-500">Title / Question *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Post Graduate Degree" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0D80F2] font-medium" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-gray-500">Short Name (Key)</label>
                <input type="text" name="shortName" value={formData.shortName} onChange={handleChange} placeholder="e.g. listening_eng" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0D80F2]" />
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-gray-500">Type</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0D80F2]">
                  <option value="rating">Rating (Options/Levels)</option>
                  <option value="boolean">Boolean (Yes/No)</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-gray-500">Marks</label>
                <input type="number" name="marks" value={formData.marks} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0D80F2] font-semibold text-gray-700" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-purple-600">Question Order (Sorting)</label>
                <input type="number" name="order" value={formData.order} onChange={handleChange} placeholder="e.g. 1" className="w-full px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-bold" />
                <p className="text-[10px] text-gray-400">Determines position inside the section.</p>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex flex-col gap-4">
              <div>
                <label className="text-sm font-bold text-gray-800">Levels (For Language / Tiers)</label>
                <p className="text-xs text-gray-400 mt-0.5">Leave blank if this is a standard option.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {formData.levels.map((level, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white p-1 border border-gray-200 rounded-lg shadow-sm">
                    <input type="text" value={level} onChange={(e) => handleLevelChange(index, e.target.value)} placeholder={`Level ${index + 1}`} className="flex-1 px-3 py-1.5 focus:outline-none text-sm font-medium" />
                    <button type="button" onClick={() => removeLevel(index)} className="p-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addLevel} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#0D80F2] bg-blue-50 rounded-lg w-max mt-2">
                <Plus className="w-4 h-4" /> Add Level Array
              </button>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button type="submit" disabled={isLoading} className="px-8 py-3 bg-[#0D80F2] text-white font-bold rounded-xl hover:bg-blue-600 shadow-md disabled:opacity-70 disabled:cursor-not-allowed">
                {isLoading ? 'Saving...' : 'Save Data'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default QuestionForm;
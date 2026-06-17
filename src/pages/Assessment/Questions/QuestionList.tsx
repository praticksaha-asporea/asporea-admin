import React from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Plus, Eye, EyeOff, RotateCcw } from "lucide-react";
import { useQuestionList } from "./useQuestionList";
import LoadingSpinner from '../../../components/UI/loadingSpinner/LoadingSpinner';

const SECTION_MAP: Record<string, string> = {
  "ACADEMIC": "ACADEMIC QUALIFICATION",
  "PROFESSIONAL": "PROFESSIONAL QUALIFICATION",
  "LANGUAGE": "LANGUAGE ABILITIES (2ND & 3RD LANGUAGES)",
  "GENERAL": "GENERAL ABILITIES",
  "WORK_EXP": "WORK EXPERIENCE (RELEVANT TO ACADEMIC/PROFESSIONAL QUALIFICATION)",
  "ABROAD_EXP": "ABROAD WORK EXPERIENCE (RELEVENCE TO ACAMEDIC/PROFESSIONAL QUALIFICATION)",
  "STABILITY": "STABILITY",
  "CAREER_INIT": "CAREER INITIATIVE (EACH EMPLOYMENT MUST BE MORE THAN 12 MONTHS PERIOD)",
  "AGE": "AGE",
  "LICENSE": "EXISTING PROFESSIONAL LICENSE",
  "ADAPTABILITY": "ADAPTABILITY"
};

const SECTION_ORDER = [
  "ACADEMIC",
  "PROFESSIONAL",
  "LANGUAGE",
  "GENERAL",
  "WORK_EXP",
  "ABROAD_EXP",
  "STABILITY",
  "CAREER_INIT",
  "AGE",
  "LICENSE",
  "ADAPTABILITY"
];

const QuestionList = () => {
  const {
    groupedQuestions,
    isLoading,
    showDeleted,
    setShowDeleted,
    handleDelete,
    handleRestore,
  } = useQuestionList();

  const dynamicSections = SECTION_ORDER.filter(section => 
    Object.prototype.hasOwnProperty.call(groupedQuestions, section)
  );

  
  const extraSections = Object.keys(groupedQuestions).filter(sec => !SECTION_ORDER.includes(sec));
  const finalSections = [...dynamicSections, ...extraSections];

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-normal tracking-wide text-gray-700">
            Assessment Form Options
          </h1>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
       
          <button
            onClick={() => setShowDeleted(!showDeleted)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[16px] font-semibold transition-all border ${
              showDeleted
                ? "bg-red-600 text-white border-orange-200 shadow-inner"
                : "bg-[#0D80F2] text-white border-gray-200 hover:bg-blue-500  shadow-sm"
            }`}
          >
            {showDeleted ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
            {showDeleted ? "Hide Trash " : "Show Trash "}
          </button>

          <Link
            to="/questions/add"
            className="bg-[#0D80F2] text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium shadow-sm"
          >
            <Plus className="w-5 h-5" /> Add New Option
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-10">
        <div className="flex justify-between px-6 py-4 bg-gray-50 text-[11px] font-bold text-gray-600 uppercase border-b border-gray-200">
          <div className="flex gap-4 w-full">
            <span className="w-8">S.N</span>
            <span className="flex-1">Factor / Criteria</span>
          </div>
          <div className="flex gap-10 min-w-50 justify-end">
            <span className="w-16 text-center">Score</span>
            <span className="w-20 text-right">Actions</span>
          </div>
        </div>

        {isLoading ? (
    <div className="w-full flex items-center justify-center py-28 px-4 text-center mx-auto clear-both">
    <div className="flex flex-col items-center justify-center w-full">
      <LoadingSpinner />
    </div>
  </div>
        ) : finalSections.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center justify-center">
            <div className={`p-4 rounded-full mb-3 ${showDeleted ? 'bg-[#0D80F2] text-white shadow-2xl' : 'bg-blue-50 text-blue-400'}`}>
              {showDeleted ? <EyeOff className="w-8 h-8" /> : <Plus className="w-8 h-8" />}
            </div>
          <p className="text-gray-600 font-medium tracking-wider text-lg mb-1">
              {showDeleted ? "Trash is Empty" : "No Form Data Exists"}
            </p>
            
          </div>
        ) : (
          <div className="flex flex-col">
            {finalSections.map((sectionName, index) => {
              const subSections = groupedQuestions[sectionName];

              return (
                <React.Fragment key={sectionName}>
                 
                  <div className="flex justify-between px-6 py-3  bg-[#0D80F2] border-t border-gray-200">
                    <div className="flex gap-4 w-full items-center">
                      <span className="w-8 font-bold text-white">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-[17px] uppercase font-semibold text-white">
                        {SECTION_MAP[sectionName] || sectionName}
                      </span>
                    </div>
                     
                  </div>

                 
                  {Object.entries(subSections).map(([subSecName, items]) => (
                    <div key={subSecName}>
                      {subSecName !== "DEFAULT_OPTIONS" && (
                        <div className="px-6 py-2 bg-gray-50 border-b border-gray-200">
                          <span className="pl-12 text-[10px] font-bold text-orange-500 uppercase tracking-wider">
                            {subSecName}
                          </span>
                        </div>
                      )}

                      {items.map((q) => (
                        <div
                          key={q._id}
                          className={`flex justify-between items-center px-6 py-2.5 border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${
                            q.isDeleted
                              ? "bg-red-50/40 text-gray-400 opacity-75 line-through decoration-red-300"
                              : ""
                          }`}
                        >
                          <div className="flex gap-4 w-full items-center pl-12">
                            <span className="text-[14.5px] text-gray-500 font-medium flex items-center gap-3">
                              {q.title}

                              {q.isDeleted && (
                                <span className="text-[9px] px-1.5 py-0.5 font-bold uppercase rounded-md bg-red-100 text-red-600 tracking-wide no-underline inline-block">
                                  Deleted
                                </span>
                              )}
                            </span>
                          </div>

                          <div className="flex gap-10 min-w-50 justify-end items-center">
                            <div className="w-40 flex justify-end gap-1">
                              {q.levels && q.levels.length > 0 ? (
                                q.levels.map((lvl, i) => (
                                  <span
                                    key={i}
                                    className="text-[10px] px-2 py-0.5 border border-gray-200 rounded text-gray-500 bg-white shadow-sm"
                                  >
                                    {lvl}
                                  </span>
                                ))
                              ) : (
                                <span className="font-bold text-[14px] -translate-x-10  text-gray-500">
                                  {q.marks}
                                </span>
                              )}
                            </div>
                           
                            <div className="w-20 flex justify-end gap-2">
                              {!q.isDeleted ? (
                                <>
                                  <Link
                                    to={`/questions/edit/${q._id}`}
                                    className="text-gray-400 hover:text-[#0D80F2]"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Link>
                                  <button
                                    onClick={() => handleDelete(q._id)}
                                    className="text-gray-400 hover:text-red-500"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                             
                                <button
                                  onClick={() => handleRestore(q._id)}
                                  className="text-orange-400 hover:text-orange-600 flex items-center gap-1 bg-orange-50 hover:bg-orange-100 px-2 py-1 rounded-md text-[11px] font-bold transition-colors shadow-sm"
                                  title="Restore Item"
                                >
                                  <RotateCcw className="w-3 h-3" /> Restore
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionList;

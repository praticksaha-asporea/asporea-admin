import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Edit3 } from "lucide-react";
import { useSectionList } from "./useSectionList";
import LoadingSpinner from "../../../components/UI/loadingSpinner/LoadingSpinner";

const SectionList = () => {
  const { sections, isLoading, handleDelete, getParentName } = useSectionList();
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-normal tracking-wide text-gray-700">
            Assessment Sections
          </h1>
        </div>

        <div className="flex items-center w-full sm:w-auto justify-end">
          <Link
            to="/assessment-sections/add"
            className="bg-[#0D80F2] text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium shadow-sm"
          >
            <Plus className="w-5 h-5" /> Add New Section
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-2xl overflow-hidden mb-10">
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 text-[11px] font-bold text-gray-600 uppercase border-b border-gray-200">
          <div className="flex gap-4 flex-1 items-center">
            <span className="w-12">S.N</span>
            <span className="flex-1">Section Name</span>
            <span className="w-64">Under</span>
            <span className="w-36">Short Name</span>
          </div>
          <div className="flex gap-6 items-center justify-end w-48">
            <span className="w-20 text-center">Max Score</span>
            <span className="w-20 text-right">Actions</span>
          </div>
        </div>

        {isLoading ? (
          <div className="w-full flex items-center justify-center py-28 px-4 text-center mx-auto clear-both">
            <div className="flex flex-col items-center justify-center w-full">
              <LoadingSpinner />
            </div>
          </div>
        ) : sections.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center justify-center">
            <div className="p-4 rounded-full mb-3 bg-blue-50 text-blue-400">
              <Plus className="w-8 h-8" />
            </div>
            <p className="text-gray-600 font-medium tracking-wider text-lg mb-1">
              No Sections Created Yet
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {sections.map((section, index) => (
              <div
                key={section._id}
                className="flex justify-between items-center px-6 py-4 border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
              >
                {/* Left Side Data */}
                <div className="flex gap-4 flex-1 items-center">
                  <span className="w-12 text-sm font-bold text-gray-500">
                    {index + 1}
                  </span>
                  <span className="flex-1 min-w-0 pr-4 text-[14.5px] font-semibold text-gray-700 wrap-break-word whitespace-normal leading-tight">
                    {section.section}
                  </span>
                  <span className="w-64 text-[13px] font-medium text-gray-500 wrap-break-word pr-2">
                    {getParentName(section.underSection) || "----"}
                  </span>
                  <div className="w-36">
                    <span className="text-[13px] font-medium text-blue-500 bg-blue-50 px-2 py-1 rounded inline-block max-w-full truncate">
                      {section.shortName}
                    </span>
                  </div>
                </div>

                {/* Right Side Data */}
                <div className="flex gap-6 items-center justify-end w-48">
                  <div className="w-20 text-center">
                    {section.maxScore ? (
                      <span className="font-bold text-[14px] text-gray-700">
                        {section.maxScore}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </div>

                  <div className="w-20 flex justify-end items-center gap-2">
                    <button
                      onClick={() =>
                        navigate(`/assessment-sections/edit/${section._id}`)
                      }
                      className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                      title="Edit Section"
                    >
                      <Edit3 className="w-4.5 h-4.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(section._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Delete Section"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionList;

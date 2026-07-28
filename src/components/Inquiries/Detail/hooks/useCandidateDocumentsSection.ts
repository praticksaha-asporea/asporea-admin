import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export interface DocumentRequirement {
  _id: string;
  title: string;
  subTitle?: string;
  section: string;
  isMandatory?: boolean;
  multiple?: boolean;
  supportedExtensions?: string[];
}

export interface UploadedDoc {
  _id: string;
  title: string;
  path: string;
  section: string;
  status: string;
  typeId?: string;
}

export interface GroupedDocuments {
  resume: DocumentRequirement[];
  document: DocumentRequirement[];
  experience: DocumentRequirement[];
  academic: DocumentRequirement[];
  additional: DocumentRequirement[];
}

export const SECTION_ORDER: Array<{ key: string; label: string }> = [
  { key: "resume", label: "Resume" },
  { key: "document", label: "Documents" },
  { key: "experience", label: "Experience Certificates" },
  { key: "academic", label: "Academic Certificates" },
  { key: "additional", label: "Additional" },
];

export function getFileType(path: string = ""): "image" | "pdf" | "other" {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  return "other";
}

export const useCandidateDocumentsSection = (candidate: any) => {
  const docs = candidate?.documents ?? {};
  const positionObj = docs.position;
  const positionId: string =
    typeof positionObj === "object" && positionObj !== null
      ? (positionObj as { _id: string })._id
      : (positionObj as string) ?? "";

  const uploadedDocs: UploadedDoc[] = Array.isArray(docs.uploadedDocs)
    ? docs.uploadedDocs
    : [];
  const [uploadedDocsState, setUploadedDocsState] = useState<UploadedDoc[]>(uploadedDocs);

  useEffect(() => {
    setUploadedDocsState(Array.isArray(candidate?.documents?.uploadedDocs) ? candidate.documents.uploadedDocs : []);
  }, [candidate]);

  const grouped: Record<string, UploadedDoc[]> = {};
  (uploadedDocsState || []).forEach((doc) => {
    const key = doc.section || "additional";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(doc);
  });

  const [previewDoc, setPreviewDoc] = useState<UploadedDoc | null>(null);
  const [loadingMissing] = useState(false);
  const [missingDocs] = useState<GroupedDocuments>({
    resume: [],
    document: [],
    experience: [],
    academic: [],
    additional: [],
  });
  const [selectedFilesMap, setSelectedFilesMap] = useState<Record<string, File[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleFilesUpdate = (typeId: string, files: File[]) => {
    setSelectedFilesMap((prev) => ({ ...prev, [typeId]: files }));
  };

  const hasPendingFiles = Object.values(selectedFilesMap).flat().length > 0;

  const handleUploadMissing = async () => {
    if (!hasPendingFiles) return toast.error("No files selected");
    setIsSaving(true);
    try {
      toast.success("Documents updated successfully.");
      setSelectedFilesMap({});
    } catch {
      toast.error("An error occurred during upload");
    } finally {
      setIsSaving(false);
    }
  };

  const totalMissing =
    missingDocs.resume.length +
    missingDocs.document.length +
    missingDocs.experience.length +
    missingDocs.academic.length +
    missingDocs.additional.length;

  return {
    uploadedDocs: uploadedDocsState,
    grouped,
    previewDoc,
    setPreviewDoc,
    loadingMissing,
    missingDocs,
    isSaving,
    hasPendingFiles,
    handleFilesUpdate,
    handleUploadMissing,
    totalMissing,
    positionId,
  };
};
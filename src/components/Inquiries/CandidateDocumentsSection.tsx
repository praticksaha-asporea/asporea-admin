import React from "react";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  FileText,
  File as FileIcon,
  FolderOpen,
  Download,
  X,
} from "lucide-react";
import { CamelCase } from "../../utils/common";
import {
  useCandidateDocumentsSection,
  SECTION_ORDER,
  getFileType,
  type UploadedDoc,
} from "./Detail/hooks/useCandidateDocumentsSection";

 
const resolveFileSrc = (path?: string | null) => {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }
  const BACKEND_BASE =
    import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:3000";
  return `${BACKEND_BASE}${path.startsWith("/") ? path : `/${path}`}`;
};

const UploadedFileCard: React.FC<{
  doc: UploadedDoc;
  onPreview: (doc: UploadedDoc) => void;
}> = ({ doc, onPreview }) => {
  const fullPath = resolveFileSrc(doc.path);
  const fileType = getFileType(doc.path);

  return (
    <Card
      variant="outlined"
      className="rounded-[14px] p-3 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-all duration-200"
      onClick={() => onPreview({ ...doc, path: fullPath })}
    >
      <Box className="w-full h-28 rounded-lg overflow-hidden flex items-center justify-center bg-slate-100">
        {fileType === "image" ? (
          <img
            src={fullPath} // 🚀 Full URL apply kar diya
            alt={doc.title}
            className="object-contain w-full h-full"
            onError={(e: any) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <Box className="flex flex-col items-center gap-1">
            {fileType === "pdf" ? (
              <FileText size={36} className="text-blue-600" />
            ) : (
              <FileIcon size={36} className="text-gray-500" />
            )}
            <Typography className="text-[10px] text-gray-500 font-semibold uppercase">
              {doc.path.split(".").pop()}
            </Typography>
          </Box>
        )}
      </Box>
      <Box className="flex items-center justify-between gap-1">
        <Typography className="text-[12px] font-bold text-gray-800 leading-tight line-clamp-2 flex-1">
          {doc.title}
        </Typography>
        {doc.status !== "uploaded" && (
          <Box
            className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
              doc.status === "verified"
                ? "bg-green-100 text-green-700"
                : doc.status === "rejected"
                ? "bg-red-100 text-red-600"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {CamelCase(doc.status)}
          </Box>
        )}
      </Box>
      <Typography className="text-[11px] text-blue-600 font-semibold text-center">
        Click to preview
      </Typography>
    </Card>
  );
};

interface CandidateDocumentsSectionProps {
  candidate: any;
}

const CandidateDocumentsSection: React.FC<CandidateDocumentsSectionProps> = ({
  candidate,
}) => {
  const { uploadedDocs, grouped, previewDoc, setPreviewDoc } =
    useCandidateDocumentsSection(candidate);

  const fullPreviewPath = resolveFileSrc(previewDoc?.path);

  return (
    <Box className="mt-4">
      <Typography variant="h6" className="font-bold mb-3 text-gray-800">
        Uploaded Documents
      </Typography>

      {uploadedDocs.length === 0 ? (
        <Box className="py-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <FolderOpen size={36} className="text-gray-400 mx-auto mb-2" />
          <Typography variant="body2" className="italic text-gray-500">
            No documents uploaded yet
          </Typography>
        </Box>
      ) : (
        SECTION_ORDER.filter(({ key }) => grouped[key]?.length > 0).map(
          ({ key, label }) => (
            <Box key={key} className="mb-4">
              <Typography
                variant="subtitle2"
                className="font-bold text-gray-700 mb-2"
              >
                {label}
              </Typography>
              <Grid container spacing={2}>
                {grouped[key].map((doc) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={doc._id}>
                    <UploadedFileCard doc={doc} onPreview={setPreviewDoc} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )
        )
      )}

      {/* Preview Modal */}
      <Dialog
        open={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: { className: "rounded-[20px] relative overflow-hidden" },
        }}
      >
        <DialogContent className="p-0">
          <Box className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
            <Box>
              <Typography variant="subtitle1" className="font-bold leading-tight">
                {previewDoc?.title}
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                {CamelCase(previewDoc?.section ?? "")} &bull;{" "}
                <span
                  className={
                    previewDoc?.status === "verified"
                      ? "text-green-600 font-semibold"
                      : previewDoc?.status === "rejected"
                      ? "text-red-500 font-semibold"
                      : "text-blue-600 font-semibold"
                  }
                >
                  {CamelCase(previewDoc?.status ?? "")}
                </span>
              </Typography>
            </Box>
            <Box className="flex items-center gap-2">
              <a
                href={fullPreviewPath || "#"} // 🚀 Full URL download
                download
                target="_blank"
                rel="noreferrer"
              >
                <IconButton size="small" title="Download">
                  <Download size={20} />
                </IconButton>
              </a>
              <IconButton size="small" onClick={() => setPreviewDoc(null)}>
                <X size={20} />
              </IconButton>
            </Box>
          </Box>
          <Box className="flex items-center justify-center bg-gray-100 min-h-[60vh]">
            {previewDoc && getFileType(previewDoc.path) === "image" && (
              <img
                src={fullPreviewPath} // 🚀 Full URL image render
                alt={previewDoc.title}
                className="max-w-full max-h-[75vh] object-contain p-4"
              />
            )}
            {previewDoc && getFileType(previewDoc.path) === "pdf" && (
              <iframe
                src={fullPreviewPath} // 🚀 Full URL pdf iframe
                title={previewDoc.title}
                className="w-full min-h-[75vh] border-0"
              />
            )}
            {previewDoc && getFileType(previewDoc.path) === "other" && (
              <Box className="flex flex-col items-center gap-4 p-10">
                <FileIcon size={48} className="text-gray-400" />
                <Typography variant="body1" className="text-gray-500">
                  Preview not available for this file type.
                </Typography>
                <a
                  href={fullPreviewPath}
                  download
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button
                    variant="contained"
                    className="rounded-xl! normal-case!"
                  >
                    Download File
                  </Button>
                </a>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CandidateDocumentsSection;
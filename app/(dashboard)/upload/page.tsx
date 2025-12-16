"use client";

import { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from "lucide-react";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!validTypes.includes(file.type)) {
      setErrorMessage("Please upload a CSV or Excel file (.csv, .xls, .xlsx)");
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setErrorMessage("File size must be less than 10MB");
      return false;
    }

    return true;
  };

  const processFile = async (file: File) => {
    try {
      const text = await file.text();
      // For now, just store in localStorage
      localStorage.setItem("roomcompanion_schedule", text);
      localStorage.setItem("roomcompanion_schedule_filename", file.name);
      localStorage.setItem(
        "roomcompanion_schedule_uploaded",
        new Date().toISOString(),
      );

      setUploadStatus("success");
      setTimeout(() => setUploadStatus("idle"), 3000);
    } catch (error) {
      setErrorMessage("Failed to process file. Please try again.");
      setUploadStatus("error");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadStatus("idle");
    setErrorMessage("");

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
      processFile(droppedFile);
    } else {
      setUploadStatus("error");
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadStatus("idle");
    setErrorMessage("");

    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      processFile(selectedFile);
    } else {
      setUploadStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Upload Appointment Schedule
          </h2>
          <p className="text-slate-600 text-lg">
            Import your patient appointment data to begin managing room
            assignments
          </p>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300
            ${
              isDragging
                ? "border-blue-500 bg-blue-50/50 scale-[1.02]"
                : uploadStatus === "success"
                ? "border-green-400 bg-green-50/30"
                : uploadStatus === "error"
                ? "border-red-400 bg-red-50/30"
                : "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/50"
            }
          `}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".csv,.xls,.xlsx"
            onChange={handleFileInput}
          />

          <div className="flex flex-col items-center justify-center text-center space-y-4">
            {/* Icon */}
            <div
              className={`
              w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300
              ${
                uploadStatus === "success"
                  ? "bg-green-100"
                  : uploadStatus === "error"
                  ? "bg-red-100"
                  : "bg-blue-100"
              }
            `}
            >
              {uploadStatus === "success" ? (
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              ) : uploadStatus === "error" ? (
                <AlertCircle className="w-10 h-10 text-red-600" />
              ) : (
                <Upload className="w-10 h-10 text-blue-600" />
              )}
            </div>

            {/* Status Messages */}
            {uploadStatus === "success" && file ? (
              <div className="space-y-2">
                <p className="text-lg font-semibold text-green-900">
                  Upload Successful!
                </p>
                <p className="text-sm text-green-700">
                  {file.name} has been imported
                </p>
              </div>
            ) : uploadStatus === "error" ? (
              <div className="space-y-2">
                <p className="text-lg font-semibold text-red-900">
                  Upload Failed
                </p>
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-semibold text-slate-900">
                  Drop your schedule file here
                </p>
                <p className="text-sm text-slate-600">
                  or click to browse your files
                </p>
              </div>
            )}

            {/* Upload Button */}
            <label
              htmlFor="file-upload"
              className="cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Choose File
            </label>

            {/* File Info */}
            {file && uploadStatus !== "error" && (
              <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-slate-100 rounded-lg">
                <FileText className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-700">{file.name}</span>
                <span className="text-xs text-slate-500">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* File Requirements */}
        <div className="mt-8 p-6 bg-white rounded-xl border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">
            File Requirements
          </h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Supported formats: CSV, Excel (.xlsx, .xls)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Maximum file size: 10MB</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                Required columns: Patient Name, Doctor Name, Appointment Time,
                Duration
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Optional columns: Room Number, Procedure Type, Notes</span>
            </li>
          </ul>
        </div>

        {/* Sample Format */}
        <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
          <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">
            Sample File Format
          </h3>
          <div className="bg-white rounded-lg p-4 font-mono text-xs overflow-x-auto border border-slate-200">
            <div className="text-slate-600">
              <div className="font-semibold mb-2">
                Patient Name, Doctor Name, Appointment Time, Duration, Room
                Number
              </div>
              <div>John Smith, Dr. Johnson, 2024-01-15 09:00, 30, Room 101</div>
              <div>Jane Doe, Dr. Williams, 2024-01-15 09:30, 45, Room 102</div>
              <div>Bob Wilson, Dr. Johnson, 2024-01-15 10:00, 30, Room 101</div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        {uploadStatus === "success" && (
          <div className="mt-8 p-6 bg-white rounded-xl border border-slate-200 animate-fadeIn">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">
              Next Steps
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors duration-200">
                View Calendar
              </button>
              <button className="flex-1 px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-lg font-medium transition-colors duration-200">
                Manage Rooms
              </button>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

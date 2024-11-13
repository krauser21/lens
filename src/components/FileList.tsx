import React from 'react';
import { FileUpload } from './FileUpload';
import { Trash2 } from 'lucide-react';
import type { ExcelFile } from '../types';

interface FileListProps {
  files: ExcelFile[];
  selectedFileId: string | null;
  onSelectFile: (fileId: string) => void;
  onDeleteFile: (fileId: string) => void;
  onUploadFile: (file: File) => void;
}

export function FileList({
  files,
  selectedFileId,
  onSelectFile,
  onDeleteFile,
  onUploadFile,
}: FileListProps) {
  if (files.length === 0) {
    return <FileUpload onUpload={onUploadFile} />;
  }

  return (
    <div className="flex items-center gap-4">
      <FileUpload onUpload={onUploadFile} />
      {selectedFileId && (
        <button
          onClick={() => onDeleteFile(selectedFileId)}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
          Veriyi Sil
        </button>
      )}
    </div>
  );
}
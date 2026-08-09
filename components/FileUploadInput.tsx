import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, Clock } from './Icons';
import apiService from '../services/apiService';
import { errorMessage } from '../utils/errorMessage';

interface FileUploadInputProps {
    label: string;
    fileUrl?: string;
    isVerified?: boolean;
    onFileChange: (fileUrl: string) => void;
    documentType?: 'cv'|'certification'|'insurance'|'identity'|'capability-evidence';
}

export const FileUploadInput = ({ label, fileUrl, isVerified, onFileChange, documentType='capability-evidence' }: FileUploadInputProps) => {
    const [fileName, setFileName] = useState<string | null>(fileUrl ? 'document.pdf' : null);
    const [error,setError]=useState('');const[uploading,setUploading]=useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setError('');
            setUploading(true);
            try {
                const saved = await apiService.uploadDocument(file, documentType);
                setFileName(saved.originalName);
                onFileChange(saved.fileUrl);
            } catch (error: unknown) {
                setError(errorMessage(error, 'Document upload failed.'));
            } finally {
                setUploading(false);
            }
        }
    };

    const status = isVerified 
        ? { icon: CheckCircle, text: 'Verified', color: 'text-green-600' }
        : { icon: Clock, text: 'Pending Verification', color: 'text-yellow-600' };

    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            {!fileName ? (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-md hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                    <Upload size={16} className="mr-2" />
                    {uploading?'Uploading…':'Select file to upload'}
                </button>
            ) : (
                <div className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium text-gray-700 truncate">{fileName}</span>
                    <div className="flex items-center gap-2">
                        <div className={`flex items-center text-xs font-semibold ${status.color}`}>
                            <status.icon size={14} className="mr-1" />
                            {status.text}
                        </div>
                        <button type="button" onClick={() => inputRef.current?.click()} className="text-xs text-blue-600 hover:underline">Change</button>
                    </div>
                </div>
            )}
            <input
                ref={inputRef}
                type="file"
                className="sr-only"
                onChange={handleFileSelect}
                accept="application/pdf,image/jpeg,image/png"
                disabled={uploading}
            />
            {error&&<p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
        </div>
    );
};

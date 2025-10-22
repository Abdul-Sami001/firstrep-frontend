// lib/utils/fileUpload.ts - File Upload Utilities
export interface FileValidationResult {
    isValid: boolean;
    error?: string;
}

export interface FileUploadConfig {
    maxImageSize: number; // in bytes
    maxVideoSize: number; // in bytes
    allowedImageTypes: string[];
    allowedVideoTypes: string[];
}

const DEFAULT_CONFIG: FileUploadConfig = {
    maxImageSize: 5 * 1024 * 1024, // 5MB
    maxVideoSize: 50 * 1024 * 1024, // 50MB
    allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    allowedVideoTypes: ['video/mp4', 'video/webm'],
};

export class FileUploadValidator {
    private config: FileUploadConfig;

    constructor(config: Partial<FileUploadConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    validateFile(file: File): FileValidationResult {
        // Check file type
        const isValidImage = this.config.allowedImageTypes.includes(file.type);
        const isValidVideo = this.config.allowedVideoTypes.includes(file.type);

        if (!isValidImage && !isValidVideo) {
            return {
                isValid: false,
                error: `File type ${file.type} is not supported. Allowed types: ${[
                    ...this.config.allowedImageTypes,
                    ...this.config.allowedVideoTypes
                ].join(', ')}`
            };
        }

        // Check file size
        const isImage = isValidImage;
        const maxSize = isImage ? this.config.maxImageSize : this.config.maxVideoSize;
        const maxSizeMB = Math.round(maxSize / (1024 * 1024));

        if (file.size > maxSize) {
            return {
                isValid: false,
                error: `File size ${Math.round(file.size / (1024 * 1024))}MB exceeds maximum allowed size of ${maxSizeMB}MB`
            };
        }

        return { isValid: true };
    }

    validateFiles(files: File[]): FileValidationResult {
        if (files.length === 0) {
            return { isValid: true };
        }

        for (const file of files) {
            const result = this.validateFile(file);
            if (!result.isValid) {
                return result;
            }
        }

        return { isValid: true };
    }

    getFileType(file: File): 'image' | 'video' | 'unknown' {
        if (this.config.allowedImageTypes.includes(file.type)) {
            return 'image';
        }
        if (this.config.allowedVideoTypes.includes(file.type)) {
            return 'video';
        }
        return 'unknown';
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Utility functions
export const createPreviewUrl = (file: File): string => {
    return URL.createObjectURL(file);
};

export const revokePreviewUrl = (url: string): void => {
    URL.revokeObjectURL(url);
};

export const compressImage = async (
    file: File, 
    maxWidth: number = 1920, 
    quality: number = 0.8
): Promise<File> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Calculate new dimensions
            let { width, height } = img;
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            // Draw and compress
            ctx?.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const compressedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    } else {
                        reject(new Error('Failed to compress image'));
                    }
                },
                file.type,
                quality
            );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = createPreviewUrl(file);
    });
};

export const generateThumbnail = async (
    file: File, 
    size: number = 200
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const video = document.createElement('video');

        if (file.type.startsWith('image/')) {
            const img = new Image();
            img.onload = () => {
                canvas.width = size;
                canvas.height = size;
                ctx?.drawImage(img, 0, 0, size, size);
                resolve(canvas.toDataURL());
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = createPreviewUrl(file);
        } else if (file.type.startsWith('video/')) {
            video.onloadedmetadata = () => {
                canvas.width = size;
                canvas.height = size;
                video.currentTime = 1; // Seek to 1 second
            };
            video.onseeked = () => {
                ctx?.drawImage(video, 0, 0, size, size);
                resolve(canvas.toDataURL());
            };
            video.onerror = () => reject(new Error('Failed to load video'));
            video.src = createPreviewUrl(file);
        } else {
            reject(new Error('Unsupported file type for thumbnail generation'));
        }
    });
};

export const createFormData = (data: Record<string, any>, files?: File[]): FormData => {
    const formData = new FormData();
    
    // Add regular data
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
    });
    
    // Add files
    if (files && files.length > 0) {
        files.forEach((file, index) => {
            formData.append(`media_${index}`, file);
        });
    }
    
    return formData;
};

// Default validator instance
export const fileValidator = new FileUploadValidator();

import { getPresignedUrl } from './adminApi';
import imageCompression from 'browser-image-compression';

/**
 * Upload file to presigned URL
 */
export const pushFileToS3 = async (signedUrl: string, file: Blob): Promise<Response> => {
  const myHeaders = new Headers({
    "Content-Type": file.type,
    "Access-Control-Allow-Origin": "*",
  });
  return fetch(signedUrl, {
    method: "PUT",
    headers: myHeaders,
    body: file,
  });
};

/**
 * Upload file to S3 using presigned URL
 */
export const uploadFileOnS3 = async (
  file: Blob,
  filePath: string,
): Promise<string | undefined> => {
  const body = {
    filePath: filePath,
    fileFormat: file.type as string,
  };

  let signedUrl;
  const presignedUrl = await getPresignedUrl(body.filePath, body.fileFormat);
  console.log("presignedUrl", presignedUrl);
  if (presignedUrl && presignedUrl.data) {
    const response = await pushFileToS3(presignedUrl.data as string, file);
    if (response?.url) {
      signedUrl = response?.url.split("?")?.[0];
    }
  }
  return signedUrl;
};

/**
 * Upload image with compression
 */
export const uploadImageFile = async (userId: string, file: File): Promise<string> => {
  const timestamp = new Date().getTime();
  const fileExtension = file.name.split('.').pop() || 'jpg';
  const filePath = `admin-assets/${timestamp}-${userId}.${fileExtension}`;
  
  // Compress image
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  
  try {
    const compressedImage = await imageCompression(file, options);
    const fileUrl = await uploadFileOnS3(compressedImage, filePath) as string;
    return fileUrl;
  } catch (error) {
    console.warn('Image compression failed, uploading original:', error);
    // Fallback to original file if compression fails
    const fileUrl = await uploadFileOnS3(file, filePath) as string;
    return fileUrl;
  }
};

/**
 * Handle file selection and upload
 */
export const handleImageUpload = async (
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select an image file');
  }

  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    throw new Error('Image size must be less than 5MB');
  }

  onProgress?.(10);
  
  try {
    onProgress?.(50);
    const imageUrl = await uploadImageFile(userId, file);
    onProgress?.(100);
    return imageUrl;
  } catch (error) {
    throw new Error('Failed to upload image. Please try again.');
  }
};

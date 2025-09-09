// src/services/storage-service.ts
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const BUCKET_NAME = 'residue-photos';

/**
 * Convierte un Data URL (base64) a un objeto File.
 * @param dataUrl El Data URL a convertir.
 * @param filename El nombre del archivo a crear.
 * @returns Un objeto File.
 */
function dataURLtoFile(dataUrl: string, filename: string): File | null {
  const arr = dataUrl.split(',');
  if (arr.length < 2) {
    return null;
  }
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch || mimeMatch.length < 2) {
    return null;
  }
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}


/**
 * Sube una imagen de residuo a Supabase Storage.
 * @param companyId El ID de la empresa para organizar los archivos.
 * @param photoDataUrl La imagen en formato Data URL.
 * @returns La URL pública de la imagen subida.
 */
export const uploadResidueImage = async (companyId: string, photoDataUrl: string): Promise<string> => {
    const fileExtension = photoDataUrl.substring(photoDataUrl.indexOf('/') + 1, photoDataUrl.indexOf(';base64'));
    const filePath = `${companyId}/${Date.now()}.${fileExtension}`;
    
    const file = dataURLtoFile(photoDataUrl, filePath);
    if (!file) {
        throw new Error("No se pudo convertir el Data URL a un archivo.");
    }

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);

    if (uploadError) {
        console.error("Error subiendo la imagen:", uploadError);
        throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(uploadData.path);

    return publicUrl;
};

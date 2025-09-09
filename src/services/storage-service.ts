// src/services/storage-service.ts
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const BUCKET_NAME = 'residue-photos';

/**
 * Sube una imagen para un residuo específico a Supabase Storage.
 * La ruta del archivo será: {companyId}/{residueId}.{extension}
 * @param residueId El ID del residuo al que pertenece la imagen.
 * @param companyId El ID de la empresa propietaria.
 * @param file El objeto File de la imagen a subir.
 * @returns La URL pública de la imagen subida.
 */
export const uploadResidueImage = async (residueId: string, companyId: string, file: File): Promise<string> => {
    // Extraer la extensión del nombre del archivo original
    const fileExtension = file.name.split('.').pop();
    if (!fileExtension) {
        throw new Error("El archivo no tiene una extensión válida.");
    }
    
    // Crear un nombre de archivo consistente usando el ID del residuo
    const fileName = `${residueId}.${fileExtension}`;
    const filePath = `${companyId}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
            upsert: true, // Permite sobreescribir si ya existe
            contentType: file.type,
        });

    if (uploadError) {
        console.error("Error subiendo la imagen a Supabase:", uploadError);
        throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);
        
    // Añadir un timestamp a la URL para forzar la actualización de la caché del navegador
    return `${publicUrl}?t=${new Date().getTime()}`;
};

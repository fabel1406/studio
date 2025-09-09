
// src/app/dashboard/residues/create/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const BUCKET_NAME = 'residue-photos';

// Validar que el archivo no sea mayor a 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024; 
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const residueFormSchema = z.object({
  residueId: z.string().optional(),
  type: z.string().min(1, { message: "Debes seleccionar o especificar un tipo." }),
  customType: z.string().optional(),
  category: z.enum(['BIOMASS', 'FOOD', 'AGRO', 'OTHERS']),
  quantity: z.coerce.number().min(0),
  unit: z.enum(['KG', 'TON']),
  pricePerUnit: z.preprocess(
    (val) => (val === "" || val === null || val === undefined) ? null : Number(val),
    z.coerce.number().optional().nullable()
  ),
  status: z.enum(['ACTIVE', 'RESERVED', 'CLOSED']),
  description: z.string().optional(),
  photoFile: z
    .instanceof(File)
    .optional()
    .refine(file => !file || file.size === 0 || file.size <= MAX_FILE_SIZE, `El tamaño máximo es de 5MB.`)
    .refine(file => !file || file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type), "Solo se aceptan archivos .jpg, .jpeg, .png y .webp."),
}).refine(data => {
    if (data.type === 'Otro' && (!data.customType || data.customType.length < 2)) {
        return false;
    }
    return true;
}, {
    message: "Por favor, especifica un tipo con al menos 2 caracteres.",
    path: ["customType"],
});


export async function createOrUpdateResidueAction(formData: FormData) {
    const supabase = createClient();
    
    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { error: 'No estás autenticado.' };
        }
        
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('id')
          .eq('auth_id', user.id)
          .single();

        if (companyError || !companyData) {
          console.error("Company fetch error:", companyError)
          return { error: 'No se pudo encontrar una empresa asociada a tu usuario. Completa tu perfil en los ajustes.' };
        }
        const companyId = companyData.id;

        const rawData = {
            residueId: formData.get('residueId') || undefined,
            type: formData.get('type'),
            customType: formData.get('customType') || undefined,
            category: formData.get('category'),
            quantity: formData.get('quantity'),
            unit: formData.get('unit'),
            pricePerUnit: formData.get('pricePerUnit'),
            status: formData.get('status'),
            description: formData.get('description') || undefined,
            photoFile: formData.get('photoFile') as File | null,
        };
        
        const validatedFields = residueFormSchema.safeParse(rawData);
        
        if (!validatedFields.success) {
            console.error('Validation Error:', validatedFields.error.flatten().fieldErrors);
            return {
                error: "Datos del formulario inválidos.",
                fieldErrors: validatedFields.error.flatten().fieldErrors,
            };
        }
        
        const { data } = validatedFields;
        
        const residueDbData = {
            company_id: companyId,
            type: data.type === 'Otro' ? data.customType! : data.type,
            category: data.category,
            quantity: data.quantity,
            unit: data.unit,
            price_per_unit: data.pricePerUnit,
            status: data.status,
            description: data.description,
            availability_date: new Date().toISOString(),
        };

        let residueId = data.residueId;
        
        if (residueId) {
            const { error } = await supabase
                .from('residues')
                .update(residueDbData)
                .eq('id', residueId);
            if (error) {
              console.error("DB Update Error:", error);
              throw error;
            }
        } else {
            const { data: createdData, error } = await supabase
                .from('residues')
                .insert(residueDbData)
                .select('id')
                .single();

            if (error) {
                console.error("DB Insert Error:", error);
                throw error;
            }
            residueId = createdData.id;
        }

        if (data.photoFile && data.photoFile.size > 0 && residueId) {
            const fileExtension = data.photoFile.name.split('.').pop();
            const fileName = `${residueId}.${fileExtension}`;
            const filePath = `${companyId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(filePath, data.photoFile, {
                    upsert: true,
                    contentType: data.photoFile.type,
                });

            if (uploadError) {
                console.error('Upload Error:', uploadError);
                throw uploadError;
            }
            
            const { data: { publicUrl } } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(filePath);

            const { error: updatePhotoError } = await supabase
                .from('residues')
                .update({ photos: [`${publicUrl}?t=${new Date().getTime()}`] })
                .eq('id', residueId);
            
            if (updatePhotoError) {
                console.error('Update Photo URL Error:', updatePhotoError);
            }
        }
        
        revalidatePath('/dashboard/residues');
        return { success: true, residueId: residueId };

    } catch (e: any) {
        console.error('Server Action Error:', e);
        return { error: `Error al guardar el residuo: ${e.message}` };
    }
}

export async function deleteResidueAction(residueId: string) {
    const supabase = createClient();
    try {
        const { error } = await supabase
            .from('residues')
            .delete()
            .eq('id', residueId);

        if (error) {
            throw error;
        }
        revalidatePath('/dashboard/residues');
        return { success: true };
    } catch (e: any) {
        console.error('Server Action Error deleting residue:', e);
        return { error: `Error al eliminar el residuo: ${e.message}` };
    }
}

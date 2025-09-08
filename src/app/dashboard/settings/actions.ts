
'use server'

import { createClient } from '@/lib/supabase/server'
import { updateCompany } from '@/services/company-service'
import { type ProfileFormValues } from './page'

export async function updateCompanyAction(
  companyId: string,
  values: ProfileFormValues
) {
  const supabase = createClient()

  try {
    // 1. Update the public companies table
    await updateCompany(supabase, companyId, {
      name: values.companyName,
      type: values.role,
      description: values.description,
      country: values.country,
      city: values.city,
      address: values.address,
      contactEmail: values.contactEmail,
      phone: values.phone,
      website: values.website,
    })

    // 2. Update user metadata in Supabase Auth (for consistency and quick access)
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        company_name: values.companyName,
        app_role: values.role,
        description: values.description,
        country: values.country,
        city: values.city,
        address: values.address,
        contactEmail: values.contactEmail,
        phone: values.phone,
        website: values.website,
      },
    })

    if (authError) throw authError

    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

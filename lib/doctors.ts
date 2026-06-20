import { supabase } from './supabase'

export async function getDoctor(slug: string) {
  // The backend guide uses a single-row doctor_profile table. Keep the old slug-based
  // interface for the existing pages, but resolve the single doctor profile from DB.
  const { data, error } = await supabase
    .from('doctor_profile')
    .select('*')
    .eq('doctor_id', doctorId)
    .single()

  if (error || !data) return null

  return {
    id: 1,
    slug,
    doctor_profile: data,
  }
}
// load from env doctor id 
const doctorId = process.env.NEXT_PUBLIC_DOCTOR_ID

export async function getDoctorById(id: string | number) {
  const numericId = Number(id)
  if (!Number.isFinite(numericId) || numericId <= 0) return null

  const { data, error } = await supabase
    .from('doctor_profile')
    .select('*')
    .eq('doctor_id', doctorId)
    .single()

  if (error || !data) return null

  return {
    id: 1,
    slug: 'doctor',
    doctor_profile: data,
  }
}

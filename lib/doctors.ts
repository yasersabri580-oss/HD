import { supabase } from './supabase'

// Resolved from env at module load time; used by both query functions below.
const doctorId = process.env.NEXT_PUBLIC_DOCTOR_ID

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

export async function getDoctorById(_id: string | number) {
  // The profile table is keyed by the env-var UUID (doctorId), not by the caller's id.
  // The numeric guard that was here previously rejected UUID strings (Number(uuid) = NaN),
  // silently returning null on article pages. It is removed.
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

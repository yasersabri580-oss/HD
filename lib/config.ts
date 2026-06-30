/**
 * Central site configuration.
 *
 * Set NEXT_PUBLIC_SITE_URL in your hosting environment (e.g. Vercel project
 * settings) once you have a production domain.  Until then the placeholder
 * below is used so the build never crashes.
 *
 * Examples:
 *   NEXT_PUBLIC_SITE_URL=https://drmohibullah.com
 */
export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '') ||
  'https://yourdomain.com'

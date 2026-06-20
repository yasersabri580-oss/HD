'use client'

import Link from 'next/link'
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedInIcon,
  YoutubeIcon,
  WhatsAppIcon,
  TelegramIcon,
} from '../components/icons'
import { useLocale } from '../components/language-provider'
import { LanguageSwitch } from '../components/language-switch'
import { siteMeta } from '../lib/site-meta'

// ---- Types ----
interface QuickLink {
  href: string
  label_fa?: string
  label_en?: string
  label_ps?: string
}

interface SocialLink {
  label: string
  href: string
  iconName: string
}

interface FooterProps {
  site?: any               // for brand / subline (optional)
  footerCopy?: string
  footerCopy_en?: string
  footerCopy_ps?: string
  quickLinks?: QuickLink[] // if not provided, falls back to siteMeta.quickLinks
  socialLinks?: SocialLink[]
}

// ---- Icon resolver ----
const socialIconMap: Record<string, React.ReactNode> = {
  facebook: <FacebookIcon />,
  twitter: <TwitterIcon />,
  instagram: <InstagramIcon />,
  linkedin: <LinkedInIcon />,
  youtube: <YoutubeIcon />,
  whatsapp: <WhatsAppIcon />,
  telegram: <TelegramIcon />,
}

function SocialIcon({ name }: { name: string }) {
  const key = name.replace(/icon$/i, '').trim().toLowerCase()
  return socialIconMap[key] ?? <WhatsAppIcon />
}

// ---- Localisation helpers (exactly as in navbar) ----
function pickLabel(link: QuickLink, locale: string) {
  if (locale === 'en') return link.label_en || link.label_fa || ''
  if (locale === 'ps') return link.label_ps || link.label_fa || ''
  return link.label_fa || link.label_en || link.label_ps || ''
}

export function withLocale(href: string, locale: string) {
  if (href.startsWith('http')) return href
  if (href.startsWith(`/${locale}`)) return href
  if (href.startsWith('/')) return `/${locale}${href}`
  return `/${locale}/${href}`
}

function pickText(fa?: string, en?: string, ps?: string, locale?: string) {
  if (locale === 'en') return en || fa || ps || ''
  if (locale === 'ps') return ps || fa || en || ''
  return fa || en || ps || ''
}

// ---- Footer ----
export function Footer({
  site,
  footerCopy,
  footerCopy_en,
  footerCopy_ps,
  quickLinks = siteMeta.quickLinks,  // fallback to the same data as navbar
  socialLinks = [],
}: FooterProps) {
  const { locale } = useLocale()

  // Brand – same logic as navbar
  const brandFa = site?.brand || siteMeta.brand
  const brandEn = site?.brand_en || siteMeta.brand_en || siteMeta.brand
  const brand = locale === 'en' ? brandEn : brandFa

  const sublineFa = site?.brandSubline || siteMeta.brandSubline
  const sublineEn = site?.brandSubline_en || (siteMeta as any).brandSubline_en || siteMeta.brandSubline
  const subline = locale === 'en' ? sublineEn : sublineFa

  // Footer copy – localized
  const copy = pickText(footerCopy, footerCopy_en, footerCopy_ps, locale)

  // Nav links – exactly as navbar does
  const navLinks = quickLinks.map((link) => ({
    href: link.href,
    label: pickLabel(link, locale),
  }))

  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Brand + copy */}
        <div>
          <strong>{brand}</strong>
          {subline && <small>{subline}</small>}
          <p>{copy}</p>
        </div>

        {/* Localised quick links */}
        <div className="footer-links">
          {navLinks.map((link) => (
            <Link key={link.href} href={withLocale(link.href, locale)}>
              {link.label}
            </Link>
          ))}
          {/* Extra static links (also localised) */}
          <Link href={`/${locale}/articles`}>
            {pickText('آرشیو مقالات', 'Articles', 'مقالې', locale)}
          </Link>
          <LanguageSwitch />  {/* optional, you can keep or remove */}
        </div>

        {/* Social links (external, no locale needed) */}
        {socialLinks.length > 0 && (
          <div className="footer-social">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="social-icon-link"
              >
                <SocialIcon name={s.iconName} />
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  )
}
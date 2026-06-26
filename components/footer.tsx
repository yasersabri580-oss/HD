'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
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
  site?: any
  footerCopy?: string
  footerCopy_en?: string
  footerCopy_ps?: string
  quickLinks?: QuickLink[]
  socialLinks?: SocialLink[]
}

// ---- Icon resolver ----
const socialIconMap: Record<string, ReactNode> = {
  facebook: <FacebookIcon />,
  twitter: <TwitterIcon />,
  x: <TwitterIcon />,
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

// ---- Localisation helpers ----
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

// ---- Social link normalization ----
function isExternalUrl(value: string) {
  return /^https?:\/\//i.test(value) || /^mailto:/i.test(value) || /^tel:/i.test(value)
}

function safeHttps(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (isExternalUrl(trimmed)) return trimmed
  if (trimmed.startsWith('//')) return `https:${trimmed}`
  return `https://${trimmed}`
}

function onlyDigits(value: string) {
  return value.replace(/[^\d]/g, '')
}

function normalizeTelegram(raw: string) {
  const value = raw.trim()

  // already valid
  if (/^https?:\/\/(t\.me|telegram\.me)\//i.test(value)) return value

  // @username
  if (value.startsWith('@')) {
    return `https://t.me/${value.slice(1)}`
  }

  // t.me/username or telegram.me/username
  if (/^(t\.me|telegram\.me)\//i.test(value)) {
    return `https://${value}`
  }

  // plain username
  return `https://t.me/${value.replace(/^\/+/, '')}`
}

function normalizeWhatsApp(raw: string) {
  const value = raw.trim()

  // already valid
  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(value)) return value

  // wa.me/989...
  if (value.startsWith('wa.me/')) return `https://${value}`
  if (value.startsWith('api.whatsapp.com/')) return `https://${value}`

  // phone, +phone, whatsapp:phone, etc.
  const phone = onlyDigits(value)
  if (phone) return `https://wa.me/${phone}`

  return ''
}

function normalizeInstagram(raw: string) {
  const value = raw.trim()
  if (/^https?:\/\/(www\.)?instagram\.com\//i.test(value)) return value
  const handle = value.replace(/^@/, '').replace(/^instagram:/i, '').replace(/^\/+/, '')
  return `https://www.instagram.com/${handle}/`
}

function normalizeLinkedIn(raw: string) {
  const value = raw.trim()
  if (/^https?:\/\/([a-z]+\.)?linkedin\.com\//i.test(value)) return value
  const cleaned = value.replace(/^linkedin:/i, '').replace(/^\/+/, '')
  return `https://www.linkedin.com/in/${cleaned}/`
}

function normalizeYouTube(raw: string) {
  const value = raw.trim()
  if (/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(value)) return value
  const cleaned = value.replace(/^youtube:/i, '').replace(/^@/, '').replace(/^\/+/, '')
  return `https://www.youtube.com/@${cleaned}`
}

function normalizeFacebook(raw: string) {
  const value = raw.trim()
  if (/^https?:\/\/(www\.)?facebook\.com\//i.test(value)) return value
  const cleaned = value.replace(/^facebook:/i, '').replace(/^\/+/, '')
  return `https://www.facebook.com/${cleaned}`
}

function normalizeTwitter(raw: string) {
  const value = raw.trim()
  if (/^https?:\/\/(www\.)?(x\.com|twitter\.com)\//i.test(value)) return value
  const cleaned = value.replace(/^@/, '').replace(/^twitter:/i, '').replace(/^x:/i, '').replace(/^\/+/, '')
  return `https://x.com/${cleaned}`
}

function normalizeSocialHref(link: SocialLink) {
  const href = link.href?.trim()
  if (!href) return ''

  const key = link.iconName.replace(/icon$/i, '').trim().toLowerCase()

  if (key === 'telegram') return normalizeTelegram(href)
  if (key === 'whatsapp') return normalizeWhatsApp(href)
  if (key === 'instagram') return normalizeInstagram(href)
  if (key === 'linkedin') return normalizeLinkedIn(href)
  if (key === 'youtube') return normalizeYouTube(href)
  if (key === 'facebook') return normalizeFacebook(href)
  if (key === 'twitter' || key === 'x') return normalizeTwitter(href)

  return safeHttps(href)
}

// ---- Footer ----
export function Footer({
  site,
  footerCopy,
  footerCopy_en,
  footerCopy_ps,
  quickLinks = siteMeta.quickLinks,
  socialLinks = [],
}: FooterProps) {
  const { locale } = useLocale()

  const brandFa = site?.brand || siteMeta.brand
  const brandEn = site?.brand_en || siteMeta.brand_en || siteMeta.brand
  const brand = locale === 'en' ? brandEn : brandFa

  const sublineFa = site?.brandSubline || siteMeta.brandSubline
  const sublineEn = site?.brandSubline_en || (siteMeta as any).brandSubline_en || siteMeta.brandSubline
  const subline = locale === 'en' ? sublineEn : sublineFa

  const copy = pickText(footerCopy, footerCopy_en, footerCopy_ps, locale)

  const navLinks = quickLinks.map((link) => ({
    href: link.href,
    label: pickLabel(link, locale),
  }))

  const normalizedSocialLinks = socialLinks
    .map((s) => ({
      ...s,
      href: normalizeSocialHref(s),
    }))
    .filter((s) => Boolean(s.href))

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <strong>{brand}</strong>
          {subline && <small>{subline}</small>}
          <p>{copy}</p>
        </div>

        <div className="footer-links">
          {navLinks.map((link) => (
            <Link key={link.href} href={withLocale(link.href, locale)}>
              {link.label}
            </Link>
          ))}
          <Link href={`/${locale}/articles`}>
            {pickText('آرشیو مقالات', 'Articles', 'مقالې', locale)}
          </Link>
          <LanguageSwitch />
        </div>

        {normalizedSocialLinks.length > 0 && (
          <div className="footer-social">
            {normalizedSocialLinks.map((s) => (
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
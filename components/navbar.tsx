'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CloseIcon, MenuIcon } from '../components/icons'
import { ThemeToggle } from '../components/theme-toggle'
import { LanguageSwitch } from '../components/language-switch'
import { useLocale } from '../components/language-provider'
import { siteMeta } from '../lib/site-meta'

export function Navbar({ site }: { site?: any }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { locale } = useLocale()

  const navLinks = siteMeta.quickLinks.map((link) => ({
    href: link.href,
    label:
      locale === 'en'
        ? link.label_en || link.label_fa
        : locale === 'ps'
          ? link.label_ps || link.label_fa
          : link.label_fa || link.label_en || link.label_ps,
  }))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const brandFa = site?.brand || siteMeta.brand
  const brandEn = site?.brand_en || siteMeta.brand_en || siteMeta.brand
  const sublineFa = site?.brandSubline || siteMeta.brandSubline
  const sublineEn = site?.brandSubline_en || (siteMeta as any).brandSubline_en || siteMeta.brandSubline

  const brand = locale === 'en' ? brandEn : brandFa
  const subline = locale === 'en' ? sublineEn : sublineFa

  return (
    <header className="navbar" data-scrolled={scrolled ? 'true' : 'false'}>
      <div className="container navbar-inner">
        <a className="brand" href="#top" onClick={() => setOpen(false)}>
          <span className="brand-mark">❤</span>
          <span className="brand-text">
            <strong>{brand}</strong>
            <small>{subline}</small>
          </span>
        </a>

        <nav className="nav-links" aria-label="ناوبری اصلی">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <LanguageSwitch />
          <ThemeToggle />
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={open}
            aria-label="باز و بسته کردن منو"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div className="container nav-panel" data-open={open ? 'true' : 'false'}>
        <div className="nav-panel-head">
          <LanguageSwitch />
          <ThemeToggle />
        </div>
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  )
}
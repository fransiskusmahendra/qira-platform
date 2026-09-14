"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "../../lib/i18n";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  const primaryLinks = [
    { href: "/about", label: t.nav.about },
    { href: "/layanan", label: t.nav.services },
    { href: "/portfolio", label: t.nav.portfolio },
    { href: "/harga", label: t.nav.pricing },
    { href: "/studi-kasus", label: t.nav.caseStudies },
    { href: "/panduan", label: t.nav.guides },
  ];

  const allMobileLinks = [
    { href: "/about", label: t.nav.about },
    { href: "/layanan", label: t.nav.services },
    { href: "/portfolio", label: t.nav.portfolio },
    { href: "/harga", label: t.nav.pricing },
    { href: "/cara-kerja", label: t.nav.howItWorks },
    { href: "/studi-kasus", label: t.nav.caseStudies },
    { href: "/panduan", label: t.nav.guides },
  ];

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle scroll shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`shell ${styles.navContainer}`}>
        <Link className={styles.brand} href="/" aria-label="QIRA - Beranda">
          QIRA<span>.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav} aria-label={t.nav.navAria}>
          {primaryLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${isActive ? styles.activeLink : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions & Mobile Toggle */}
        <div className={styles.navActions}>
          <LanguageSwitcher />
          <Link
            className={styles.ctaButton}
            href="/coba-masalah"
            data-conversion="homepage_cta_click"
          >
            {t.nav.ctaButton}
          </Link>

          <button
            type="button"
            className={`${styles.menuToggle} ${isOpen ? styles.isOpen : ""}`}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? t.nav.closeMenu : t.nav.openMenu}
          >
            <span className={styles.hamburgerIcon} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`${styles.mobileOverlay} ${isOpen ? styles.mobileOverlayVisible : ""}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <nav
        id="mobile-menu"
        className={`${styles.mobileDrawer} ${isOpen ? styles.mobileDrawerVisible : ""}`}
        aria-label={t.nav.mobileNavAria}
        aria-hidden={!isOpen}
      >
        <div className={styles.mobileLinks}>
          <Link
            href="/"
            className={`${styles.mobileNavLink} ${pathname === "/" ? styles.mobileActiveLink : ""}`}
            aria-current={pathname === "/" ? "page" : undefined}
            onClick={() => setIsOpen(false)}
          >
            <span>{t.nav.home}</span>
            <span aria-hidden="true">â†’</span>
          </Link>
          {allMobileLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.mobileNavLink} ${isActive ? styles.mobileActiveLink : ""}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setIsOpen(false)}
              >
                <span>{link.label}</span>
                <span aria-hidden="true">â†’</span>
              </Link>
            );
          })}
        </div>

        <div className={styles.mobileDrawerActions}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <LanguageSwitcher />
          </div>
          <Link
            className={styles.mobileCtaButton}
            href="/coba-masalah"
            data-conversion="homepage_cta_click"
            onClick={() => setIsOpen(false)}
          >
            {t.nav.mobileCta}
          </Link>
        </div>
      </nav>
    </header>
  );
}
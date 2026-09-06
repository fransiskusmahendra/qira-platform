"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

const PRIMARY_LINKS = [
  { href: "/about", label: "Tentang" },
  { href: "/layanan", label: "Layanan" },
  { href: "/portfolio", label: "Portofolio" },
  { href: "/harga", label: "Harga" },
  { href: "/studi-kasus", label: "Studi Kasus" },
  { href: "/panduan", label: "Panduan" },
] as const;

const ALL_MOBILE_LINKS = [
  { href: "/about", label: "Tentang" },
  { href: "/layanan", label: "Layanan & Solusi" },
  { href: "/portfolio", label: "Portofolio Karya" },
  { href: "/harga", label: "Harga & Paket" },
  { href: "/cara-kerja", label: "Cara Kerja" },
  { href: "/studi-kasus", label: "Studi Kasus" },
  { href: "/panduan", label: "Panduan Bisnis" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        <Link className={styles.brand} href="/" aria-label="QIRA — Beranda">
          QIRA<span>.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav} aria-label="Navigasi utama">
          {PRIMARY_LINKS.map((link) => {
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
          <Link
            className={styles.ctaButton}
            href="/coba-masalah"
            data-conversion="homepage_cta_click"
          >
            Ceritakan masalah
          </Link>

          <button
            type="button"
            className={`${styles.menuToggle} ${isOpen ? styles.isOpen : ""}`}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Tutup menu" : "Buka menu navigasi"}
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
        aria-label="Navigasi seluler"
        aria-hidden={!isOpen}
      >
        <div className={styles.mobileLinks}>
          <Link
            href="/"
            className={`${styles.mobileNavLink} ${pathname === "/" ? styles.mobileActiveLink : ""}`}
            aria-current={pathname === "/" ? "page" : undefined}
            onClick={() => setIsOpen(false)}
          >
            <span>Beranda</span>
            <span aria-hidden="true">→</span>
          </Link>
          {ALL_MOBILE_LINKS.map((link) => {
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
                <span aria-hidden="true">→</span>
              </Link>
            );
          })}
        </div>

        <div className={styles.mobileDrawerActions}>
          <Link
            className={styles.mobileCtaButton}
            href="/coba-masalah"
            data-conversion="homepage_cta_click"
            onClick={() => setIsOpen(false)}
          >
            Ceritakan Masalah Usaha
          </Link>
        </div>
      </nav>
    </header>
  );
}

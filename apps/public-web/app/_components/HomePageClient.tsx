"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useLanguage } from "../../lib/i18n";
import { DigitalSphereCanvas } from "./DigitalSphereCanvas";
import styles from "./QiraFlowHome.module.css";

export function HomePageClient() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  // State for interactive Before/After comparison slider
  const [sliderPos, setSliderPos] = useState(50);

  const handleSliderMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  return (
    <>
      <Navbar />

      <main className={styles.pageWrap}>
        {/* =========================================================================
            SECTION 01: HERO (LUMINOUS 3D SPHERE CORE + ULTRA-CLEAN EDITORIAL)
            ========================================================================= */}
        <section className={styles.heroSection}>
          {/* Layer 2: Subtle Architectural Grid */}
          <div className={styles.heroGridBackdrop} aria-hidden="true" />

          {/* Layer 3: Central Volumetric Radial Backglow */}
          <div className={styles.ambientGlowCentral} aria-hidden="true" />

          {/* Layer 4: Interactive Rotating 3D Digital Wireframe Sphere */}
          <div className={styles.sphereContainer} aria-hidden="true">
            <DigitalSphereCanvas />
          </div>

          <div className={`shell ${styles.heroCenteredContent}`}>
            <h1 className={styles.heroTitleCentered}>
              <span>{isEn ? "Turn Business Needs." : "Ubah Kebutuhan Bisnis."}</span>
              <span>{isEn ? "Into Digital Solutions." : "Menjadi Solusi Digital."}</span>
            </h1>

            <p className={styles.heroSubCentered}>
              {isEn
                ? "Practical software that cuts manual friction and scales with your business."
                : "Software praktis yang memangkas kendala manual dan siap berkembang bersama bisnis Anda."}
            </p>

            <div className={styles.heroActionsCentered}>
              <a
                href="https://wa.me/628211076517?text=Halo%20QIRA,%20saya%20ingin%20konsultasi%20solusi%20digital%20bisnis."
                target="_blank"
                rel="noreferrer"
                className={styles.pillCtaPrimary}
              >
                <span>{isEn ? "Quick Consultation" : "Konsultasi Cepat"}</span>
                <span>→</span>
              </a>
              <Link href="#solutions" className={styles.secondaryButtonPill}>
                {isEn ? "Explore Solutions" : "Jelajahi Solusi"}
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 02: WHAT WE DO (DIGITAL FOUNDATION • GROWTH ENGINE • CONNECTED GROWTH)
            ========================================================================= */}
        <section className={`${styles.sectionPadding} ${styles.solutionsSection}`} id="solutions">
          <div className="shell">
            <div className={styles.sectionHeader}>
              <p className="kicker">{isEn ? "WHAT WE DO" : "APA YANG KAMI LAKUKAN"}</p>
              <h2 className={styles.sectionHeading}>
                {isEn ? "Digital foundations for modern operations." : "Pondasi digital untuk operasional modern."}
              </h2>
              <p className={styles.sectionLead}>
                {isEn
                  ? "Clean software architecture connecting daily workflows with operational clarity."
                  : "Arsitektur software bersih yang menghubungkan alur kerja dan mempermudah operasional harian."}
              </p>
            </div>

            <div className={styles.helpGrid}>
              {/* Category 1: Digital Foundation */}
              <div className={styles.helpCard}>
                <div>
                  <div className={styles.cardNum}>01 — FOUNDATION</div>
                  <h3>{isEn ? "Digital Foundation" : "Pondasi Digital"}</h3>
                </div>
                <ul className={styles.featureList}>
                  <li>{isEn ? "Web applications & internal tools" : "Aplikasi web & portal operasional tim"}</li>
                  <li>{isEn ? "Structured digital forms & data intake" : "Formulir digital & pengumpulan data terstruktur"}</li>
                  <li>{isEn ? "Operational dashboards & management visibility" : "Dashboard operasional & visibilitas manajemen"}</li>
                </ul>
              </div>

              {/* Category 2: Growth Engine */}
              <div className={styles.helpCard}>
                <div>
                  <div className={styles.cardNum}>02 — GROWTH ENGINE</div>
                  <h3>{isEn ? "Growth Engine" : "Mesin Pertumbuhan"}</h3>
                </div>
                <ul className={styles.featureList}>
                  <li>{isEn ? "Automated customer communication" : "Komunikasi & respon pelanggan otomatis"}</li>
                  <li>{isEn ? "Transaction processing & receipt generation" : "Pemrosesan transaksi & pembuatan struk instan"}</li>
                  <li>{isEn ? "Document & approval workflows" : "Alur persetujuan & otomasi dokumen"}</li>
                </ul>
              </div>

              {/* Category 3: Connected Growth */}
              <div className={styles.helpCard}>
                <div>
                  <div className={styles.cardNum}>03 — CONNECTED GROWTH</div>
                  <h3>{isEn ? "Connected Growth" : "Pertumbuhan Terhubung"}</h3>
                </div>
                <ul className={styles.featureList}>
                  <li>{isEn ? "Cross-platform data synchronization" : "Sinkronisasi data lintas platform"}</li>
                  <li>{isEn ? "API integrations & accounting connections" : "Integrasi API & koneksi pembukuan"}</li>
                  <li>{isEn ? "Unified multi-channel operational flows" : "Alur operasional multi-channel terpadu"}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 03: BUILT BY QIRA (PRODUCT-LED)
            ========================================================================= */}
        <section className={`${styles.sectionPadding} ${styles.productsSection}`} id="products">
          <div className="shell">
            <div className={styles.sectionHeader}>
              <p className="kicker">{isEn ? "BUILT BY QIRA" : "DIBANGUN OLEH QIRA"}</p>
              <h2 className={styles.sectionHeading}>
                {isEn ? "Proven, ready-to-deploy systems." : "Sistem teruji siap pakai."}
              </h2>
              <p className={styles.sectionLead}>
                {isEn
                  ? "Standalone software applications built to solve operational bottlenecks."
                  : "Aplikasi mandiri yang dibangun untuk mengatasi kendala lapangan."}
              </p>
            </div>

            <div className={styles.productsContainer}>
              {/* Product 1: QIRA Invoice */}
              <div className={styles.productRow}>
                <div className={styles.productInfo}>
                  <span className={styles.productBadge}>{isEn ? "PRODUCT SYSTEM" : "SISTEM PRODUK"}</span>
                  <h3>QIRA Invoice</h3>
                  <p>
                    {isEn
                      ? "Automated digital invoicing built for growing businesses to get paid on time."
                      : "Sistem penagihan digital terotomasi untuk bisnis agar pembayaran tepat waktu."}
                  </p>

                  <div className={styles.flowPills}>
                    <span className={styles.pill}>{isEn ? "Create" : "Buat"}</span>
                    <span className={styles.pillArrow}>→</span>
                    <span className={styles.pill}>{isEn ? "Manage" : "Kelola"}</span>
                    <span className={styles.pillArrow}>→</span>
                    <span className={styles.pill}>{isEn ? "Track" : "Lacak"}</span>
                  </div>

                  <a
                    href="https://wa.me/628211076517?text=Halo%20QIRA,%20saya%20tertarik%20dengan%20sistem%20QIRA%20Invoice."
                    target="_blank"
                    rel="noreferrer"
                    className={styles.productCta}
                  >
                    {isEn ? "Explore Product →" : "Lihat Produk →"}
                  </a>
                </div>

                <div className={styles.productVisual}>
                  <div className={styles.appCard}>
                    <div className={styles.appCardHead}>
                      <div>
                        <strong>INV-2026-089</strong>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>PT Solusi Mandiri</div>
                      </div>
                      <span className={styles.tagPaid}>{isEn ? "PAID IN FULL" : "LUNAS LENGKAP"}</span>
                    </div>
                    <div className={styles.appCardLine}>
                      <span>Enterprise Platform License</span>
                      <strong>Rp 18.500.000</strong>
                    </div>
                    <div className={styles.appCardLine}>
                      <span>System Integration Service</span>
                      <strong>Rp 7.200.000</strong>
                    </div>
                    <div className={styles.appCardTotal}>
                      <span>{isEn ? "Total Amount" : "Total Tagihan"}</span>
                      <span style={{ color: "var(--blue)" }}>Rp 25.700.000</span>
                    </div>
                    <div className={styles.appCardMeta}>
                      <span style={{ color: "#10b981" }}>✓</span> {isEn ? "Auto-sent to client via WhatsApp & Cloud Record" : "Terkirim otomatis ke klien via WhatsApp & Cloud"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product 2: QIRA Retail & POS System */}
              <div className={styles.productRow}>
                <div className={styles.productInfo}>
                  <span className={styles.productBadge}>{isEn ? "OPERATIONAL SUITE" : "SUITE OPERASIONAL"}</span>
                  <h3>QIRA Retail & POS System</h3>
                  <p>
                    {isEn
                      ? "Cloud POS and multi-outlet inventory system engineered for retail and distributors."
                      : "Aplikasi kasir cloud dan manajemen stok multi-cabang untuk toko ritel dan distributor."}
                  </p>

                  <div className={styles.flowPills}>
                    <span className={styles.pill}>{isEn ? "Fast Checkout" : "Kasir Cepat"}</span>
                    <span className={styles.pillArrow}>→</span>
                    <span className={styles.pill}>{isEn ? "Real-Time Stock" : "Stok Real-Time"}</span>
                    <span className={styles.pillArrow}>→</span>
                    <span className={styles.pill}>{isEn ? "Owner Dashboard" : "Dashboard Owner"}</span>
                  </div>

                  <a
                    href="https://wa.me/628211076517?text=Halo%20QIRA,%20saya%20tertarik%20dengan%20sistem%20QIRA%20Retail%20POS."
                    target="_blank"
                    rel="noreferrer"
                    className={styles.productCta}
                  >
                    {isEn ? "Explore Product →" : "Lihat Produk →"}
                  </a>
                </div>

                <div className={styles.productVisual}>
                  <div className={styles.appCard}>
                    <div className={styles.appCardHead}>
                      <strong>{isEn ? "Multi-Warehouse Inventory" : "Inventaris Multi-Gudang"}</strong>
                      <span style={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}>● {isEn ? "Live Sync" : "Sync Berjalan"}</span>
                    </div>
                    <div className={styles.appCardLine}>
                      <span>Semen Padang 50kg</span>
                      <strong style={{ color: "#10b981" }}>48 Sak (Safe)</strong>
                    </div>
                    <div className={styles.appCardLine}>
                      <span>Besi Beton SNI 10mm</span>
                      <strong style={{ color: "#10b981" }}>120 Batang</strong>
                    </div>
                    <div className={styles.appCardLine}>
                      <span>Cat Eksterior 5kg</span>
                      <strong style={{ color: "#f59e0b" }}>4 Kaleng (Low Alert)</strong>
                    </div>
                    <div className={styles.appCardMeta} style={{ color: "var(--blue)", fontWeight: 600 }}>
                      ⚡ {isEn ? "Auto-deducts instantly on cashier register" : "Otomatis memotong stok saat kasir input transaksi"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 04: QIRA FLOW (SIGNATURE PROCESS)
            ========================================================================= */}
        <section className={`${styles.sectionPadding} ${styles.flowSection}`} id="qira-flow">
          <div className="shell">
            <div className={styles.sectionHeader} style={{ textAlign: "center", margin: "0 auto 50px" }}>
              <p className="kicker">{isEn ? "HOW WE WORK" : "ALUR KERJA"}</p>
              <h2 className={styles.sectionHeading}>{isEn ? "Four disciplined steps." : "Empat tahap terstruktur."}</h2>
              <p className={styles.sectionLead} style={{ margin: "0 auto" }}>
                {isEn
                  ? "From initial bottleneck analysis to a deployed, production-ready system."
                  : "Dari pemetaan hambatan hingga sistem operasional siap pakai."}
              </p>
            </div>

            <div className={styles.flowTimeline}>
              <div className={styles.flowStep}>
                <div className={styles.stepCircle}>01</div>
                <strong>{isEn ? "Discover" : "Discover"}</strong>
                <small>{isEn ? "Understand workflows & bottlenecks." : "Memahami alur kerja & hambatan."}</small>
              </div>

              <div className={styles.flowStep}>
                <div className={styles.stepCircle}>02</div>
                <strong>{isEn ? "Design" : "Design"}</strong>
                <small>{isEn ? "Practical architecture & lean UX." : "Arsitektur solusi & desain praktis."}</small>
              </div>

              <div className={styles.flowStep}>
                <div className={styles.stepCircle}>03</div>
                <strong>{isEn ? "Build" : "Build"}</strong>
                <small>{isEn ? "Engineered without bloated code." : "Dibangun tanpa dependensi rumit."}</small>
              </div>

              <div className={styles.flowStep}>
                <div className={styles.stepCircle}>04</div>
                <strong>{isEn ? "Improve" : "Improve"}</strong>
                <small>{isEn ? "Deployment, onboarding & review." : "Penerapan, pelatihan, dan optimasi."}</small>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 05: SELECTED WORK (FROM COMPLEXITY TO SIMPLICITY)
            ========================================================================= */}
        <section className={`${styles.sectionPadding} ${styles.caseStudiesSection}`} id="case-studies">
          <div className="shell">
            <div className={styles.sectionHeader}>
              <p className="kicker">{isEn ? "SELECTED WORK" : "KARYA NYATA"}</p>
              <h2 className={styles.sectionHeading}>{isEn ? "From complexity to simplicity." : "Dari kerumitan menjadi kemudahan."}</h2>
              <p className={styles.sectionLead}>
                {isEn
                  ? "Real deployments demonstrating measurable operational impact."
                  : "Penerapan langsung dengan dampak operasional nyata."}
              </p>
            </div>

            {/* Case 1: Maduratna Retail POS with interactive Before/After Slider */}
            <div className={styles.caseCard}>
              <div className={styles.caseHead}>
                <div>
                  <span className={styles.caseTag}>{isEn ? "RETAIL & DISTRIBUTION" : "RETAIL & DISTRIBUSI"}</span>
                  <h3 className={styles.caseTitle}>
                    {isEn ? "Maduratna Building Supplies — POS & Stock Digitalization" : "Toko Bangunan Maduratna — Digitalisasi POS & Inventaris"}
                  </h3>
                </div>
                <div className={styles.caseMetrics}>
                  <div>
                    <small>{isEn ? "Checkout Speed" : "Kecepatan Kasir"}</small>
                    <strong style={{ color: "var(--blue)" }}>10x Faster</strong>
                  </div>
                  <div>
                    <small>{isEn ? "Stock Variance" : "Selisih Stok"}</small>
                    <strong style={{ color: "var(--blue)" }}>0.0% Error</strong>
                  </div>
                  <div>
                    <small>{isEn ? "Reconciliation" : "Rekap Harian"}</small>
                    <strong style={{ color: "var(--blue)" }}>Automated</strong>
                  </div>
                </div>
              </div>

              {/* Interactive Comparison Slider */}
              <div
                className={styles.compSlider}
                onMouseMove={(e) => {
                  if (e.buttons === 1) handleSliderMove(e.clientX, e.currentTarget.getBoundingClientRect());
                }}
                onTouchMove={(e) => {
                  if (e.touches && e.touches[0]) handleSliderMove(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
                }}
                onClick={(e) => handleSliderMove(e.clientX, e.currentTarget.getBoundingClientRect())}
              >
                {/* BEFORE LAYER */}
                <div className={`${styles.compLayer} ${styles.compBefore}`}>
                  <span className={styles.compBadgeBefore}>{isEn ? "BEFORE (MANUAL)" : "SEBELUM (MANUAL)"}</span>
                  <h4>{isEn ? "Handwritten receipts & manual reconciliation" : "Nota tulisan tangan & rekap manual melelahkan"}</h4>
                  <ul>
                    <li>✕ {isEn ? "Manual paper receipts prone to calculation errors" : "Nota kertas rawan hilang dan salah hitung"}</li>
                    <li>✕ {isEn ? "Late-night manual inventory recounting" : "Hitung fisik stok manual setiap tutup toko"}</li>
                  </ul>
                </div>

                {/* AFTER LAYER (Clipped) */}
                <div className={`${styles.compLayer} ${styles.compAfter}`} style={{ width: `${sliderPos}%` }}>
                  <div className={styles.compAfterInner}>
                    <span className={styles.compBadgeAfter}>{isEn ? "AFTER (CONNECTED)" : "SESUDAH (TERINTEGRASI)"}</span>
                    <h4>{isEn ? "Instant cloud POS & real-time inventory" : "Kasir cloud instan & stok otomatis terpotong"}</h4>
                    <ul>
                      <li>✓ {isEn ? "Instant POS with auto WhatsApp & thermal receipts" : "Kasir instan dengan nota otomatis WhatsApp & thermal"}</li>
                      <li>✓ {isEn ? "Real-time stock sync with owner KPI dashboard" : "Sinkronisasi stok real-time & pantau omset di ponsel"}</li>
                    </ul>
                  </div>
                </div>

                {/* Handle */}
                <div className={styles.compHandle} style={{ left: `${sliderPos}%` }}>
                  <div className={styles.compHandleKnob}>↔</div>
                </div>
              </div>

              <div className={styles.sliderHint}>
                {isEn ? "← Drag or tap slider to compare Before and After →" : "← Geser atau sentuh garis slider untuk membandingkan Sebelum dan Sesudah →"}
              </div>
            </div>

            {/* Case 2: PT Ugra Taraka Sigra */}
            <div className={styles.caseCard} style={{ marginTop: 28 }}>
              <div className={styles.caseHead}>
                <div>
                  <span className={styles.caseTag}>{isEn ? "PROFESSIONAL EDUCATION" : "PENDIDIKAN PROFESIONAL"}</span>
                  <h3 className={styles.caseTitle}>
                    {isEn ? "PT Ugra Taraka Sigra — End-to-End Digital Sales Platform" : "PT Ugra Taraka Sigra — Platform Penjualan Digital End-to-End"}
                  </h3>
                </div>
                <div className={styles.caseMetrics}>
                  <div>
                    <small>{isEn ? "Participant Flow" : "Alur Peserta"}</small>
                    <strong style={{ color: "var(--blue)" }}>100% Digital</strong>
                  </div>
                  <div>
                    <small>{isEn ? "Invoice Time" : "Penerbitan Invoice"}</small>
                    <strong style={{ color: "var(--blue)" }}>&lt; 10 Seconds</strong>
                  </div>
                </div>
              </div>
              <div className={styles.caseCompareGrid}>
                <div className={styles.caseCompareColBefore}>
                  <span className={styles.compBadgeBefore}>{isEn ? "BEFORE (MANUAL)" : "SEBELUM (MANUAL)"}</span>
                  <ul>
                    <li>✕ {isEn ? "Manual registration & scattered participant data" : "Pendaftaran manual & data peserta tercecer"}</li>
                    <li>✕ {isEn ? "Slow payment verification and invoice delays" : "Verifikasi pembayaran & invoice tertunda"}</li>
                  </ul>
                </div>
                <div className={styles.caseCompareColAfter}>
                  <span className={styles.compBadgeAfter}>{isEn ? "AFTER (AUTOMATED)" : "SESUDAH (OTOMATIS)"}</span>
                  <ul>
                    <li>✓ {isEn ? "Integrated self-serve registration form" : "Form pendaftaran digital terintegrasi"}</li>
                    <li>✓ {isEn ? "Automated invoicing in < 10 seconds" : "Invoice instan < 10 detik & rekap otomatis"}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: 32 }}>
              <Link href="/portfolio" className={styles.secondaryButtonPill}>
                {isEn ? "View All Work →" : "Lihat Semua Karya →"}
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 08: ABOUT QIRA
            ========================================================================= */}
        <section className={`${styles.sectionPadding} ${styles.aboutSection}`} id="about">
          <div className="shell">
            <div className={styles.aboutBox}>
              <div>
                <p className="kicker">{isEn ? "ABOUT QIRA" : "TENTANG QIRA"}</p>
                <div className={styles.aboutQuote}>
                  {isEn ? "Digital should make business simpler." : "Digital harus membuat bisnis lebih sederhana."}
                </div>
                <p className={styles.aboutBody}>
                  {isEn
                    ? "We build focused software systems that eliminate daily manual friction and support sustainable business operations."
                    : "Kami membangun software praktis yang memangkas beban kerja manual dan mendukung pertumbuhan bisnis yang terukur."}
                </p>
                <div style={{ marginTop: 20 }}>
                  <Link href="/about" className={styles.productCta}>
                    {isEn ? "Learn More About Us →" : "Pelajari Lebih Lanjut →"}
                  </Link>
                </div>
              </div>

              <div className={styles.aboutMeta}>
                <strong>QIRA — Digital Solutions</strong>
                <span>Jakarta, Indonesia</span>
                <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginTop: 12 }}>
                  WhatsApp: +62 821-1076-517<br />
                  Email: hello@qirasolution.com<br />
                  Website: www.qirasolution.com
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 09: PRICING (STARTING POINTS & SCOPE EXAMPLES)
            ========================================================================= */}
        <section className={`${styles.sectionPadding} ${styles.pricingSection}`} id="pricing">
          <div className="shell">
            <div className={styles.sectionHeader}>
              <p className="kicker">{isEn ? "PROJECT SCOPE & PRICING" : "LINGKUP PROYEK & BIAYA"}</p>
              <h2 className={styles.sectionHeading}>
                {isEn ? "Transparent starting points for your digital solutions." : "Prakiraan awal yang transparan untuk solusi digital Anda."}
              </h2>
              <p className={styles.sectionLead}>
                {isEn
                  ? "Every project is scoped to actual business requirements. Final investments depend on features, integrations, workflow complexity, and support."
                  : "Setiap proyek disesuaikan dengan kebutuhan nyata bisnis Anda. Nilai akhir bergantung pada kompleksitas modul, integrasi sistem, dan alur kerja."}
              </p>
            </div>

            <div className={styles.pricingGrid}>
              <div className={styles.pricingCard}>
                <span className={styles.pricingTier}>{isEn ? "STARTING FROM" : "MULAI DARI"}</span>
                <div className={styles.pricingAmount}>Rp 1.500.000</div>
                <h4>{isEn ? "Business Foundation" : "Pondasi Bisnis & Web"}</h4>
                <p>{isEn ? "Dedicated company profile, digital catalog, and structured intake form for straightforward operations." : "Website profil usaha, katalog digital, dan form terstruktur untuk usaha yang ingin mulai rapi."}</p>
                <ul className={styles.pricingPoints}>
                  <li>✓ {isEn ? "Responsive modern web design" : "Desain web modern & responsif"}</li>
                  <li>✓ {isEn ? "WhatsApp direct integration" : "Integrasi langsung ke WhatsApp"}</li>
                  <li>✓ {isEn ? "Speed & SEO optimization" : "Optimasi kecepatan & SEO lokal"}</li>
                </ul>
              </div>

              <div className={`${styles.pricingCard} ${styles.pricingFeatured}`}>
                <span className={styles.pricingTierFeatured}>{isEn ? "POPULAR SCOPE" : "LINGKUP POPULER"}</span>
                <div className={styles.pricingAmount}>Rp 3.500.000</div>
                <h4>{isEn ? "Operations & POS Suite" : "Sistem Operasional & POS"}</h4>
                <p>{isEn ? "Digital point-of-sale, real-time inventory management, receipt generation, and transaction records." : "Kasir digital cloud, manajemen stok real-time, pencatatan transaksi, dan cetak struk instan."}</p>
                <ul className={styles.pricingPoints}>
                  <li>✓ {isEn ? "Multi-SKU inventory & stock alerts" : "Manajemen multi-SKU & alert stok"}</li>
                  <li>✓ {isEn ? "Cashier register & digital receipts" : "Kasir web & nota digital otomatis"}</li>
                  <li>✓ {isEn ? "Owner summary dashboard" : "Dashboard rekap penjualan harian"}</li>
                </ul>
              </div>

              <div className={styles.pricingCard}>
                <span className={styles.pricingTier}>{isEn ? "ENTERPRISE WORKFLOW" : "ALUR TERPADU"}</span>
                <div className={styles.pricingAmount}>Rp 7.500.000</div>
                <h4>{isEn ? "Connected Automation" : "Sistem Terhubung & Otomasi"}</h4>
                <p>{isEn ? "Custom end-to-end pipelines, API synchronization, automated WhatsApp triggers, and internal dashboards." : "Pipeline alur kerja menyeluruh, sinkronisasi API, otomasi notifikasi WhatsApp, dan dashboard terpadu."}</p>
                <ul className={styles.pricingPoints}>
                  <li>✓ {isEn ? "Custom API & database integration" : "Integrasi database & API khusus"}</li>
                  <li>✓ {isEn ? "Automated notifications & invoicing" : "Otomasi notifikasi & tagihan digital"}</li>
                  <li>✓ {isEn ? "Dedicated deployment & onboarding" : "Pendampingan & training tim operasional"}</li>
                </ul>
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: 32 }}>
              <Link href="/harga" className={styles.secondaryButtonPill}>
                {isEn ? "View Detailed Pricing & Plans →" : "Lihat Rincian Paket & Fitur →"}
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 10: FINAL CTA
            ========================================================================= */}
        <section className={`${styles.finalCta} ${styles.finalCtaSection}`} id="contact">
          <div className="shell">
            <div className={styles.finalCtaCard}>
              <h2>{isEn ? "Have a business problem to solve?" : "Punya tantangan bisnis yang ingin diselesaikan?"}</h2>
              <p>{isEn ? "Let's turn it into a practical digital solution." : "Mari kita ubah menjadi solusi digital yang praktis."}</p>
              <a
                href="https://wa.me/628211076517?text=Halo%20QIRA,%20saya%20ingin%20berdiskusi%20tentang%20solusi%20digital."
                target="_blank"
                rel="noreferrer"
                className="primaryButton"
                style={{ padding: "0 34px", minHeight: 52 }}
              >
                {isEn ? "Start a Project →" : "Mulai Proyek →"}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
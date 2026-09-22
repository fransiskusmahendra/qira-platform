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
                ? "We design, build, and connect practical software systems that eliminate manual bottlenecks and scale with your operations."
                : "Kami merancang, membangun, dan menghubungkan sistem software praktis yang memangkas kendala manual dan siap bertumbuh bersama bisnis Anda."}
            </p>

            <div className={styles.heroActionsCentered}>
              <a
                href="https://wa.me/628211076517?text=Halo%20QIRA,%20saya%20ingin%20konsultasi%20solusi%20digital%20bisnis."
                target="_blank"
                rel="noreferrer"
                className={styles.pillCtaPrimary}
              >
                <span>{isEn ? "FREE CONSULTATION" : "KONSULTASI GRATIS"}</span>
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
                {isEn ? "From business challenges to practical digital solutions." : "Dari tantangan bisnis menjadi solusi digital yang praktis."}
              </h2>
              <p className={styles.sectionLead}>
                {isEn
                  ? "We focus on solving business problems through clean software architecture, connected workflows, and operational clarity."
                  : "Kami berfokus memecahkan masalah bisnis melalui arsitektur software yang bersih, alur kerja terhubung, dan kejelasan operasional."}
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
                {isEn ? "Digital solutions designed around real business needs." : "Solusi digital yang dirancang menjawab kebutuhan nyata bisnis."}
              </h2>
              <p className={styles.sectionLead}>
                {isEn
                  ? "Practical, proven products and systems built and deployed for real operational challenges."
                  : "Produk dan sistem terbukti yang dibangun dan diimplementasikan langsung untuk mengatasi kendala lapangan."}
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
            SECTION 04: QIRA FLOW (SIGNATURE SECTION)
            ========================================================================= */}
        <section className={`${styles.sectionPadding} ${styles.flowSection}`} id="qira-flow">
          <div className="shell">
            <div className={styles.sectionHeader} style={{ textAlign: "center", margin: "0 auto 50px" }}>
              <p className="kicker">{isEn ? "SIGNATURE PROCESS" : "PROSES SIGNATURE"}</p>
              <h2 className={styles.sectionHeading}>{isEn ? "FROM BUSINESS NEED TO DIGITAL SOLUTION." : "DARI KEBUTUHAN BISNIS MENJADI SOLUSI DIGITAL."}</h2>
              <p className={styles.sectionLead} style={{ margin: "0 auto" }}>
                {isEn
                  ? "A disciplined, transparent progression that turns operational bottlenecks into structured digital systems."
                  : "Jalur tahapan terstruktur yang mengubah hambatan operasional menjadi sistem digital yang rapi dan terukur."}
              </p>
            </div>

            <div className={styles.flowTimeline}>
              <div className={styles.flowStep}>
                <div className={styles.stepCircle}>01</div>
                <strong>{isEn ? "Discover" : "Discover"}</strong>
                <small>{isEn ? "Understand the business problem." : "Memahami masalah & alur operasional bisnis."}</small>
              </div>

              <div className={styles.flowStep}>
                <div className={styles.stepCircle}>02</div>
                <strong>{isEn ? "Design" : "Design"}</strong>
                <small>{isEn ? "Turn the problem into a practical solution." : "Merancang solusi praktis & arsitektur UX."}</small>
              </div>

              <div className={styles.flowStep}>
                <div className={styles.stepCircle}>03</div>
                <strong>{isEn ? "Build" : "Build"}</strong>
                <small>{isEn ? "Develop the required digital system." : "Membangun software & modul yang dibutuhkan."}</small>
              </div>

              <div className={styles.flowStep}>
                <div className={styles.stepCircle}>04</div>
                <strong>{isEn ? "Improve" : "Improve"}</strong>
                <small>{isEn ? "Iterate, connect and optimize." : "Iterasi berkelanjutan, integrasi & optimasi."}</small>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 05: CASE STUDIES (FROM COMPLEXITY TO SIMPLICITY)
            ========================================================================= */}
        <section className={`${styles.sectionPadding} ${styles.caseStudiesSection}`} id="case-studies">
          <div className="shell">
            <div className={styles.sectionHeader}>
              <p className="kicker">{isEn ? "CASE STUDIES" : "STUDI KASUS"}</p>
              <h2 className={styles.sectionHeading}>{isEn ? "FROM COMPLEXITY TO SIMPLICITY" : "DARI KERUMITAN MENJADI KEMUDAHAN"}</h2>
              <p className={styles.sectionLead}>
                {isEn
                  ? "Real case studies demonstrating practical digital transformation for operational teams."
                  : "Studi kasus nyata implementasi transformasi digital praktis pada operasional tim."}
              </p>
            </div>

            {/* Case 1: Maduratna Retail POS with interactive Before/After Slider */}
            <div className={styles.caseCard}>
              <div className={styles.caseHead}>
                <div>
                  <span className={styles.caseTag}>{isEn ? "RETAIL & DISTRIBUTION CASE" : "KASUS RETAIL & DISTRIBUSI"}</span>
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
                  <span className={styles.compBadgeBefore}>{isEn ? "BEFORE QIRA (MANUAL OPERATION)" : "SEBELUM QIRA (OPERASIONAL MANUAL)"}</span>
                  <h4>{isEn ? "Handwritten receipts, daily stock chaos, and manual bookkeeping" : "Nota tulisan tangan, selisih stok harian, dan lembur rekap kasir"}</h4>
                  <ul>
                    <li>✕ {isEn ? "Manual paper receipts prone to calculation errors and loss" : "Nota kertas rawan hilang, salah hitung harga, dan tinta pudar"}</li>
                    <li>✕ {isEn ? "Store closed late every night just to recount physical inventory" : "Toko tutup malam hari hanya untuk hitung fisik barang"}</li>
                    <li>✕ {isEn ? "Owner blind to daily profits and slow-moving materials" : "Pemilik kesulitan mengetahui profit riil dan stok macet harian"}</li>
                  </ul>
                </div>

                {/* AFTER LAYER (Clipped) */}
                <div className={`${styles.compLayer} ${styles.compAfter}`} style={{ width: `${sliderPos}%` }}>
                  <div className={styles.compAfterInner}>
                    <span className={styles.compBadgeAfter}>{isEn ? "AFTER QIRA (CONNECTED SYSTEM)" : "SESUDAH QIRA (SISTEM TERINTEGRASI)"}</span>
                    <h4>{isEn ? "Instant digital POS, auto-deducted warehouse inventory, and live mobile KPIs" : "Kasir web instan, stok gudang otomatis terpotong, dan laporan di HP"}</h4>
                    <ul>
                      <li>✓ {isEn ? "1-click printed or WhatsApp receipt with automatic cloud logging" : "1 klik cetak struk atau kirim nota WhatsApp resmi"}</li>
                      <li>✓ {isEn ? "Inventory syncs in real time with automated low-stock warnings" : "Stok tersinkronisasi real-time dengan alert otomatis"}</li>
                      <li>✓ {isEn ? "Owner monitors real-time sales and margins directly from smartphone" : "Pemilik memantau omset, laba, dan penjualan dari ponsel"}</li>
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
                  <span className={styles.caseTag}>{isEn ? "PROFESSIONAL EDUCATION CASE" : "KASUS PENDIDIKAN PROFESIONAL"}</span>
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
                    <li>✕ {isEn ? "Course registration handled manually via chat" : "Pendaftaran kursus manual via chat"}</li>
                    <li>✕ {isEn ? "Participant data scattered across spreadsheets" : "Data peserta tercecer di berbagai spreadsheet"}</li>
                    <li>✕ {isEn ? "Slow payment verification and invoice delays" : "Verifikasi bayar dan invoice tertunda"}</li>
                  </ul>
                </div>
                <div className={styles.caseCompareColAfter}>
                  <span className={styles.compBadgeAfter}>{isEn ? "AFTER (AUTOMATED)" : "SESUDAH (OTOMATIS)"}</span>
                  <ul>
                    <li>✓ {isEn ? "Integrated self-serve registration intake" : "Formulir pendaftaran digital terintegrasi"}</li>
                    <li>✓ {isEn ? "Invoices generated and sent in < 10 seconds" : "Invoice terbit otomatis < 10 detik"}</li>
                    <li>✓ {isEn ? "Live cohort dashboard and financial reporting" : "Dashboard peserta & laporan keuangan real-time"}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 07: BUILT FOR BUSINESS (PROBLEM-SOLVING CAPABILITY)
            ========================================================================= */}
        <section className={`${styles.sectionPadding} ${styles.builtForBusinessSection}`} id="built-for-business">
          <div className="shell">
            <div className={styles.sectionHeader}>
              <p className="kicker">{isEn ? "BUILT FOR BUSINESS" : "DIBANGUN UNTUK BISNIS"}</p>
              <h2 className={styles.sectionHeading}>
                {isEn ? "Designed to eliminate operational friction." : "Dirancang untuk mengatasi hambatan operasional nyata."}
              </h2>
              <p className={styles.sectionLead}>
                {isEn
                  ? "We solve the everyday digital bottlenecks that slow teams down and create costly errors."
                  : "Kami menyelesaikan hambatan proses harian yang memperlambat tim dan menimbulkan kesalahan yang merugikan."}
              </p>
            </div>

            <div className={styles.problemsGrid}>
              <div className={styles.problemItem}>
                <span className={styles.problemBullet}>✕</span>
                <div>
                  <strong>{isEn ? "Manual Processes" : "Proses Serba Manual"}</strong>
                  <p>{isEn ? "Repetitive copy-pasting, handwritten logs, and manual calculations." : "Salin data berulang, pencatatan manual di kertas, dan hitungan manual rawan salah."}</p>
                </div>
              </div>

              <div className={styles.problemItem}>
                <span className={styles.problemBullet}>✕</span>
                <div>
                  <strong>{isEn ? "Disconnected Tools" : "Aplikasi Tidak Terhubung"}</strong>
                  <p>{isEn ? "Data trapped in isolated spreadsheets, WhatsApp chats, and paper files." : "Data terisolasi di spreadsheet terpisah, chat WhatsApp tercecer, dan berkas fisik."}</p>
                </div>
              </div>

              <div className={styles.problemItem}>
                <span className={styles.problemBullet}>✕</span>
                <div>
                  <strong>{isEn ? "Difficult Reporting" : "Pelaporan Lambat & Sulit"}</strong>
                  <p>{isEn ? "Owners waiting days or weeks just to know actual monthly revenue and stock." : "Pemilik harus menunggu berhari-hari untuk mengetahui omset riil dan sisa stok."}</p>
                </div>
              </div>

              <div className={styles.problemItem}>
                <span className={styles.problemBullet}>✕</span>
                <div>
                  <strong>{isEn ? "Inefficient Customer Journeys" : "Alur Pelanggan Kurang Rapi"}</strong>
                  <p>{isEn ? "Slow invoice generation, delayed payment confirmations, and lost sales leads." : "Penerbitan invoice lambat, konfirmasi transfer tertunda, dan calon pembeli terlewat."}</p>
                </div>
              </div>
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
                  {isEn ? "DIGITAL SHOULD MAKE BUSINESS SIMPLER." : "DIGITAL HARUS MEMBUAT BISNIS LEBIH SEDERHANA."}
                </div>
                <p className={styles.aboutBody}>
                  {isEn
                    ? "QIRA works with businesses to design, build, and connect practical digital solutions. We focus on pragmatic digital engineering that cuts manual friction and powers structured business growth."
                    : "QIRA bermitra dengan pelaku usaha untuk merancang, membangun, dan menghubungkan solusi digital yang praktis. Kami berfokus pada rekayasa sistem yang memangkas beban kerja manual dan mendorong pertumbuhan bisnis yang terstruktur."}
                </p>
                <div className={styles.legalNotice}>
                  <strong>{isEn ? "Business & Operational Status:" : "Status Operasional & Legal:"}</strong>
                  <p>
                    QIRA diposisikan sementara sebagai penyedia solusi digital independen dan sedang dalam proses pembentukan badan usaha CV Qira Solusi Digital.
                  </p>
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
          </div>
        </section>

        {/* =========================================================================
            SECTION 10: FINAL CTA
            ========================================================================= */}
        <section className={`${styles.finalCta} ${styles.finalCtaSection}`} id="contact">
          <div className="shell">
            <div className={styles.finalCtaCard}>
              <h2>{isEn ? "HAVE A BUSINESS PROBLEM TO SOLVE?" : "MEMILIKI TANTANGAN BISNIS?"}</h2>
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
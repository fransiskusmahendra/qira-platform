"use client";

import Link from "next/link";
import { useState } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useLanguage } from "../../lib/i18n";
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
            SECTION 01: HERO
            ========================================================================= */}
        <section className={styles.heroSection}>
          <div className="shell">
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                {/* QIRA Flow Concept Badge */}
                <div className={styles.flowBadge}>
                  <span>{isEn ? "Business Need" : "Kebutuhan Bisnis"}</span>
                  <span className={styles.flowArrow}>→</span>
                  <strong className={styles.flowQira}>QIRA</strong>
                  <span className={styles.flowArrow}>→</span>
                  <span>{isEn ? "Digital Solution" : "Solusi Digital"}</span>
                  <span className={styles.flowArrow}>→</span>
                  <span className={styles.flowGrowth}>{isEn ? "Growth" : "Pertumbuhan"}</span>
                </div>

                <h1 className={styles.heroTitle}>
                  {isEn ? "TURN BUSINESS NEEDS INTO DIGITAL SOLUTIONS." : "UBAH KEBUTUHAN BISNIS MENJADI SOLUSI DIGITAL."}
                </h1>

                <p className={styles.heroSub}>
                  {isEn
                    ? "QIRA designs, builds, and connects practical digital solutions that make business simpler."
                    : "QIRA merancang, membangun, dan menghubungkan solusi digital praktis yang mempermudah operasional bisnis."}
                </p>

                <div className={styles.heroActions}>
                  <Link href="#solutions" className="primaryButton">
                    {isEn ? "Explore Solutions" : "Jelajahi Solusi"}
                  </Link>
                  <a
                    href="https://wa.me/628211076517?text=Halo%20QIRA,%20saya%20ingin%20konsultasi%20solusi%20digital%20bisnis."
                    target="_blank"
                    rel="noreferrer"
                    className={styles.secondaryButton}
                  >
                    {isEn ? "Start a Project →" : "Mulai Proyek →"}
                  </a>
                </div>
              </div>

              {/* Product-led hero visual */}
              <div className={styles.heroMockup}>
                <div className={styles.mockupHeader}>
                  <div className={styles.mockupTitle}>
                    <span className={styles.liveDot} />
                    <span>{isEn ? "QIRA Business Command Platform" : "Pusat Kendali Operasional QIRA"}</span>
                  </div>
                  <span className={styles.mockupBadge}>v2.4 STABLE</span>
                </div>

                <div className={styles.mockupStats}>
                  <div className={styles.statBox}>
                    <small>{isEn ? "Active Solutions" : "Solusi Berjalan"}</small>
                    <strong>12 Systems</strong>
                    <span style={{ color: "#10b981", fontSize: 11 }}>● {isEn ? "100% Operational" : "100% Operasional"}</span>
                  </div>
                  <div className={styles.statBox}>
                    <small>{isEn ? "Process Efficiency" : "Efisiensi Proses"}</small>
                    <strong>+84.2%</strong>
                    <span style={{ color: "#0ea5e9", fontSize: 11 }}>{isEn ? "Manual work eliminated" : "Waktu manual dihemat"}</span>
                  </div>
                </div>

                <div className={styles.flowTrackMini}>
                  <div className={styles.trackNode}>
                    <div className={styles.trackDot}>1</div>
                    <span>{isEn ? "Input Need" : "Input Masalah"}</span>
                  </div>
                  <span className={styles.trackLine}>──────</span>
                  <div className={styles.trackNode}>
                    <div className={`${styles.trackDot} ${styles.trackDotActive}`}>2</div>
                    <span>{isEn ? "QIRA Engine" : "Engine QIRA"}</span>
                  </div>
                  <span className={styles.trackLine}>──────</span>
                  <div className={styles.trackNode}>
                    <div className={`${styles.trackDot} ${styles.trackDotDone}`}>3</div>
                    <span>{isEn ? "Active Growth" : "Pertumbuhan"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 02: HOW WE HELP (01 BUILD • 02 CONNECT • 03 GROW)
            ========================================================================= */}
        <section className={styles.sectionPadding} id="solutions">
          <div className="shell">
            <div className={styles.sectionHeader}>
              <p className="kicker">{isEn ? "HOW WE HELP" : "BAGAIMANA KAMI MEMBANTU"}</p>
              <h2 className={styles.sectionHeading}>
                {isEn ? "From business challenges to practical digital solutions." : "Dari tantangan bisnis menjadi solusi digital yang praktis."}
              </h2>
              <p className={styles.sectionLead}>
                {isEn
                  ? "We do not offer generic agency packages. We engineer digital foundations, connect workflows, and scale operations."
                  : "Kami tidak menjual template generik. Kami merancang pondasi sistem digital, menghubungkan alur kerja, dan melipatgandakan efisiensi tim."}
              </p>
            </div>

            <div className={styles.helpGrid}>
              {/* 01 — BUILD */}
              <div className={styles.helpCard}>
                <div>
                  <div className={styles.cardNum}>01 — BUILD</div>
                  <h3>{isEn ? "Digital Foundations" : "Pondasi Digital"}</h3>
                  <p>
                    {isEn
                      ? "Custom web applications, dedicated operational tools, and tailored business systems engineered for reliability and usability."
                      : "Aplikasi web khusus, perangkat operasional internal, dan sistem bisnis yang andal, cepat, dan mudah diadopsi oleh tim."}
                  </p>
                </div>
                <ul className={styles.featureList}>
                  <li>{isEn ? "Web applications & internal tools" : "Aplikasi web & portal operasional tim"}</li>
                  <li>{isEn ? "Digital workflows & document automation" : "Workflow digital & otomasi dokumen"}</li>
                  <li>{isEn ? "Integrated business systems" : "Sistem manajemen bisnis terintegrasi"}</li>
                </ul>
              </div>

              {/* 02 — CONNECT */}
              <div className={styles.helpCard}>
                <div>
                  <div className={styles.cardNum}>02 — CONNECT</div>
                  <h3>{isEn ? "Systems & Partnerships" : "Integrasi Sistem & Kemitraan"}</h3>
                  <p>
                    {isEn
                      ? "Eliminate data silos. Seamlessly connect your disparate tools, APIs, accounting software, and external business partners."
                      : "Hilangkan isolasi data antar software. Hubungkan aplikasi internal, API pihak ketiga, pembukuan, dan mitra B2B Anda."}
                  </p>
                </div>
                <ul className={styles.featureList}>
                  <li>{isEn ? "API development & data sync" : "Pengembangan API & sinkronisasi data"}</li>
                  <li>{isEn ? "Connected B2B / B2B2C pipelines" : "Pipeline B2B / B2B2C terhubung"}</li>
                  <li>{isEn ? "Cross-platform workflow automation" : "Otomasi alur kerja lintas platform"}</li>
                </ul>
              </div>

              {/* 03 — GROW */}
              <div className={styles.helpCard}>
                <div>
                  <div className={styles.cardNum}>03 — GROW</div>
                  <h3>{isEn ? "Digital Growth" : "Pertumbuhan Digital"}</h3>
                  <p>
                    {isEn
                      ? "Automated customer journeys, intelligent business dashboards, and scalable operations that multiply team productivity."
                      : "Otomasi perjalanan pelanggan, dashboard analitik eksekutif, dan efisiensi operasional yang memacu akselerasi profit bisnis."}
                  </p>
                </div>
                <ul className={styles.featureList}>
                  <li>{isEn ? "Intelligent automation & reporting" : "Otomasi cerdas & pelaporan rutin"}</li>
                  <li>{isEn ? "Executive KPI command centers" : "Command center KPI untuk pemilik"}</li>
                  <li>{isEn ? "Optimized conversion journeys" : "Optimasi konversi pelanggan"}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 03: PRODUCTS / SOLUTIONS (BUILT BY QIRA)
            ========================================================================= */}
        <section className={styles.sectionPadding} id="products">
          <div className="shell">
            <div className={styles.sectionHeader}>
              <p className="kicker">{isEn ? "BUILT BY QIRA" : "DIBANGUN OLEH QIRA"}</p>
              <h2 className={styles.sectionHeading}>
                {isEn ? "Digital solutions designed around real business needs." : "Solusi digital yang dirancang menjawab kebutuhan nyata bisnis."}
              </h2>
              <p className={styles.sectionLead}>
                {isEn
                  ? "Practical, proven solutions built and deployed for real operational challenges."
                  : "Solusi terbukti yang dibangun dan diimplementasikan langsung untuk mengatasi kendala lapangan."}
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
                      ? "Digital invoicing made simple. Generate professional invoices, automate client reminders via WhatsApp, and track payment receipts in real time."
                      : "Faktur digital yang ringkas dan otomatis. Buat tagihan profesional, kirim pengingat WhatsApp otomatis, dan pantau status pelunasan seketika."}
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
                      ? "Lightweight cloud point-of-sale engineered for multi-sku trade and building material retail. Zero stock mismatch and live cloud receipts."
                      : "Sistem kasir cloud cepat untuk toko bahan bangunan dan distributor. Nol selisih stok fisik, multi-satuan, dan struk digital instan."}
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
              <p className="kicker">{isEn ? "QIRA FLOW" : "QIRA FLOW"}</p>
              <h2 className={styles.sectionHeading}>{isEn ? "FROM NEED TO SOLUTION" : "DARI KEBUTUHAN MENJADI SOLUSI"}</h2>
              <p className={styles.sectionLead} style={{ margin: "0 auto" }}>
                {isEn
                  ? "A disciplined, end-to-end pathway that turns business complexity into measurable results."
                  : "Tahapan terstruktur dan elegan yang mengubah kerumitan bisnis menjadi hasil nyata yang terukur."}
              </p>
            </div>

            <div className={styles.flowTimeline}>
              <div className={styles.flowStep}>
                <div className={styles.stepCircle}>01</div>
                <strong>{isEn ? "Business Need" : "Kebutuhan Bisnis"}</strong>
                <small>{isEn ? "Operational bottleneck or opportunity identified." : "Identifikasi kendala atau peluang digital."}</small>
              </div>

              <div className={styles.flowStep}>
                <div className={styles.stepCircle}>02</div>
                <strong>{isEn ? "Understand" : "Pemahaman"}</strong>
                <small>{isEn ? "Deep assessment of workflows & constraints." : "Analisis mendalam alur proses & kendala."}</small>
              </div>

              <div className={styles.flowStep}>
                <div className={styles.stepCircle}>03</div>
                <strong>{isEn ? "Design" : "Perancangan"}</strong>
                <small>{isEn ? "Intuitive UX architecture with zero clutter." : "Arsitektur UX bersih tanpa kerumitan."}</small>
              </div>

              <div className={styles.flowStep}>
                <div className={styles.stepCircle}>04</div>
                <strong>{isEn ? "Build" : "Pembangunan"}</strong>
                <small>{isEn ? "Modular, secure, high-performance software." : "Software modular, cepat, dan teruji."}</small>
              </div>

              <div className={styles.flowStep}>
                <div className={styles.stepCircle}>05</div>
                <strong>{isEn ? "Connect" : "Penghubungan"}</strong>
                <small>{isEn ? "Data synchronization across business tools." : "Integrasi data mulus antar software."}</small>
              </div>

              <div className={styles.flowStep}>
                <div className={styles.stepCircle}>06</div>
                <strong>{isEn ? "Growth" : "Pertumbuhan"}</strong>
                <small>{isEn ? "Scalable operations, reduced costs, clarity." : "Operasional terskala, biaya terpangkas."}</small>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 05: CASE STUDIES & BEFORE ↔ AFTER INTERACTIVE SLIDER
            ========================================================================= */}
        <section className={styles.sectionPadding} id="case-studies">
          <div className="shell">
            <div className={styles.sectionHeader}>
              <p className="kicker">{isEn ? "CASE STUDIES" : "STUDI KASUS"}</p>
              <h2 className={styles.sectionHeading}>{isEn ? "FROM COMPLEXITY TO SIMPLICITY" : "DARI KERUMITAN MENJADI KEMUDAHAN"}</h2>
              <p className={styles.sectionLead}>
                {isEn
                  ? "Real case studies demonstrating practical digital transformation for operational teams."
                  : "Studi kasus nyata implementasi transformasi digital praktis pada operasional klien."}
              </p>
            </div>

            {/* Case 1: Maduratna Retail POS */}
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
              <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
                {isEn
                  ? "Transformed a multi-step manual course registration and certification process into an automated sales and participant pipeline for logistics and supply chain professionals."
                  : "Mentransformasikan proses pendaftaran pelatihan dan sertifikasi logistik & supply chain yang sebelumnya manual menjadi satu pipeline digital otomatis."}
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 06: HOW WE WORK (4 STAGES)
            ========================================================================= */}
        <section className={styles.sectionPadding} id="how-we-work">
          <div className="shell">
            <div className={styles.sectionHeader}>
              <p className="kicker">{isEn ? "HOW WE WORK" : "CARA KERJA KAMI"}</p>
              <h2 className={styles.sectionHeading}>DISCOVER → DESIGN → BUILD → IMPROVE</h2>
              <p className={styles.sectionLead}>
                {isEn
                  ? "A structured approach ensuring every digital solution solves a genuine business problem without disrupting day-to-day operations."
                  : "Pendekatan sistematis memastikan setiap solusi digital menyelesaikan masalah nyata tanpa mengganggu operasional harian."}
              </p>
            </div>

            <div className={styles.workGrid}>
              <div className={styles.workCard}>
                <div className={styles.workNum}>STAGE 01</div>
                <h3>DISCOVER</h3>
                <p>
                  {isEn
                    ? "Deeply assess the current business bottlenecks, manual steps, user personas, and operational requirements."
                    : "Memahami akar masalah bisnis, alur manual, kebutuhan pengguna, dan target operasional."}
                </p>
              </div>

              <div className={styles.workCard}>
                <div className={styles.workNum}>STAGE 02</div>
                <h3>DESIGN</h3>
                <p>
                  {isEn
                    ? "Turn complex requirements into clean architectures, intuitive user flows, and practical interface wireframes."
                    : "Menerjemahkan kebutuhan menjadi arsitektur sistem, alur sederhana, dan antarmuka intuitif."}
                </p>
              </div>

              <div className={styles.workCard}>
                <div className={styles.workNum}>STAGE 03</div>
                <h3>BUILD</h3>
                <p>
                  {isEn
                    ? "Develop high-reliability software, integrate existing databases and APIs, and execute rigorous real-world testing."
                    : "Membangun sistem yang handal, menghubungkan database & API, serta pengujian lapangan yang ketat."}
                </p>
              </div>

              <div className={styles.workCard}>
                <div className={styles.workNum}>STAGE 04</div>
                <h3>IMPROVE</h3>
                <p>
                  {isEn
                    ? "Measure tangible business impact, provide continuous system support, and evolve features as your business scales."
                    : "Mengukur dampak efisiensi bisnis, memberikan pendampingan berkelanjutan, dan adaptasi fitur lanjutan."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 07: BUSINESS / INDUSTRIES
            ========================================================================= */}
        <section className={styles.sectionPadding} id="industries">
          <div className="shell">
            <div className={styles.sectionHeader}>
              <p className="kicker">{isEn ? "BUILT FOR BUSINESS" : "DIBANGUN UNTUK BISNIS"}</p>
              <h2 className={styles.sectionHeading}>
                {isEn ? "Whether you're digitizing one process or connecting an entire operation." : "Baik untuk digitalisasi satu proses maupun menghubungkan seluruh operasional."}
              </h2>
              <p className={styles.sectionLead}>
                {isEn
                  ? "QIRA solutions are engineered to adapt to industry-specific operational realities."
                  : "Solusi QIRA dirancang adaptif terhadap kebutuhan spesifik masing-masing sektor industri."}
              </p>
            </div>

            <div className={styles.indGrid}>
              <div className={styles.indCard}>
                <div className={styles.indIcon}>🏬</div>
                <h3>{isEn ? "Retail & Distribution" : "Retail & Distribusi"}</h3>
                <p>{isEn ? "Multi-SKU inventory, lightweight web POS, wholesale price tiers, and digital billing." : "Manajemen ribuan SKU, kasir cloud kilat, tiering harga grosir, dan faktur digital."}</p>
              </div>

              <div className={styles.indCard}>
                <div className={styles.indIcon}>🎓</div>
                <h3>{isEn ? "Education & Training" : "Pendidikan & Pelatihan"}</h3>
                <p>{isEn ? "End-to-end digital sales portals, automated enrollment verification, and cohort reporting." : "Portal pendaftaran online, verifikasi pembayaran otomatis, dan rekap peserta sertifikasi."}</p>
              </div>

              <div className={styles.indCard}>
                <div className={styles.indIcon}>🛡️</div>
                <h3>{isEn ? "Insurance & Services" : "Asuransi & Jasa"}</h3>
                <p>{isEn ? "Structured claims processing, operational ticket workflows, and customer self-service portals." : "Pengajuan klaim terstruktur, manajemen tiket operasional, dan portal layanan mandiri."}</p>
              </div>

              <div className={styles.indCard}>
                <div className={styles.indIcon}>🏢</div>
                <h3>{isEn ? "Growing Enterprises & SMEs" : "UMKM & Korporasi Bertumbuh"}</h3>
                <p>{isEn ? "Unified operational dashboards, cross-department data sync, and automated internal workflows." : "Dashboard kendali operasional terpadu, sinkronisasi data lintas divisi, dan otomasi alur kerja."}</p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 08: ABOUT QIRA
            ========================================================================= */}
        <section className={styles.sectionPadding} id="about">
          <div className="shell">
            <div className={styles.aboutBox}>
              <div>
                <p className="kicker">{isEn ? "ABOUT QIRA" : "TENTANG QIRA"}</p>
                <div className={styles.aboutQuote}>
                  {isEn ? "\"Technology is only useful when it solves a real problem.\"" : "\"Teknologi hanya bernilai ketika memecahkan masalah yang nyata.\""}
                </div>
                <p className={styles.aboutBody}>
                  {isEn
                    ? "QIRA works alongside businesses to design, build, and connect practical digital solutions. We focus on pragmatic digital engineering that cuts manual friction and powers measurable business growth."
                    : "QIRA bermitra dengan pelaku usaha untuk merancang, membangun, dan menghubungkan solusi digital yang praktis. Kami fokus pada rekayasa digital terukur yang memangkas beban kerja manual dan mendorong pertumbuhan bisnis nyata."}
                </p>
                <a href="https://wa.me/628211076517" target="_blank" rel="noreferrer" className={styles.aboutLink}>
                  {isEn ? "About QIRA →" : "Tentang QIRA →"}
                </a>
              </div>

              <div className={styles.aboutMeta}>
                <strong>QIRA Automation & System Solution</strong>
                <span>A Business Unit of PT. Rays Solusi Informasi</span>
                <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
                  Grand Slipi Tower 16th Floor<br />
                  Jakarta Barat, DKI Jakarta<br />
                  hello@myqira.io • +62 821-1076-517
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 09: FINAL CTA
            ========================================================================= */}
        <section className={styles.finalCta} id="contact">
          <div className="shell">
            <div className={styles.finalCtaCard}>
              <h2>{isEn ? "HAVE A BUSINESS CHALLENGE?" : "MEMILIKI TANTANGAN BISNIS?"}</h2>
              <p>{isEn ? "Let's turn it into a practical digital solution." : "Mari kita ubah menjadi solusi digital yang praktis."}</p>
              <a
                href="https://wa.me/628211076517?text=Halo%20QIRA,%20saya%20ingin%20berdiskusi%20tentang%20solusi%20digital."
                target="_blank"
                rel="noreferrer"
                className="primaryButton"
                style={{ padding: "0 34px", minHeight: 52 }}
              >
                {isEn ? "Start a Conversation →" : "Mulai Diskusi →"}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
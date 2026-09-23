"use client";

import Link from "next/link";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useLanguage } from "../../lib/i18n";
import { DigitalSphereCanvas } from "./DigitalSphereCanvas";
import styles from "./QiraFlowHome.module.css";

export function HomePageClient() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  return (
    <>
      <Navbar />

      <main className={styles.pageWrap}>
        {/* Persistent Floating Background Canvas (Fixed Ambient across scroll) */}
        <div className={styles.fixedBackgroundLayer} aria-hidden="true">
          <div className={styles.heroGridBackdrop} />
          <div className={styles.ambientGlowCentral} />
          <div className={styles.sphereContainer}>
            <DigitalSphereCanvas />
          </div>
        </div>

        {/* =========================================================================
            SECTION 01: HERO (LUMINOUS 3D SPHERE CORE + ULTRA-CLEAN EDITORIAL)
            ========================================================================= */}
        <section className={styles.heroSection}>
          <div className={`shell ${styles.heroCenteredContent}`}>
            <h1 className={styles.heroTitleCentered}>
              <span>{isEn ? "Streamline Workflows." : "Sederhanakan Alur Kerja."}</span>
              <span>{isEn ? "Automate Operations." : "Otomatiskan Operasional."}</span>
            </h1>

            <p className={styles.heroSubCentered}>
              {isEn
                ? "Purpose-built software for growing businesses—fast to deploy, error-free, and easy for your team to use."
                : "Sistem digital yang dibangun khusus untuk bisnis berkembang—cepat diakses, minim kesalahan, dan mudah digunakan seluruh staf."}
            </p>

            <div className={styles.heroActionsCentered}>
              <a
                href="https://wa.me/628211076517?text=Halo%20QIRA,%20saya%20ingin%20konsultasi%20solusi%20digital%20bisnis."
                target="_blank"
                rel="noreferrer"
                className={styles.pillCtaPrimary}
              >
                <span>{isEn ? "Start Consultation" : "Mulai Konsultasi"}</span>
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
                  : "Software andal yang menghubungkan alur kerja dan mempermudah operasional harian."}
              </p>
            </div>

            <div className={styles.helpGrid}>
              {/* Category 1: Digital Foundation */}
              <div className={styles.helpCard}>
                <div>
                  <div className={styles.cardNum}>01 — FOUNDATION</div>
                  <h3>Digital Foundation</h3>
                </div>
                <ul className={styles.featureList}>
                  <li>{isEn ? "Web applications & internal tools" : "Aplikasi web & portal operasional tim"}</li>
                  <li>{isEn ? "Structured digital forms & data intake" : "Formulir digital & pendataan terstruktur"}</li>
                  <li>{isEn ? "Operational dashboards & management visibility" : "Dashboard operasional & pantau performa real-time"}</li>
                </ul>
              </div>

              {/* Category 2: Growth Engine */}
              <div className={styles.helpCard}>
                <div>
                  <div className={styles.cardNum}>02 — GROWTH ENGINE</div>
                  <h3>Growth Engine</h3>
                </div>
                <ul className={styles.featureList}>
                  <li>{isEn ? "Automated customer communication" : "Komunikasi & respon pelanggan otomatis"}</li>
                  <li>{isEn ? "Transaction processing & receipt generation" : "Pemrosesan transaksi & pembuatan struk instan"}</li>
                  <li>{isEn ? "Document & approval workflows" : "Workflow persetujuan & otomasi dokumen"}</li>
                </ul>
              </div>

              {/* Category 3: Connected Growth */}
              <div className={styles.helpCard}>
                <div>
                  <div className={styles.cardNum}>03 — CONNECTED GROWTH</div>
                  <h3>Connected Growth</h3>
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
            SECTION 03: BUILT BY QIRA (PROVEN SYSTEMS SHOWCASE)
            ========================================================================= */}
        <section className={`${styles.sectionPadding} ${styles.productsSection}`} id="products">
          <div className="shell">
            <div className={styles.sectionHeader}>
              <p className="kicker">{isEn ? "SELECTED SYSTEMS" : "SISTEM UNGGULAN"}</p>
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
                  <span className={styles.productBadge}>PRODUCT SYSTEM</span>
                  <h3>QIRA Invoice</h3>
                  <p>
                    {isEn
                      ? "Automated digital invoicing built for growing businesses to get paid on time."
                      : "Sistem invoice otomatis agar pembayaran dari klien tepat waktu."}
                  </p>

                  <div className={styles.flowPills}>
                    <span className={styles.pill}>Create</span>
                    <span className={styles.pillArrow}>→</span>
                    <span className={styles.pill}>Manage</span>
                    <span className={styles.pillArrow}>→</span>
                    <span className={styles.pill}>Track</span>
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
                      <span className={styles.tagPaid}>{isEn ? "PAID" : "LUNAS"}</span>
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
                      <span style={{ color: "#10b981" }}>✓</span> {isEn ? "Auto-sent via WhatsApp & Cloud Record" : "Terkirim otomatis via WhatsApp & Cloud"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product 2: QIRA Retail & POS System */}
              <div className={styles.productRow}>
                <div className={styles.productInfo}>
                  <span className={styles.productBadge}>OPERATIONAL SUITE</span>
                  <h3>QIRA Retail & POS System</h3>
                  <p>
                    {isEn
                      ? "Cloud POS and multi-outlet inventory system engineered for retail and distributors."
                      : "Aplikasi POS cloud dan manajemen stok multi-cabang untuk toko ritel dan distributor."}
                  </p>

                  <div className={styles.flowPills}>
                    <span className={styles.pill}>Fast Checkout</span>
                    <span className={styles.pillArrow}>→</span>
                    <span className={styles.pill}>Real-Time Stock</span>
                    <span className={styles.pillArrow}>→</span>
                    <span className={styles.pill}>Owner Dashboard</span>
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
                      <strong>Multi-Warehouse Inventory</strong>
                      <span style={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}>● Live Sync</span>
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
                      ⚡ {isEn ? "Auto-deducts instantly on cashier register" : "Stok otomatis terpotong saat kasir input transaksi"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Linear-style Action to Explore Full Work */}
            <div style={{ textAlign: "center", marginTop: 44 }}>
              <Link href="/portfolio" className={styles.secondaryButtonPill}>
                {isEn ? "Explore All Work & Deployments →" : "Lihat Semua Karya & Penerapan →"}
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 04: FINAL CALL TO ACTION (CLEAN & MINIMALIST)
            ========================================================================= */}
        <section className={`${styles.finalCta} ${styles.finalCtaSection}`} id="contact">
          <div className="shell">
            <div className={styles.finalCtaCard}>
              <h2>{isEn ? "Have a business problem to solve?" : "Punya tantangan bisnis yang ingin diselesaikan?"}</h2>
              <p>{isEn ? "Let's turn it into a practical digital solution." : "Mari kita ubah menjadi solusi digital yang praktis."}</p>
              
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: 8 }}>
                <a
                  href="https://wa.me/628211076517?text=Halo%20QIRA,%20saya%20ingin%20berdiskusi%20tentang%20solusi%20digital."
                  target="_blank"
                  rel="noreferrer"
                  className="primaryButton"
                  style={{ padding: "0 34px", minHeight: 52 }}
                >
                  {isEn ? "Start Consultation →" : "Mulai Diskusi →"}
                </a>
                <Link
                  href="/harga"
                  className={styles.secondaryButtonPill}
                  style={{ minHeight: 52, padding: "0 28px" }}
                >
                  {isEn ? "View Pricing & Plans" : "Lihat Rincian Paket & Biaya"}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
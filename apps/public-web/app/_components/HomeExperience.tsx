"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { trackConversion } from "./ConversionTracker";

const TRANSFORMATION_STEPS = [
  { label: "Masalah", detail: "Chat, file, dan pekerjaan tercecer" },
  { label: "QIRA", detail: "Solusi digital sesuai kebutuhan" },
  { label: "Hasil", detail: "Kerja lebih rapi dan mudah dijalankan" },
] as const;

const SOLUTIONS = [
  {
    number: "01",
    problem: "Sulit ditemukan",
    question: "Pelanggan sulit menemukan atau memahami usahamu?",
    solution: "Website",
    result: "Lebih mudah ditemukan dan dihubungi",
    image: "/illustrations/visual/qira-what.webp",
    imagePosition: "left",
  },
  {
    number: "02",
    problem: "Pekerjaan tercecer",
    question: "Data masih tersebar di chat, catatan, dan file?",
    solution: "Business tool",
    result: "Data lebih rapi dan mudah dipantau",
    image: "/illustrations/visual/qira-problems.webp",
    imagePosition: "right",
  },
  {
    number: "03",
    problem: "Tugas berulang",
    question: "Sering menginput atau mengingatkan hal yang sama?",
    solution: "Automation",
    result: "Proses lebih cepat dan hemat waktu",
    image: "/illustrations/visual/qira-offerings.webp",
    imagePosition: "left",
  },
  {
    number: "04",
    problem: "Bingung mulai",
    question: "Ingin lebih digital, tetapi belum tahu prioritasnya?",
    solution: "Discovery",
    result: "Punya arah dan langkah yang jelas",
    image: "/illustrations/visual/qira-benefits.webp",
    imagePosition: "right",
  },
] as const;

const EXAMPLES = [
  {
    label: "Bisnis jasa",
    title: "Dari informasi tersebar menjadi satu pintu.",
    items: ["Website yang jelas", "Form kebutuhan", "Follow-up terarah"],
    result: "Pelanggan lebih cepat paham dan menghubungi.",
  },
  {
    label: "Administrasi",
    title: "Dari catatan manual menjadi alur yang rapi.",
    items: ["Form digital", "Dokumen otomatis", "Dashboard sederhana"],
    result: "Data mudah dicari dan pekerjaan mudah dipantau.",
  },
  {
    label: "Operasional",
    title: "Dari pengingat manual menjadi proses otomatis.",
    items: ["Status pekerjaan", "Pengingat otomatis", "Laporan ringkas"],
    result: "Lebih sedikit tugas berulang dan terlupa.",
  },
] as const;

export function HeroExplainer() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % TRANSFORMATION_STEPS.length), 2200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="heroExplainer" aria-label="Alur QIRA dari masalah menjadi hasil">
      <figure className="visualStoryCard heroExplainerImage">
        <Image
          src="/illustrations/visual/qira-hero.webp"
          alt="Masalah bisnis yang berantakan dirapikan QIRA menjadi website, dashboard, alur otomatis, dan laporan"
          width={960}
          height={540}
          priority
          sizes="(max-width: 960px) 100vw, 58vw"
        />
      </figure>
      <ol className="heroSteps">
        {TRANSFORMATION_STEPS.map((step, index) => (
          <li className={active === index ? "active" : ""} key={step.label}>
            <button type="button" onClick={() => { setActive(index); void trackConversion("hero_explainer_interact"); }} aria-pressed={active === index}>
              <span>{index + 1}</span>
              <strong>{step.label}</strong>
              <small>{step.detail}</small>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function SolutionExplorer() {
  const [active, setActive] = useState(0);
  const selected = SOLUTIONS[active];

  return (
    <div className="solutionExplorer">
      <div className="solutionTabs" role="tablist" aria-label="Masalah bisnis yang dapat dibantu QIRA">
        {SOLUTIONS.map((item, index) => (
          <button
            aria-controls="solution-panel"
            aria-selected={active === index}
            className={active === index ? "active" : ""}
            id={`solution-tab-${index}`}
            key={item.problem}
            onClick={() => { setActive(index); void trackConversion("solution_explore"); }}
            role="tab"
            type="button"
          >
            <span>{item.number}</span>{item.problem}
          </button>
        ))}
      </div>
      <div className="solutionPanel" id="solution-panel" role="tabpanel" aria-labelledby={`solution-tab-${active}`}>
        <div className="solutionCopy" key={selected.problem}>
          <p className="solutionProblem">Masalah</p>
          <h3>{selected.question}</h3>
          <div className="solutionFlow" aria-label={`${selected.problem}, ditangani dengan ${selected.solution}, menghasilkan ${selected.result}`}>
            <span><small>QIRA membuat</small><strong>{selected.solution}</strong></span>
            <i aria-hidden="true">→</i>
            <span><small>Hasil</small><strong>{selected.result}</strong></span>
          </div>
          <Link href="/coba-masalah" data-conversion="homepage_cta_click">Bahas masalah ini →</Link>
        </div>
        <figure className={`solutionVisual crop-${selected.imagePosition}`} key={`${selected.problem}-image`}>
          <Image src={selected.image} alt="" fill sizes="(max-width: 760px) 100vw, 46vw" />
        </figure>
      </div>
    </div>
  );
}

export function BeforeAfter() {
  const [position, setPosition] = useState(50);
  return (
    <div className="beforeAfter">
      <div className="beforeAfterStage">
        <Image src="/illustrations/visual/qira-beforeafter.webp" alt="Perbandingan bisnis sebelum dan sesudah menggunakan QIRA" fill sizes="(max-width: 760px) 100vw, 1160px" />
        <div className="beforeAfterShade beforeShade" style={{ width: `${position}%` }} aria-hidden="true" />
        <div className="beforeAfterDivider" style={{ left: `${position}%` }} aria-hidden="true"><span>↔</span></div>
        <span className="stateLabel beforeLabel">Sebelum</span>
        <span className="stateLabel afterLabel">Dengan QIRA</span>
      </div>
      <label className="beforeAfterControl">
        <span>Geser untuk membandingkan</span>
        <input aria-label="Bandingkan kondisi sebelum dan sesudah QIRA" type="range" min="18" max="82" value={position} onChange={(event) => { setPosition(Number(event.target.value)); void trackConversion("before_after_interact"); }} />
      </label>
      <div className="outcomeStrip">
        <span>Data lebih rapi</span><span>Respons lebih cepat</span><span>Pekerjaan mudah dipantau</span>
      </div>
    </div>
  );
}

export function ApplicationShowcase() {
  const [active, setActive] = useState(0);
  const selected = EXAMPLES[active];
  return (
    <div className="applicationShowcase">
      <div className="applicationTabs" role="tablist" aria-label="Contoh penerapan QIRA">
        {EXAMPLES.map((item, index) => (
          <button className={active === index ? "active" : ""} aria-selected={active === index} key={item.label} onClick={() => { setActive(index); void trackConversion("application_example_interact"); }} role="tab" type="button">{item.label}</button>
        ))}
      </div>
      <div className="applicationCard" role="tabpanel" key={selected.label}>
        <div>
          <p className="kicker">{selected.label}</p>
          <h3>{selected.title}</h3>
          <p>{selected.result}</p>
          <Link href="/contoh-penerapan" data-conversion="homepage_cta_click">Lihat contoh lainnya →</Link>
        </div>
        <ol>{selected.items.map((item, index) => <li key={item}><span>{index + 1}</span>{item}</li>)}</ol>
      </div>
    </div>
  );
}

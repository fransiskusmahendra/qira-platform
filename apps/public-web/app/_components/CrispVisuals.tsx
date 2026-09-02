import Image from "next/image";

type IconName = "chat" | "web" | "chart" | "bolt" | "search" | "check" | "file" | "bell";

function LineIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    chat: <><path d="M5 6h14v9H9l-4 3V6Z" /><path d="M9 10h6M9 13h4" /></>,
    web: <><rect x="4" y="5" width="16" height="14" rx="2" /><path d="M4 9h16M8 7h.01M11 7h.01" /></>,
    chart: <><path d="M5 19V6M5 19h15" /><path d="m8 15 3-4 3 2 4-6" /></>,
    bolt: <path d="m13 3-7 11h6l-1 7 7-11h-6l1-7Z" />,
    search: <><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
    file: <><path d="M7 3h7l4 4v14H7V3Z" /><path d="M14 3v5h5M10 13h5M10 17h5" /></>,
    bell: <><path d="M6 17h12l-2-3V9a4 4 0 0 0-8 0v5l-2 3Z" /><path d="M10 20h4" /></>,
  }
  return <svg className="lineIcon" viewBox="0 0 24 24" aria-hidden="true"><g>{paths[name]}</g></svg>;
}

export function HeroArtwork() {
  return (
    <div className="premiumArtwork heroPremiumArtwork">
      <Image src="/illustrations/premium/qira-hero-premium.webp" alt="Pemilik usaha mengubah pekerjaan yang tersebar menjadi sistem digital yang terhubung dan rapi" width={1672} height={941} quality={90} priority sizes="(max-width: 960px) 100vw, 58vw" />
    </div>
  );
}

export function WhatArtwork({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`premiumArtwork${compact ? " compactVisual" : ""}`}>
      <Image src="/illustrations/premium/qira-outcomes-premium.webp" alt="Alur digital dari website usaha menuju dashboard yang rapi dan otomatisasi" width={1672} height={941} quality={90} sizes="(max-width: 760px) 100vw, 1160px" />
    </div>
  );
}

export function BenefitsArtwork() {
  return <div className="premiumArtwork"><Image src="/illustrations/premium/qira-benefits-premium.webp" alt="Empat manfaat bisnis digital: mudah ditemukan, data rapi, hemat waktu, dan arah yang jelas" width={1672} height={941} quality={90} sizes="(max-width: 760px) 100vw, 1160px" /></div>;
}

export function SolutionArtwork({ kind }: { kind: string }) {
  const map: Record<string, { icon: IconName; title: string; rows: string[] }> = {
    "Sulit ditemukan": { icon: "web", title: "Website usaha", rows: ["Layanan yang jelas", "Mudah dihubungi", "Tampil profesional"] },
    "Pekerjaan tercecer": { icon: "file", title: "Satu dashboard", rows: ["Data terkumpul", "Status terpantau", "File mudah dicari"] },
    "Tugas berulang": { icon: "bell", title: "Alur otomatis", rows: ["Form diterima", "Notifikasi dikirim", "Laporan dibuat"] },
    "Bingung mulai": { icon: "search", title: "Peta prioritas", rows: ["Masalah dipetakan", "Solusi dipilih", "Langkah disusun"] },
  };
  const item = map[kind] ?? map["Sulit ditemukan"];
  return <div className="solutionArtwork" role="img" aria-label={item.title}><div className="solutionWindow"><div className="windowBar"><i/><i/><i/><span>{item.title}</span></div><div className="solutionWindowBody"><div className="solutionIcon"><LineIcon name={item.icon}/></div>{item.rows.map((row,index)=><div className="solutionRow" key={row}><span>{index+1}</span><strong>{row}</strong><b>✓</b></div>)}</div></div></div>;
}

export function BeforeAfterArtwork() {
  return <div className="beforeAfterArtwork" role="img" aria-label="Perbandingan pekerjaan yang tersebar dengan alur QIRA yang teratur"><div className="messySide"><span className="floatNote n1">Chat</span><span className="floatNote n2">File</span><span className="floatNote n3">Catatan</span><span className="floatNote n4">Status?</span></div><div className="organizedSide"><div className="organizedHeader"><LineIcon name="check"/><strong>Alur kerja QIRA</strong></div><div className="organizedRows"><span><i/>Permintaan masuk<b>✓</b></span><span><i/>Pekerjaan diproses<b>✓</b></span><span><i/>Status diperbarui<b>✓</b></span><span><i/>Laporan siap<b>✓</b></span></div></div></div>;
}

export function JourneyArtwork({ steps }: { steps: readonly string[] }) {
  return <div className="journeyArtwork" role="img" aria-label={`Alur ${steps.join(", lalu ")}`}><div className="journeyTop"><span>Q</span><strong>Alur digital yang rapi</strong></div><div className="journeySteps">{steps.map((step,index)=><div className="journeyStep" key={step}><b>{index+1}</b><span>{step}</span><i>✓</i></div>)}</div><div className="journeyProgress"><i/><i/><i/></div></div>;
}

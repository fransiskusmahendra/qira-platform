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
    <div className="crispVisual heroArtwork" role="img" aria-label="QIRA merapikan informasi, proses, dan laporan bisnis dalam satu alur digital">
      <div className="visualNoise noiseLeft"><LineIcon name="chat" /><span>Pesan masuk</span></div>
      <div className="visualNoise noiseTop"><LineIcon name="file" /><span>Data tersebar</span></div>
      <div className="flowLine lineOne" />
      <div className="flowLine lineTwo" />
      <div className="qiraCore"><span>Q</span><strong>QIRA</strong><small>Merapikan alur</small></div>
      <div className="flowLine lineThree" />
      <div className="resultWindow">
        <div className="windowBar"><i /><i /><i /><span>Dashboard usaha</span></div>
        <div className="metricRow"><div><small>Pelanggan</small><strong>128</strong></div><div><small>Selesai</small><strong>92%</strong></div></div>
        <div className="miniChart"><i /><i /><i /><i /><i /></div>
      </div>
      <div className="resultBadge"><LineIcon name="check" /><span>Lebih rapi</span></div>
    </div>
  );
}

export function WhatArtwork({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`crispVisual whatArtwork${compact ? " compactVisual" : ""}`} role="img" aria-label="Tiga hasil QIRA: usaha terlihat, pekerjaan rapi, dan tugas otomatis">
      <div className="visualColumn"><span className="stepDot">1</span><strong>Terlihat</strong><div className="browserMock"><LineIcon name="web" /><i /><i /><i /></div><small>Pelanggan mudah memahami usahamu</small></div>
      <span className="visualArrow">→</span>
      <div className="visualColumn"><span className="stepDot">2</span><strong>Rapi</strong><div className="dashboardMock"><LineIcon name="chart" /><b /><b /><b /></div><small>Data dan pekerjaan mudah dipantau</small></div>
      <span className="visualArrow">→</span>
      <div className="visualColumn"><span className="stepDot">3</span><strong>Otomatis</strong><div className="automationMock"><LineIcon name="bolt" /><i /><i /></div><small>Tugas berulang berjalan sendiri</small></div>
    </div>
  );
}

export function BenefitsArtwork() {
  const items: Array<[IconName, string, string]> = [
    ["search", "Mudah ditemukan", "Informasi usaha tampil jelas"],
    ["file", "Kerja lebih rapi", "Data berada di tempatnya"],
    ["bolt", "Hemat waktu", "Proses berulang diotomatisasi"],
    ["chart", "Langkah lebih jelas", "Prioritas mudah dipantau"],
  ];
  return <div className="crispVisual benefitsArtwork" role="img" aria-label="Manfaat QIRA untuk bisnis">{items.map(([icon,title,copy])=><div className="benefitCard" key={title}><LineIcon name={icon}/><span><strong>{title}</strong><small>{copy}</small></span><b>✓</b></div>)}</div>;
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

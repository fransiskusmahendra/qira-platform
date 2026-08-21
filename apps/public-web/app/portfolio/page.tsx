import type { Metadata } from "next";
import Link from "next/link";

const PORTFOLIO_DESCRIPTION = "Lihat QIRA Products, Client Work, dan Solution Demos: solusi digital praktis untuk workflow, dokumen, discovery, dan operasional bisnis.";

export const metadata: Metadata = {
  title: "Portfolio",
  description: PORTFOLIO_DESCRIPTION,
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "QIRA Products & Work",
    description: PORTFOLIO_DESCRIPTION,
    url: "/portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QIRA Products & Work",
    description: PORTFOLIO_DESCRIPTION,
  },
};

type PortfolioItem = {
  number: string;
  tag: string;
  title: string;
  challenge: string;
  solution: string;
  result: string;
  stack: readonly string[];
  href: string | null;
  cta: string | null;
  external: boolean;
  note?: string;
};

const QIRA_PRODUCTS: readonly PortfolioItem[] = [
  {
    number: "01",
    tag: "QIRA Product · Internal Use",
    title: "QIRA Business Discovery",
    challenge: "Calon pengguna sering mengetahui masalah bisnisnya, tetapi belum tahu aplikasi atau teknologi apa yang sebenarnya dibutuhkan.",
    solution: "Flow discovery dan scoping yang digunakan QIRA untuk mengumpulkan konteks bisnis, prioritas, anggaran, dan kesiapan implementasi sebelum menyusun solusi.",
    result: "Percakapan awal menjadi lebih terstruktur dan QIRA dapat menyusun ruang lingkup solusi berdasarkan kebutuhan nyata, bukan asumsi teknologi.",
    stack: ["Discovery flow", "Qualification", "Scoping"],
    href: "/discovery",
    cta: "Coba QIRA Discovery",
    external: false,
  },
  {
    number: "02",
    tag: "QIRA Product · Internal Operations",
    title: "QIRA Invoice & Document Generator",
    challenge: "Pembuatan invoice dan dokumen operasional berulang membutuhkan format yang konsisten serta proses yang lebih cepat.",
    solution: "Tool internal QIRA untuk mengisi data transaksi, menyusun dokumen dengan format standar, dan menyiapkan output yang siap digunakan.",
    result: "Administrasi internal menjadi lebih ringkas, konsisten, dan tidak perlu mengulang penyusunan dokumen dari awal.",
    stack: ["Document automation", "Private access", "Operational tool"],
    href: null,
    cta: null,
    external: false,
    note: "Digunakan untuk operasional internal QIRA. Akses aplikasi tidak dipublikasikan.",
  },
];

const CLIENT_WORK: readonly PortfolioItem[] = [
  {
    number: "03",
    tag: "Client Solution · Operational App",
    title: "Transaction & Thermal Receipt Tool",
    challenge: "Petugas lapangan membutuhkan alur transaksi yang cepat, sederhana, dan nyaman digunakan dari perangkat mobile.",
    solution: "Aplikasi operasional ringan untuk mencatat transaksi, membentuk nota, dan mendukung proses cetak thermal dengan input seminimal mungkin.",
    result: "Alur transaksi harian menjadi lebih cepat dan konsisten tanpa membebani petugas dengan sistem yang kompleks.",
    stack: ["Mobile workflow", "Receipt generation", "Operational UX"],
    href: null,
    cta: null,
    external: false,
    note: "Detail klien, data, dan akses aplikasi tidak dipublikasikan.",
  },
];

const SOLUTION_DEMOS: readonly PortfolioItem[] = [
  {
    number: "04",
    tag: "Solution Demo · Public",
    title: "Business Solution Demo",
    challenge: "Manfaat solusi digital sering sulit dibayangkan jika hanya dijelaskan melalui proposal atau istilah teknis.",
    solution: "Demo konsep yang menyatukan problem bisnis, contoh solusi, workflow, paket, dan jalur discovery dalam pengalaman yang sederhana.",
    result: "Calon pengguna dapat memahami cara pendekatan QIRA bekerja dan melihat bentuk solusi sebelum memutuskan langkah berikutnya.",
    stack: ["Web experience", "Sales enablement", "Responsive UI"],
    href: "https://demo.qirasolution.com",
    cta: "Buka solution demo",
    external: true,
    note: "Demo konsep QIRA, bukan klaim sebagai project klien.",
  },
];

const SECTIONS = [
  {
    id: "products",
    eyebrow: "QIRA Products",
    title: "Solusi yang QIRA bangun dan gunakan sendiri.",
    copy: "Kami menggunakan teknologi yang kami tawarkan untuk merapikan proses QIRA sendiri. Produk internal ini menunjukkan bagaimana workflow sederhana dapat memberi manfaat nyata tanpa harus menjadi sistem besar.",
    items: QIRA_PRODUCTS,
  },
  {
    id: "client-work",
    eyebrow: "Client Work",
    title: "Solusi yang dibuat untuk kebutuhan operasional pengguna.",
    copy: "Untuk pekerjaan klien, QIRA menampilkan pola masalah, pendekatan, dan hasil tanpa membuka identitas, data, atau akses yang bersifat private.",
    items: CLIENT_WORK,
  },
  {
    id: "solution-demos",
    eyebrow: "Solution Demos",
    title: "Contoh konsep untuk membantu melihat solusi sebelum membangun.",
    copy: "Solution Demo adalah demonstrasi pendekatan dan pengalaman yang dikembangkan QIRA. Demo ini bukan project klien dan ditampilkan secara terbuka sebagai bahan eksplorasi.",
    items: SOLUTION_DEMOS,
  },
] as const;

function PortfolioCase({ project }: { project: PortfolioItem }) {
  return (
    <article className="portfolioCase">
      <div className="portfolioCaseTop">
        <span className="portfolioNumber">{project.number}</span>
        <span className="portfolioTag">{project.tag}</span>
      </div>
      <div className="portfolioCaseBody">
        <div className="portfolioCaseTitle">
          <h3>{project.title}</h3>
          <div className="portfolioStack">
            {project.stack.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
        <div className="portfolioCaseDetails">
          <div>
            <small>Challenge</small>
            <p>{project.challenge}</p>
          </div>
          <div>
            <small>Solution</small>
            <p>{project.solution}</p>
          </div>
          <div>
            <small>Outcome</small>
            <p>{project.result}</p>
          </div>
        </div>
      </div>
      {project.href && project.cta ? (
        project.external ? (
          <a className="portfolioCaseLink" href={project.href} target="_blank" rel="noreferrer">{project.cta} →</a>
        ) : (
          <Link className="portfolioCaseLink" href={project.href}>{project.cta} →</Link>
        )
      ) : null}
      {project.note ? <p className="portfolioPrivateNote">{project.note}</p> : null}
    </article>
  );
}

export default function PortfolioPage() {
  return (
    <main>
      <nav className="companyNav shell" aria-label="Navigasi utama">
        <Link className="brand" href="/">QIRA<span>.</span></Link>
        <div className="companyNavLinks">
          <Link href="/about">About Us</Link>
          <Link href="/#services">Services</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/harga">Pricing</Link>
        </div>
        <Link className="smallButton" href="/coba-masalah">Mulai konsultasi</Link>
      </nav>

      <section className="portfolioHero shell">
        <p className="eyebrow">QIRA · Products & Work</p>
        <h1>Produk yang kami gunakan. Solusi yang kami bangun. Demo yang bisa Anda coba.</h1>
        <p>
          Portfolio QIRA dibagi secara transparan menjadi QIRA Products, Client Work, dan Solution Demos. Produk internal tetap kami tampilkan sebagai bukti penerapan, sementara project klien ditampilkan tanpa membuka informasi yang bersifat private.
        </p>
        <div className="portfolioCategoryNav" aria-label="Kategori portfolio">
          <a href="#products">QIRA Products</a>
          <a href="#client-work">Client Work</a>
          <a href="#solution-demos">Solution Demos</a>
        </div>
      </section>

      <div className="portfolioSections">
        {SECTIONS.map((section) => (
          <section className="portfolioGroup shell" id={section.id} key={section.id}>
            <div className="portfolioGroupIntro">
              <p className="kicker">{section.eyebrow}</p>
              <div>
                <h2>{section.title}</h2>
                <p>{section.copy}</p>
              </div>
            </div>
            <div className="portfolioList">
              {section.items.map((project) => <PortfolioCase project={project} key={project.title} />)}
            </div>
          </section>
        ))}
      </div>

      <section className="portfolioNote shell">
        <p className="kicker">Built to be useful</p>
        <div>
          <h2>Kami lebih memilih solusi yang dipakai daripada fitur yang hanya terlihat canggih.</h2>
          <p>
            Sebagian solusi QIRA sengaja fokus pada satu workflow, satu dokumen, atau satu proses operasional. Ukurannya boleh sederhana selama membuat pekerjaan lebih cepat, lebih rapi, atau lebih mudah digunakan.
          </p>
        </div>
      </section>

      <section className="companyClosing shell">
        <div>
          <p className="kicker">Your project</p>
          <h2>Punya proses yang bisa dibuat lebih cepat atau lebih rapi?</h2>
        </div>
        <div className="closingActions">
          <Link className="primaryButton light" href="/coba-masalah">Ceritakan kebutuhan</Link>
          <Link className="closingTextLink" href="/harga">Lihat layanan →</Link>
        </div>
      </section>

      <footer className="companyFooter shell">
        <div>
          <Link className="brand" href="/">QIRA<span>.</span></Link>
          <p>Simple digital solutions for growing businesses.</p>
        </div>
        <div className="footerLinks">
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/harga">Services & Pricing</Link>
          <Link href="/discovery">Discovery</Link>
          <Link href="/privasi">Privacy</Link>
        </div>
        <span>QIRA · PT Rays Solusi Informasi</span>
      </footer>
    </main>
  );
}

// send.js
// Script untuk mengirim email sponsorship GMERS XVI lewat Brevo
// Jalankan dengan: node send.js  (atau npm run send jika sudah ada di package.json)

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const Brevo = require("@getbrevo/brevo");
const companies = require("./data/perusahaan");

// Load .env
dotenv.config();

// —————————————————————
// 1. Konfigurasi dasar
// —————————————————————
const DRY_RUN = process.env.DRY_RUN === "true";
const MAX_EMAIL_PER_RUN = Number(process.env.MAX_EMAIL_PER_RUN || 40);
const BREVO_API_KEY = process.env.BREVO_API_KEY;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Folder untuk lampiran
const ATTACHMENTS_DIR = path.join(__dirname, "attachments");
// Ganti nama file ini kalau proposal kamu beda
const PROPOSAL_FILENAME = "Proposal Sponsorship GMERS XVI.pdf";

// Validasi API key
if (!BREVO_API_KEY) {
  console.error(
    "ERROR: BREVO_API_KEY belum di-set di file .env.\n" +
      "Silakan isi API key Brevo di .env terlebih dahulu."
  );
  process.exit(1);
}

// —————————————————————
// 2. Inisialisasi client Brevo
// —————————————————————
const brevoClient = new Brevo.TransactionalEmailsApi();
brevoClient.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  BREVO_API_KEY
);

// Fungsi kirim email via Brevo
async function sendBrevoEmail({ to, subject, html, attachments = [] }) {
  const emailData = {
    sender: {
      name: "Panitia GMERS XVI",
      email: "gmerssxvi@gmail.com", // akun pengirim 
      // email: "hammammuhammady@gmail.com", // untuk testing pakai email pribadi
    },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  };

  if (attachments.length > 0) {
    emailData.attachment = attachments;
  }

  if (DRY_RUN) {
    console.log("-------------------------------------------------");
    console.log("[DRY_RUN] Simulasi kirim email:");
    console.log("Ke      :", to);
    console.log("Subject :", subject);
    console.log("Lampiran:", attachments.map((a) => a.name).join(", ") || "-");
    console.log("-------------------------------------------------");
    return true;
  }

  try {
    await brevoClient.sendTransacEmail(emailData);
    console.log(`✅ Berhasil kirim ke ${to}`);
    return true;
  } catch (err) {
    console.error(`❌ Gagal kirim ke ${to}`);
    if (err.response && err.response.body) {
      console.error(
        "Detail error Brevo:",
        JSON.stringify(err.response.body, null, 2)
      );
    } else {
      console.error("Error:", err.message);
    }
    return false;
  }
}

// —————————————————————
// 3. Bangun subject, body, dan lampiran per perusahaan
// —————————————————————
function buildEmailForCompany(company) {
  const namaPerusahaan = company.name || "Bapak/Ibu";

  // Subject SAMA untuk semua perusahaan
  const subject = "Permohonan Kerja Sama Sponsorship GMERS XVI";

  // Isi email generik tapi tetap sebut nama perusahaan
  const html = `
    <p>Yth. Pimpinan <strong>${namaPerusahaan}</strong><br/>
    di tempat</p>

    <p>Dengan hormat,</p>

    <p>
    Perkenalkan kami, Panitia <strong>Gadjah Mada Education Roadshow (GMERS) XVI</strong>, dari
    <strong>Forum Komunikasi Mahasiswa Minang Universitas Gadjah Mada (FORKOMMI-UGM)</strong>.
    </p>

    <p>
    GMERS merupakan kegiatan tahunan sebagai bentuk pengabdian mahasiswa Minang UGM kepada daerah asal di Sumatera Barat.
    Program ini ditujukan bagi siswa SMA/sederajat untuk memberikan motivasi melanjutkan pendidikan tinggi, mengenalkan
    Universitas Gadjah Mada secara lebih luas, serta menumbuhkan semangat berkontribusi bagi daerah.
    </p>

    <p>
    Pada tahun 2026, GMERS XVI akan diselenggarakan pada bulan Januari dan mencakup rangkaian kegiatan
    <strong>Roadshow, Try Out, GAMA Expo, dan GMERSPEDITION</strong> di 19 kabupaten/kota di Sumatera Barat.
    </p>

    <p>
    Sehubungan dengan hal tersebut, kami memohon kesediaan <strong>${namaPerusahaan}</strong> untuk menjajaki peluang kerja sama sponsorship.
    Kami meyakini kolaborasi ini dapat memberikan nilai tambah bagi perusahaan sekaligus mendukung peningkatan kualitas pendidikan generasi muda.
    </p>

    <p>
    Sebagai bahan pertimbangan, bersama email ini kami lampirkan <strong>surat pengantar resmi</strong> dan
    <strong>proposal sponsorship</strong>.
    </p>

    <p>
    Untuk diskusi lebih lanjut, Bapak/Ibu dapat membalas email ini atau menghubungi kontak berikut:<br/>
    Hammam Muhammad Yazid — 089613465400<br/>
    <a href="mailto:hammammuhammadyazid@mail.ugm.ac.id">hammammuhammadyazid@mail.ugm.ac.id</a>
    </p>

    <p>
    Demikian kami sampaikan. Atas perhatian dan dukungan Bapak/Ibu, kami ucapkan terima kasih.
    </p>

    <p>
    Hormat kami,<br/>
    <strong>Panitia GMERS XVI 2026</strong><br/>
    <strong>Forum Komunikasi Mahasiswa Minang Universitas Gadjah Mada (FORKOMMI-UGM)</strong>
    </p>

    <p>
    Instagram: <a href="https://instagram.com/gmersofficial">@gmersofficial</a><br/>
    Email: <a href="mailto:gmerssxvi@gmail.com">gmerssxvi@gmail.com</a>
    </p>
    `;


  const attachments = [];

  let hasSurat = false;
  let hasProposal = false;

  // 1) Surat pengantar khusus perusahaan (PDF beda-beda)
  if (company.suratPengantarFile) {
    const suratPath = path.join(ATTACHMENTS_DIR, company.suratPengantarFile);
    if (fs.existsSync(suratPath)) {
      const suratContent = fs.readFileSync(suratPath).toString("base64");
      attachments.push({
        name: company.suratPengantarFile,
        content: suratContent,
      });
      hasSurat = true;
    } else {
      console.warn(
        `⚠️ Surat pengantar tidak ditemukan untuk ${namaPerusahaan}: ${suratPath}`
      );
    }
  } else {
    console.warn(
      `⚠️ Field suratPengantarFile kosong untuk perusahaan: ${namaPerusahaan}`
    );
  }

  // 2) Proposal umum (satu file untuk semua)
  const proposalPath = path.join(ATTACHMENTS_DIR, PROPOSAL_FILENAME);
  if (fs.existsSync(proposalPath)) {
    const proposalContent = fs.readFileSync(proposalPath).toString("base64");
    attachments.push({
      name: PROPOSAL_FILENAME,
      content: proposalContent,
    });
    hasProposal = true;
  } else {
    console.warn(
      `⚠️ File proposal umum tidak ditemukan: ${proposalPath} (cek nama & lokasi)`
    );
  }

  return { subject, html, attachments, hasSurat, hasProposal };
}


// —————————————————————
// 4. Main script
// —————————————————————
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay() {
  // 5–12 detik (dalam milidetik)
  const min = 5000;
  const max = 12000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("=================================================");
  console.log("  Mail-Sender GMERS XVI - Brevo Version");
  console.log("=================================================");
  console.log("DRY_RUN            :", DRY_RUN);
  console.log("MAX_EMAIL_PER_RUN  :", MAX_EMAIL_PER_RUN);
  console.log("Total perusahaan   :", companies.length);
  console.log("=================================================\n");

  let sent = 0;
  let failed = 0;
  let skipped = 0;
  let processed = 0;
  const report = [];

  for (const company of companies) {
    if (processed >= MAX_EMAIL_PER_RUN) {
      console.log("\n⚠️ Mencapai batas MAX_EMAIL_PER_RUN, berhenti.");
      break;
    }

    const to = company.email;

    if (!to || !emailRegex.test(to)) {
      console.warn(
        "⚠️ Email tidak valid / kosong, skip perusahaan ini:",
        company
      );
      skipped++;
      report.push({
        name: company.name,
        email: to,
        status: "skipped_invalid_email",
      });
      continue;
    }

    processed++;

    const {
      subject,
      html,
      attachments,
      hasSurat,
      hasProposal,
    } = buildEmailForCompany(company);

    // Cek lampiran lengkap atau tidak
    if (!hasSurat || !hasProposal) {
      console.warn(
        `⚠️ Lampiran tidak lengkap untuk ${company.name} (${to}). Email TIDAK dikirim.`
      );
      skipped++;
      report.push({
        name: company.name,
        email: to,
        status: "skipped_missing_attachments",
      });

      // lanjut ke perusahaan berikutnya tanpa kirim email
      continue;
    }

    const ok = await sendBrevoEmail({
      to,
      subject,
      html,
      attachments,
    });

    if (ok) {
      sent++;
      report.push({
        name: company.name,
        email: to,
        status: DRY_RUN ? "dry_run_ok" : "sent",
      });
    } else {
      failed++;
      report.push({
        name: company.name,
        email: to,
        status: "failed",
      });
    }

    // DELAY ACAK 7–12 DETIK (kalau kamu sudah set sebelumnya)
    const delay = randomDelay();
    console.log(`⏳ Menunggu ${Math.round(delay / 1000)} detik sebelum lanjut...`);
    await sleep(delay);


  }

  // —————————————————————
  // Simpan laporan dengan timestamp (tidak overwrite)
  // —————————————————————

  const REPORT_DIR = path.join(__dirname, "hasil_pengiriman");

  // bikin folder kalau belum ada
  if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR);
  }

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-"); // biar aman untuk Windows

  const filename = `hasil_pengiriman_${timestamp}.json`;

  fs.writeFileSync(
    path.join(REPORT_DIR, filename),
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        dryRun: DRY_RUN,
        totalCompanies: companies.length,
        processed,
        sent,
        failed,
        skipped,
        detail: report,
      },
      null,
      2
    )
  );

  console.log(`📄 Laporan disimpan di: ${filename}`);


  console.log("\n=================== RINGKASAN ===================");
  console.log("Diproses :", processed);
  console.log("Berhasil :", sent);
  console.log("Gagal    :", failed);
  console.log("Diskip   :", skipped);
  console.log("File log :", "hasil_pengiriman.json");
  console.log("=================================================\n");

  if (DRY_RUN) {
    console.log(
      "Mode DRY_RUN aktif: tidak ada email yang benar-benar dikirim.\n" +
        "Ubah DRY_RUN=false di .env jika sudah siap mengirim sungguhan."
    );
  }
}

// Jalankan
main().catch((err) => {
  console.error("❌ Fatal error di main():", err);
  process.exit(1);
});

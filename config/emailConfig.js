// config/emailConfig.js
// SEMUA YANG BISA DIUBAH-UBAH ADA DI SINI

module.exports = {
  // ————— IDENTITAS PENGIRIM —————
  senderName: "Nama Pengirim",        // GANTI: nama kamu
  senderPhone: "08xxxxxxxxxx",        // GANTI: nomor WA/HP
  senderEmail: "gmerssxvi@gmail.com", // tampil di body email

  // ————— INFORMASI EVENT —————
  eventName: "Gadjah Mada Education Roadshow (GMERS) XVI 2026",
  eventDate: "Januari 2026",
  eventLocation: "19 kabupaten/kota di Sumatera Barat",

  // Salam: "pagi", "siang", "sore", atau "malam"
  greetingText: "pagi",

  // ————— NAMA FILE PROPOSAL —————
  // Nama file proposal PDF di folder ./attachments
  proposalFileName: "Proposal_GMERS_XVI_2026.pdf",

  // ————— TEMPLATE SUBJECT (HEADER) EMAIL —————
  // Bisa pakai placeholder juga kalau mau, mis: {{event_name}}
  subjectTemplate:
    "PERMOHONAN PENGAJUAN KERJA SAMA GADJAH MADA EDUCATION ROADSHOW XVI",

  // ————— TEMPLATE ISI EMAIL (BODY) —————
  // Placeholder yang bisa dipakai:
  // - {{company_name}}
  // - {{greeting}}
  // - {{sender_name}}
  // - {{sender_phone}}
  // - {{sender_email}}
  //
  // Kalau mau, nanti bisa ditambah:
  // - {{event_name}}, {{event_date}}, {{event_location}}, dll.

  bodyTemplate: `
Yth. Pimpinan {{company_name}}
di tempat

Selamat {{greeting}} Bapak/Ibu,

Perkenalkan kami, Panitia Gadjah Mada Education Roadshow (GMERS) XVI, dari Forum Komunikasi Mahasiswa Minang Universitas Gadjah Mada (FORKOMMI-UGM). GMERS merupakan kegiatan tahunan yang menjadi bentuk pengabdian mahasiswa Minang UGM kepada kampung halaman di Sumatera Barat.

Kegiatan ini ditujukan bagi pelajar SMA/sederajat di Sumatera Barat dengan tujuan memberikan motivasi untuk melanjutkan pendidikan tinggi, mengenalkan Universitas Gadjah Mada secara lebih luas, serta menumbuhkan semangat merantau dan berkontribusi bagi nagari.

GMERS XVI 2026 akan dilaksanakan pada bulan Januari 2026, mencakup rangkaian kegiatan Roadshow, Try Out, GAMA Expo, dan GMERSPEDITION, yang tersebar di 19 kabupaten/kota di Sumatera Barat.

Sehubungan dengan hal tersebut, kami bermaksud menjalin hubungan baik dengan pihak {{company_name}} serta menanyakan mengenai prosedur kerja sama atau dukungan sponsorship/donasi yang dapat diajukan.

Sebagai bahan pertimbangan, bersama email ini kami lampirkan proposal kerja sama dan surat pengantar resmi.

Untuk diskusi lebih lanjut, Bapak/Ibu dapat membalas email ini atau menghubungi kontak kami di bawah ini:

{{sender_name}} – {{sender_phone}}
{{sender_email}}

Demikian yang dapat kami sampaikan. Mohon maaf apabila pesan ini mengganggu waktu Bapak/Ibu. Atas perhatian dan dukungan yang diberikan, kami ucapkan terima kasih.

Hormat kami,

Panitia Gadjah Mada Education Roadshow (GMERS) XVI 2026
Forum Komunikasi Mahasiswa Minang Universitas Gadjah Mada (FORKOMMI-UGM)

Instagram: @gmersofficial
Email: gmerssxvi@gmail.com
`
};

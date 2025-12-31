"use client";

import { motion } from "framer-motion";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Pilih Produk",
      description: "Tentukan produk pinjaman yang sesuai dengan kebutuhan dan kemampuan Anda."
    },
    {
      number: "02",
      title: "Isi Data",
      description: "Lengkapi formulir pengajuan singkat secara online. Hanya butuh waktu 3 menit."
    },
    {
      number: "03",
      title: "Verifikasi",
      description: "Lakukan verifikasi nomor HP dan data diri untuk keamanan proses pengajuan."
    },
    {
      number: "04",
      title: "Dana Cair",
      description: "Setelah disetujui, dana akan langsung dicairkan ke rekening Bank Jakarta Anda."
    }
  ];

  return (
    <section className="py-24 bg-zinc-50 border-t border-zinc-200">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">
            Langkah Mudah Ajukan Pinjaman
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            Proses pengajuan yang transparan dan tidak berbelit-belit.
          </p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-zinc-200 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm text-center md:text-left h-full flex flex-col items-center md:items-start"
              >
                <span className="text-4xl font-bold text-brand-100 mb-4 block">
                  {step.number}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


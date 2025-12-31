"use client";

import { Percent, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export function BenefitSection() {
  const benefits = [
    {
      icon: <Percent className="h-8 w-8 text-brand-500" />,
      title: "Bunga Kompetitif",
      description: "Nikmati suku bunga ringan mulai dari 0.8% flat per bulan untuk pinjaman multiguna."
    },
    {
      icon: <Zap className="h-8 w-8 text-brand-500" />,
      title: "Proses Cepat",
      description: "Persetujuan instan dengan teknologi credit scoring modern. Tidak perlu menunggu lama."
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-brand-500" />,
      title: "Aman & Terpercaya",
      description: "Bank Jakarta terdaftar dan diawasi oleh OJK serta simpanan dijamin oleh LPS."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">
            Kenapa Memilih Bank Jakarta?
          </h2>
          <p className="mt-4 text-lg text-zinc-600 max-w-2xl mx-auto">
            Kami berkomitmen memberikan layanan finansial terbaik dengan transparansi dan keamanan tinggi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="bg-brand-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-300 border border-brand-100"
            >
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-sm">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


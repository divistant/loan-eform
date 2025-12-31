import { NextResponse } from "next/server";
import { type Product } from "@/types/domain";

const products: Array<Product> = [
  {
    id: "PROD-KPR",
    name: "KPR - Kredit Pemilikan Rumah",
    rate: "4.5% eff.p.a",
    description: "Solusi pembiayaan untuk memiliki rumah idaman dengan bunga kompetitif dan tenor panjang. Proses mudah dengan cicilan terjangkau hingga 25 tahun.",
    constraints: {
      min_income: 8000000,
      tenor_type: "YEAR",
      tenor_options: [5, 10, 15, 20, 25],
    },
  },
  {
    id: "PROD-KMG",
    name: "KMG - Kredit Multi Guna",
    rate: "0.8% flat/bln",
    description: "Pembiayaan fleksibel untuk berbagai kebutuhan seperti renovasi, pendidikan, atau keperluan mendesak lainnya. Proses cepat dengan suku bunga kompetitif.",
    constraints: {
      min_income: 3000000,
      tenor_type: "MONTH",
      tenor_options: [12, 24, 36, 48, 60],
    },
  },
  {
    id: "PROD-MIKRO",
    name: "Mikro - Kredit Usaha Mikro",
    rate: "0.5% flat/bln",
    description: "Pembiayaan modal usaha untuk pengembangan UMKM dengan bunga ringan dan persyaratan mudah. Dukung pertumbuhan bisnis Anda bersama Bank Jakarta.",
    constraints: {
      min_income: 2000000,
      tenor_type: "MONTH",
      tenor_options: [6, 12, 18, 24],
    },
  },
];

export async function GET() {
  return NextResponse.json({ data: products });
}

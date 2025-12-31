import { NextResponse } from "next/server";
import { type Product } from "@/types/domain";

const products: Array<Product> = [
  {
    id: "PROD-KPR",
    name: "KPR Griya Jakarta",
    rate: "4.5% eff.p.a",
    description: "Wujudkan hunian impian keluarga Anda dengan suku bunga tetap 4.5% selama 3 tahun. Cicilan ringan, proses cepat, dan tenor hingga 25 tahun.",
    constraints: {
      min_income: 8000000,
      tenor_type: "YEAR",
      tenor_options: [5, 10, 15, 20, 25],
    },
  },
  {
    id: "PROD-KTA",
    name: "Kredit Multiguna",
    rate: "0.8% flat/bln",
    description: "Dana tunai cepat cair tanpa agunan untuk renovasi, pendidikan, atau kebutuhan mendesak. Proses persetujuan instan, langsung ke rekening Anda.",
    constraints: {
      min_income: 3000000,
      tenor_type: "MONTH",
      tenor_options: [12, 24, 36, 48, 60],
    },
  },
  {
    id: "PROD-MIKRO",
    name: "Kredit Usaha Mikro",
    rate: "0.5% flat/bln",
    description: "Modal kerja untuk mengembangkan usaha Anda. Bunga ringan, syarat mudah, khusus UMKM yang ingin naik kelas dan ekspansi.",
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

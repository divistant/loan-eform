import { notFound } from "next/navigation";
import { FormWizard } from "@/components/features/form/FormWizard";
import type { Product } from "@/types/domain";

// Helper to fetch product (simulate server-side fetch)
async function getProduct(id: string): Promise<Product | undefined> {
  // NOTE: Di production, ini adalah fetch ke API endpoint yang sesuai
  
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
      calculation: {
        type: "EFFECTIVE",
        rate: 4.5, // Annual rate 4.5%
        min_amount: 50000000, // 50 juta
        max_amount: 5000000000, // 5 milyar
      },
      simulatorConfig: {
        fields: {
          required: ["loanAmount", "tenor"],
          kpr: ["purpose", "collateralType", "downPayment", "housePrice"],
        },
        options: {
          purpose: [
            { value: "beli-baru", label: "Beli Rumah Baru" },
            { value: "beli-bekas", label: "Beli Rumah Bekas" },
            { value: "renovasi", label: "Renovasi Rumah" },
            { value: "refinancing", label: "Refinancing" },
          ],
          collateralType: [
            { value: "shm", label: "Sertifikat Hak Milik (SHM)" },
            { value: "shgb", label: "Sertifikat Hak Guna Bangunan (SHGB)" },
            { value: "girik", label: "Girik / Petok D" },
            { value: "ajb", label: "Akta Jual Beli (AJB)" },
          ],
          downPayment: [
            { value: 10, label: "10%" },
            { value: 15, label: "15%" },
            { value: 20, label: "20%" },
            { value: 25, label: "25%" },
            { value: 30, label: "30%" },
          ],
        },
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
      calculation: {
        type: "FLAT",
        rate: 0.8, // Monthly flat rate 0.8%
        min_amount: 10000000, // 10 juta
        max_amount: 500000000, // 500 juta
      },
      simulatorConfig: {
        fields: {
          required: ["loanAmount", "tenor"],
          kmg: ["loanPurpose"],
        },
        options: {
          loanPurpose: [
            { value: "renovasi", label: "Renovasi Rumah" },
            { value: "pendidikan", label: "Pendidikan" },
            { value: "kesehatan", label: "Kesehatan" },
            { value: "pernikahan", label: "Pernikahan" },
            { value: "liburan", label: "Liburan" },
            { value: "lainnya", label: "Kebutuhan Lainnya" },
          ],
        },
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
      calculation: {
        type: "FLAT",
        rate: 0.5, // Monthly flat rate 0.5%
        min_amount: 5000000, // 5 juta
        max_amount: 100000000, // 100 juta
      },
      simulatorConfig: {
        fields: {
          required: ["loanAmount", "tenor"],
          mikro: ["businessType"],
        },
        options: {
          businessType: [
            { value: "perdagangan", label: "Perdagangan" },
            { value: "jasa", label: "Jasa" },
            { value: "manufaktur", label: "Manufaktur" },
            { value: "pertanian", label: "Pertanian" },
            { value: "peternakan", label: "Peternakan" },
            { value: "perikanan", label: "Perikanan" },
            { value: "lainnya", label: "Lainnya" },
          ],
        },
      },
    },
  ];

  return products.find((p) => p.id === id);
}

interface PageProps {
  params: Promise<{ productId: string }>;
}

export default async function ApplyPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50 py-16">
      <FormWizard product={product} />
    </div>
  );
}

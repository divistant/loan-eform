import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validasi basic
    if (!body.consent) {
      return NextResponse.json(
        { message: "Consent is required" },
        { status: 400 }
      );
    }

    // Simulasi check duplikasi NIK
    // Jika NIK = "1234567890123456", return duplicate
    if (body.screening?.nik === "1234567890123456") {
      return NextResponse.json(
        { message: "Data dengan NIK ini sudah terdaftar" },
        { status: 409 }
      );
    }

    // Simulasi delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({
      status: "success",
      message: "Lead submitted successfully",
      leadId: `LEAD-${Date.now()}`,
    });
  } catch {
    return NextResponse.json(
      { message: "Invalid request" },
      { status: 400 }
    );
  }
}

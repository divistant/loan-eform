import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code } = body;

    // Simulasi delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (code === "8888") {
      return NextResponse.json({ status: "valid" });
    } else {
      return NextResponse.json(
        { message: "Kode OTP salah" },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      { message: "Invalid request" },
      { status: 400 }
    );
  }
}

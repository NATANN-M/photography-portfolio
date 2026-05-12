import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await prisma.$connect();

  return NextResponse.json({
    message: "PostgreSQL connected successfully",
  });
}
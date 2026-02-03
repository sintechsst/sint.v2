import { NextResponse } from 'next/server';

export function GET() {
  const data = { message: "Export API is active" };
  
  // Usamos a construção padrão de Response para evitar o conflito de tipos do Deno/TS
  return new NextResponse(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
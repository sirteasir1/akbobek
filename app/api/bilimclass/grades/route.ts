import { NextResponse } from 'next/server';
import { getBilimClassGrades } from '@/lib/mock-bilimclass';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId') ?? 'stu-001';
  return NextResponse.json(getBilimClassGrades(studentId));
}

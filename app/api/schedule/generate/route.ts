import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateSchedule } from '@/lib/schedule';

const schema = z.object({ absentTeacherIds: z.array(z.string()).optional() });

export async function POST(request: Request) {
  const payload = schema.parse(await request.json().catch(() => ({})));
  return NextResponse.json(generateSchedule({ absentTeacherIds: payload.absentTeacherIds ?? [] }));
}

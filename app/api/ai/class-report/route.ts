import { NextResponse } from 'next/server';
import { z } from 'zod';
import { buildClassReport } from '@/lib/analytics';
import { teacherClassrooms } from '@/lib/data';
import { getOpenAIClient } from '@/lib/openai';

const schema = z.object({ classroomId: z.string().default('cls-10a-physics') });

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());
  const classroom = teacherClassrooms.find((item) => item.id === payload.classroomId) ?? teacherClassrooms[0];
  const base = buildClassReport(classroom);
  const client = getOpenAIClient();

  if (!client) {
    return NextResponse.json(base);
  }

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5.4-mini',
      input: [
        {
          role: 'system',
          content: 'Ты помощник учителя. Сформулируй короткий деловой отчёт в 2-3 предложениях и 3 тезисах. Ответ в JSON с ключами headline, narrative, bullets.',
        },
        {
          role: 'user',
          content: JSON.stringify(base),
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'teacher_report',
          schema: {
            type: 'object',
            properties: {
              headline: { type: 'string' },
              narrative: { type: 'string' },
              bullets: {
                type: 'array',
                items: { type: 'string' },
              },
            },
            required: ['headline', 'narrative', 'bullets'],
            additionalProperties: false,
          },
        },
      },
    });

    const output = JSON.parse(response.output_text);
    return NextResponse.json(output);
  } catch {
    return NextResponse.json(base);
  }
}

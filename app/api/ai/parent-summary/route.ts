import { NextResponse } from 'next/server';
import { z } from 'zod';
import { buildParentWeeklySummary } from '@/lib/analytics';
import { students } from '@/lib/data';
import { getOpenAIClient } from '@/lib/openai';

const schema = z.object({ studentId: z.string().default('stu-001') });

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());
  const student = students.find((item) => item.id === payload.studentId) ?? students[0];
  const base = buildParentWeeklySummary(student);
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
          content: 'Ты помощник родителя. Перепиши summary очень дружелюбно и конкретно. Верни JSON c headline, summary, actions.',
        },
        {
          role: 'user',
          content: JSON.stringify(base),
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'parent_summary',
          schema: {
            type: 'object',
            properties: {
              headline: { type: 'string' },
              summary: { type: 'string' },
              actions: { type: 'array', items: { type: 'string' } },
            },
            required: ['headline', 'summary', 'actions'],
            additionalProperties: false,
          },
        },
      },
    });

    return NextResponse.json(JSON.parse(response.output_text));
  } catch {
    return NextResponse.json(base);
  }
}

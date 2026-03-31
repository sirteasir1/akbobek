import { NextResponse } from 'next/server';
import { z } from 'zod';
import { evaluateStudentRisk } from '@/lib/analytics';
import { students } from '@/lib/data';
import { getOpenAIClient } from '@/lib/openai';

const schema = z.object({ studentId: z.string().default('stu-001') });

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());
  const student = students.find((item) => item.id === payload.studentId) ?? students[0];
  const base = evaluateStudentRisk(student);
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
          content: 'Ты образовательный аналитик. Улучши объяснение риска ученика простым и поддерживающим языком. Верни только 1 абзац текста без markdown.',
        },
        {
          role: 'user',
          content: `Ученик: ${student.name}. Предмет риска: ${base.subject}. Вероятность риска: ${base.riskProbability}%. Слабые темы: ${base.weakTopics.map((item) => `${item.topic} (${item.mastery}%)`).join(', ')}. Черновое объяснение: ${base.explanation}`,
        },
      ],
    });

    return NextResponse.json({ ...base, explanation: response.output_text || base.explanation });
  } catch {
    return NextResponse.json(base);
  }
}

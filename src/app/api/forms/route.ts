import Form from '@/models/Form';
import connect from '@/app/lib/connect';
import { NextRequest } from 'next/server';
import { Question } from '@/../src/app/forms/form';

export async function POST(req: NextRequest) {
  await connect();
  const body = await req.json();
  const form = await Form.create({
    title: body.title,
    description: body.description,
    questions: body.questions.map((q: Question) => ({
      label: q.label,
      type: q.type,
      required: q.required,
      options: q.options ?? [],
    })),
  });

  return Response.json(form, { status: 201 });
}

import ResponseModel from '@/models/Responce';
import connect from '@/app/lib/connect';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  await connect();
  const body = await req.json();

  const response = await ResponseModel.create({
    formId: body.formId,
    answers: body.answers,
  });

  return Response.json(response, { status: 201 });
}
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';
import connect from '@/app/lib/connect';
import ResponseModel from '@/models/Responce';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connect();
  const { formId, answers } = await req.json();

  if (!formId || !answers) {
    return NextResponse.json({ error: 'Missing formId or answers' }, { status: 400 });
  }

  const response = await ResponseModel.create({
    formId,
    answers,
    respondent: {                    
      userId: session.user.id,
      name:   session.user.username,
      email:  session.user.email,
    },
  });

  return NextResponse.json(response, { status: 201 });
}
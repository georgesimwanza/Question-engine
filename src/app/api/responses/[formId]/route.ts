import { NextResponse } from 'next/server';
import ResponseModel from '@/models/Responce';  // ← fix typo: Responce → Response
import Form from '@/models/Form';
import connect from '@/app/lib/connect';
import { NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ formId: string }> }  // ← Promise type
) {
  await connect();

  const { formId } = await params;  // ← await params

  console.log('Looking for formId:', formId);

  const form = await Form.findById(formId);
  if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 });

  const responses = await ResponseModel.find({ formId }).sort({ createdAt: -1 });

  return NextResponse.json({ form, responses });
}
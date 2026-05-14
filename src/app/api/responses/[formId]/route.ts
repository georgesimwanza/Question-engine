import { NextResponse, NextRequest } from 'next/server';
import ResponseModel from '@/models/Responce';
import Form from '@/models/Form';
import connect from '@/app/lib/connect';
import { requireAuth } from '@/app/lib/requireAuth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  await connect();
  const { formId } = await params;

  const form = await Form.findById(formId);
  if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 });

  const responses = await ResponseModel.find({ formId }).sort({ createdAt: -1 });
  return NextResponse.json({ form, responses });
}
// app/api/forms/[formId]/route.ts
import Form from '@/models/Form';
import connect from '@/app/lib/connect';
import { NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  await connect();
  const { formId } = await params;

  const form = await Form.findById(formId);
  if (!form) return Response.json({ error: 'Form not found' }, { status: 404 });

  return Response.json(form);
}
// app/api/forms/[formId]/route.ts
import Form from '@/models/Form';
import connect from '@/app/lib/connect';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/requireAuth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  await connect();
  const { formId } = await params;

  const form = await Form.findById(formId);
  if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 });

  return NextResponse.json(form);
}
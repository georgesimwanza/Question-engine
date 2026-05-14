import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
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

  // Build workbook
  const workbook  = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Responses');

  // Define columns
  worksheet.columns = [
    { header: 'Respondent',   key: 'name',        width: 20 },
    { header: 'Email',        key: 'email',       width: 25 },
    { header: 'Submitted At', key: 'submittedAt', width: 22 },
    ...form.questions.map((q: any) => ({
      header: q.label,
      key:    q._id.toString(),
      width:  25,
    })),
  ];

  // Style header row
  worksheet.getRow(1).font = { bold: true };

  // Add data rows
  responses.forEach((r: any) => {
    const row: Record<string, any> = {
      name:        r.respondent?.name  || 'Unknown',
      email:       r.respondent?.email || 'Unknown',
      submittedAt: new Date(r.createdAt).toLocaleString(),
    };

    form.questions.forEach((q: any) => {
      const answer = r.answers.find(
        (a: any) => a.questionId.toString() === q._id.toString()
      );
      row[q._id.toString()] = answer?.value ?? '';
    });

    worksheet.addRow(row);
  });

  // Write to buffer and return as download
  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(Buffer.from(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${form.title}-responses.xlsx"`,
    },
  });
}
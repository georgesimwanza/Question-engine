'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Answer {
  questionId: string;
  value: string | string[] | number;
}

interface Respondent {
  name: string;
  email: string;
}

interface FormResponse {
  _id: string;
  createdAt: string;
  answers: Answer[];
  respondent?: Respondent;
}

interface Question {
  _id: string;
  label: string;
  type: string;
}

interface Form {
  title: string;
  description: string;
  questions: Question[];
}

export default function ResponsesPage() {
  const params = useParams();
  const formId = params.formId as string;

  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!formId) return;

    async function fetchResponses() {
      try {
        const res = await fetch(`/api/responses/${formId}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setForm(data.form);
        setResponses(data.responses);
      } catch {
        setError('Could not load responses.');
      } finally {
        setLoading(false);
      }
    }

    fetchResponses();
  }, [formId]);

  if (loading) return <p style={{ padding: 32 }}>Loading...</p>;
  if (error)   return <p style={{ padding: 32, color: 'red' }}>{error}</p>;
  if (!form)   return <p style={{ padding: 32 }}>Form not found.</p>;

  const questionMap = Object.fromEntries(form.questions.map(q => [q._id, q]));

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32, fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>{form.title}</h1>

        {/* ✅ Download button */}
        <button
          onClick={async () => {
            const res = await fetch(`/api/responses/${formId}/export`);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `responses-${formId}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }}
          style={{
            background: '#673ab7',
            color: '#fff',
            padding: '8px 18px',
            borderRadius: 4,
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          Download Excel
        </button>
      </div>

      <p style={{ color: '#555', marginBottom: 24 }}>{form.description}</p>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 32 }}>
        {responses.length} response{responses.length !== 1 ? 's' : ''}
      </p>

      {responses.length === 0 ? (
        <p style={{ color: '#999' }}>No responses yet.</p>
      ) : (
        responses.map((response, i) => (
          <div key={response._id} style={{
            border: '1px solid #e0e0e0',
            borderRadius: 8,
            padding: 20,
            marginBottom: 16,
            background: '#fafafa',
          }}>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>
              Response #{i + 1} — {new Date(response.createdAt).toLocaleString()}
            </p>

            {/* ✅ Show who responded */}
            {response.respondent && (
              <p style={{ fontSize: 13, color: '#673ab7', marginBottom: 16 }}>
                👤 {response.respondent.name} — {response.respondent.email}
              </p>
            )}

            {response.answers.map((answer) => {
              const question = questionMap[answer.questionId];
              return (
                <div key={answer.questionId} style={{ marginBottom: 12 }}>
                  <p style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>
                    {question?.label ?? 'Unknown question'}
                  </p>
                  <p style={{ fontSize: 14, color: '#333', paddingLeft: 12 }}>
                    {Array.isArray(answer.value)
                      ? answer.value.join(', ')
                      : String(answer.value ?? '—')}
                  </p>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type QuestionType =
  | 'short' | 'paragraph' | 'multiple_choice'
  | 'checkboxes' | 'dropdown' | 'date' | 'time' | 'linear_scale';

interface Question {
  _id: string;
  label: string;
  type: QuestionType;
  required: boolean;
  options: string[];
}

interface Form {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
}

export default function FillFormPage() {
  const params = useParams();
  const formId = params.formId as string;

  const [form, setForm] = useState<Form | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!formId) return;
    async function fetchForm() {
      try {
        const res = await fetch(`/api/forms/${formId}`);
        if (!res.ok) throw new Error('Form not found');
        const data = await res.json();
        setForm(data);
      } catch {
        setError('Could not load form.');
      } finally {
        setLoading(false);
      }
    }
    fetchForm();
  }, [formId]);

  function handleChange(questionId: string, value: string | string[] | number) {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }

  function handleCheckbox(questionId: string, option: string, checked: boolean) {
    setAnswers(prev => {
      const current = (prev[questionId] as string[]) ?? [];
      return {
        ...prev,
        [questionId]: checked
          ? [...current, option]
          : current.filter(o => o !== option),
      };
    });
  }

  async function handleSubmit() {
    const unanswered = form!.questions.filter(q => {
      if (!q.required) return false;
      const val = answers[q._id];
      return !val || (Array.isArray(val) && val.length === 0);
    });

    if (unanswered.length > 0) {
      alert(`Please answer all required questions.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId,
          answers: Object.entries(answers).map(([questionId, value]) => ({
            questionId,
            value,
          })),
        }),
      });

      if (!res.ok) throw new Error('Failed to submit');
      setSubmitted(true);
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading)   return <p style={{ padding: 32 }}>Loading...</p>;
  if (error)     return <p style={{ padding: 32, color: 'red' }}>{error}</p>;
  if (!form)     return <p style={{ padding: 32 }}>Form not found.</p>;
  if (submitted) return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 32, fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h2 style={{ color: '#673ab7' }}>✓ Response submitted!</h2>
      <p style={{ color: '#555' }}>Thank you for filling out this form.</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 32, fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ borderTop: '8px solid #673ab7', background: '#fff', borderRadius: 8, padding: 24, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: 28, fontWeight: 400, marginBottom: 8 }}>{form.title}</h1>
        <p style={{ color: '#555', fontSize: 14 }}>{form.description}</p>
      </div>

      {/* Questions */}
      {form.questions.map(q => (
        <div key={q._id} style={{ background: '#fff', borderRadius: 8, padding: 24, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ fontWeight: 500, marginBottom: 12 }}>
            {q.label}
            {q.required && <span style={{ color: 'red', marginLeft: 4 }}>*</span>}
          </p>

          {q.type === 'short' && (
            <input
              style={{ width: '100%', borderBottom: '1px solid #ccc', border: 'none', outline: 'none', padding: '4px 0', fontSize: 14 }}
              placeholder="Your answer"
              value={(answers[q._id] as string) ?? ''}
              onChange={e => handleChange(q._id, e.target.value)}
            />
          )}

          {q.type === 'paragraph' && (
            <textarea
              style={{ width: '100%', borderBottom: '1px solid #ccc', border: 'none', outline: 'none', padding: '4px 0', fontSize: 14, resize: 'vertical' }}
              placeholder="Your answer"
              rows={4}
              value={(answers[q._id] as string) ?? ''}
              onChange={e => handleChange(q._id, e.target.value)}
            />
          )}

          {q.type === 'multiple_choice' && q.options.map(opt => (
            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 14, cursor: 'pointer' }}>
              <input
                type="radio"
                name={q._id}
                value={opt}
                checked={answers[q._id] === opt}
                onChange={() => handleChange(q._id, opt)}
                style={{ accentColor: '#673ab7' }}
              />
              {opt}
            </label>
          ))}

          {q.type === 'checkboxes' && q.options.map(opt => (
            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 14, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={((answers[q._id] as string[]) ?? []).includes(opt)}
                onChange={e => handleCheckbox(q._id, opt, e.target.checked)}
                style={{ accentColor: '#673ab7' }}
              />
              {opt}
            </label>
          ))}

          {q.type === 'dropdown' && (
            <select
              style={{ fontSize: 14, padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc' }}
              value={(answers[q._id] as string) ?? ''}
              onChange={e => handleChange(q._id, e.target.value)}
            >
              <option value="">Choose</option>
              {q.options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}

          {q.type === 'date' && (
            <input
              type="date"
              style={{ fontSize: 14, padding: '4px 8px', border: '1px solid #ccc', borderRadius: 4 }}
              value={(answers[q._id] as string) ?? ''}
              onChange={e => handleChange(q._id, e.target.value)}
            />
          )}

          {q.type === 'time' && (
            <input
              type="time"
              style={{ fontSize: 14, padding: '4px 8px', border: '1px solid #ccc', borderRadius: 4 }}
              value={(answers[q._id] as string) ?? ''}
              onChange={e => handleChange(q._id, e.target.value)}
            />
          )}

          {q.type === 'linear_scale' && (
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map(n => (
                <label key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontSize: 14, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name={q._id}
                    value={n}
                    checked={answers[q._id] === n}
                    onChange={() => handleChange(q._id, n)}
                    style={{ accentColor: '#673ab7' }}
                  />
                  {n}
                </label>
              ))}
            </div>
          )}
        </div>
      ))} 
      <button
        onClick={handleSubmit}
        disabled={submitting}
        style={{ background: '#673ab7', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 24px', fontSize: 14, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
}
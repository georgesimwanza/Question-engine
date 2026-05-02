"use client";
import { useState } from 'react';
import style from './form.module.css';

type QuestionType =
  | 'short'
  | 'paragraph'
  | 'multiple_choice'
  | 'checkboxes'
  | 'dropdown'
  | 'date'
  | 'time'
  | 'linear_scale';

export interface Question {
  id: number;
  label: string;
  type: QuestionType;
  required: boolean;
  options: string[];
}

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'short',           label: 'Short answer' },
  { value: 'paragraph',       label: 'Paragraph' },
  { value: 'multiple_choice', label: 'Multiple choice' },
  { value: 'checkboxes',      label: 'Checkboxes' },
  { value: 'dropdown',        label: 'Dropdown' },
  { value: 'date',            label: 'Date' },
  { value: 'time',            label: 'Time' },
  { value: 'linear_scale',    label: 'Linear scale' },
];

let nextId = 1;

export default function Form() {
  const [title, setTitle] = useState('Untitled form');
  const [description, setDescription] = useState('Form description');
  const [questions, setQuestions] = useState<Question[]>([
    { id: nextId++, label: 'Question', type: 'short', required: false, options: ['Option 1'] },
  ]);
  const [saving, setSaving] = useState(false);         
  const [savedId, setSavedId] = useState<string | null>(null); 

  function addQuestion() {
    setQuestions(prev => [
      ...prev,
      { id: nextId++, label: 'Question', type: 'short', required: false, options: ['Option 1'] },
    ]);
  }

  function deleteQuestion(id: number) {
    setQuestions(prev => prev.filter(q => q.id !== id));
  }

  function updateQuestion(id: number, patch: Partial<Question>) {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...patch } : q));
  }

  function addOption(id: number) {
    setQuestions(prev =>
      prev.map(q =>
        q.id === id
          ? { ...q, options: [...q.options, `Option ${q.options.length + 1}`] }
          : q
      )
    );
  }

  function updateOption(id: number, index: number, value: string) {
    setQuestions(prev =>
      prev.map(q =>
        q.id === id
          ? { ...q, options: q.options.map((o, i) => (i === index ? value : o)) }
          : q
      )
    );
  }

  function removeOption(id: number, index: number) {
    setQuestions(prev =>
      prev.map(q =>
        q.id === id
          ? { ...q, options: q.options.filter((_, i) => i !== index) }
          : q
      )
    );
  }

  // NEW
  async function saveForm() {
    setSaving(true);
    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, questions }),
      });

      if (!res.ok) throw new Error('Failed to save');

      const data = await res.json();
      setSavedId(data._id);
      alert('Form saved!');
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  // NEW
  function clearForm() {
    setTitle('Untitled form');
    setDescription('Form description');
    setQuestions([{ id: nextId++, label: 'Question', type: 'short', required: false, options: ['Option 1'] }]);
    setSavedId(null);
  }

  return (
    <div className={style.page}>

      <div className={style.headerCard}>
        <input
          className={style['headerCard h1']}
          style={{
            fontSize: 28, fontWeight: 400, border: 'none',
            borderBottom: '2px solid #000000', outline: 'none',
            width: '100%', fontFamily: 'inherit', background: 'transparent',
            marginBottom: '0.35rem', color: '#202124',
          }}
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          style={{
            fontSize: 14, border: 'none',
            borderBottom: '1px solid #9e9e9e', outline: 'none',
            width: '100%', fontFamily: 'inherit', background: 'transparent',
            color: '#555',
          }}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      {questions.map(q => (
        <QuestionCard
          key={q.id}
          question={q}
          onUpdate={patch => updateQuestion(q.id, patch)}
          onDelete={() => deleteQuestion(q.id)}
          onAddOption={() => addOption(q.id)}
          onUpdateOption={(i, v) => updateOption(q.id, i, v)}
          onRemoveOption={i => removeOption(q.id, i)}
        />
      ))}

      <div className={style.addQuestionBar}>
        <button className={style.addQuestionBtn} onClick={addQuestion} title="Add question">
          +
        </button>
      </div>

      {/* UPDATED submit bar */}
      <div className={style.submitBar}>
        <button
          className={style.submitBtn}
          onClick={saveForm}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Form'}
        </button>
        <button className={style.clearBtn} onClick={clearForm}>
          Clear form
        </button>
      {savedId && (
          <div style={{ fontSize: 13, color: '#555', marginTop: 8 }}>
            ✓ Saved —{' '}
            <a href={`/Fill_out/${savedId}`} target="_blank" style={{ color: '#673ab7', marginRight: 12 }}>
              Share link →
            </a>
            <a href={`/responses/${savedId}`} target="_blank" style={{ color: '#673ab7' }}>
              View responses →
            </a>
          </div>
        )}
      </div>

    </div>
  );
}


interface QuestionCardProps {
  question: Question;
  onUpdate: (patch: Partial<Question>) => void;
  onDelete: () => void;
  onAddOption: () => void;
  onUpdateOption: (index: number, value: string) => void;
  onRemoveOption: (index: number) => void;
}

function QuestionCard({
  question, onUpdate, onDelete,
  onAddOption, onUpdateOption, onRemoveOption,
}: QuestionCardProps) {
  const { label, type, required, options } = question;
  const hasOptions = ['multiple_choice', 'checkboxes', 'dropdown'].includes(type);

  return (
    <div className={style.questionCard}>
      <div className={style.questionTop}>
        <input
          className={style.questionInput}
          value={label}
          onChange={e => onUpdate({ label: e.target.value })}
          placeholder="Question"
        />
        <select
          className={style.typeSelect}
          value={type}
          onChange={e => onUpdate({ type: e.target.value as QuestionType })}
        >
          {QUESTION_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <AnswerPreview
        type={type}
        options={options}
        onAddOption={onAddOption}
        onUpdateOption={onUpdateOption}
        onRemoveOption={onRemoveOption}
      />

      <div className={style.cardActions}>
        <label className={style.requiredToggle}>
          <input
            type="checkbox"
            checked={required}
            onChange={e => onUpdate({ required: e.target.checked })}
            style={{ accentColor: '#673ab7' }}
          />
          Required
        </label>
        <button className={style.deleteBtn} onClick={onDelete} title="Delete question">
          🗑
        </button>
      </div>
    </div>
  );
}

function AnswerPreview({
  type, options, onAddOption, onUpdateOption, onRemoveOption,
}: {
  type: QuestionType;
  options: string[];
  onAddOption: () => void;
  onUpdateOption: (i: number, v: string) => void;
  onRemoveOption: (i: number) => void;
}) {
  if (type === 'short') {
    return <input className={style.input} placeholder="Short answer text" disabled />;
  }

  if (type === 'paragraph') {
    return <textarea className={style.textarea} placeholder="Long answer text" rows={3} disabled />;
  }

  if (type === 'date') {
    return <input className={style.input} type="date" disabled style={{ maxWidth: 200 }} />;
  }

  if (type === 'time') {
    return <input className={style.input} type="time" disabled style={{ maxWidth: 160 }} />;
  }

  if (type === 'linear_scale') {
    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14, color: '#555' }}>
        {[1, 2, 3, 4, 5].map(n => (
          <label key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <input type="radio" disabled style={{ accentColor: '#673ab7' }} />
            {n}
          </label>
        ))}
      </div>
    );
  }

  if (type === 'dropdown') {
    return (
      <div>
        {options.map((opt, i) => (
          <div key={i} className={style.optionRow}>
            <span style={{ color: '#9e9e9e', fontSize: 14 }}>{i + 1}.</span>
            <input
              type="text"
              value={opt}
              onChange={e => onUpdateOption(i, e.target.value)}
            />
            <button className={style.removeBtn} onClick={() => onRemoveOption(i)}>×</button>
          </div>
        ))}
        <button className={style.addOptionBtn} onClick={onAddOption}>+ Add option</button>
      </div>
    );
  }

  const inputType = type === 'checkboxes' ? 'checkbox' : 'radio';
  return (
    <div>
      {options.map((opt, i) => (
        <div key={i} className={style.optionRow}>
          <input type={inputType} disabled style={{ accentColor: '#673ab7' }} />
          <input
            type="text"
            value={opt}
            onChange={e => onUpdateOption(i, e.target.value)}
          />
          <button className={style.removeBtn} onClick={() => onRemoveOption(i)}>×</button>
        </div>
      ))}
      <button className={style.addOptionBtn} onClick={onAddOption}>+ Add option</button>
    </div>
  );
}
'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './landing.module.css';

const TEMPLATES = [
  { label: 'Blank form', blank: true },
  { label: 'Contact info', color: 'blue' },
  { label: 'RSVP', color: 'green' },
  { label: 'Party invite', color: 'amber' },
];

const RECENT_FORMS = [
  { id: 1, name: 'T-Shirt Sign Up', date: 'Opened 15:01' },
  { id: 2, name: 'Untitled form', date: 'Opened 14:56' },
  { id: 3, name: 'Untitled form', date: 'Opened 11 Jan 2024' },
];

export default function LandingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/AuthPage');
    }
  }, [status, router]);

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return null;

  return (
    <div className={styles.page}>
      <section>
        <p className={styles.sectionTitle}>Start a new form</p>
        <div className={styles.newFormGrid}>
          {TEMPLATES.map((t) => (
            <div key={t.label} className={styles.formCard} onClick={() => t.blank && router.push('/forms')}>
              <div className={`${styles.cardThumb} ${t.blank ? styles.blankThumb : styles[t.color + 'Thumb']}`}>
                {t.blank ? (
                  <div className={styles.plusIcon} />
                ) : (
                  <TemplatePlaceholder color={t.color!} />
                )}
              </div>
              <div className={styles.cardLabel}>{t.label}</div>
            </div>
          ))}
        </div>
      </section>

      <hr className={styles.divider} />

      <section>
        <p className={styles.sectionTitle}>Recent forms</p>
        <div className={styles.recentGrid}>
          {RECENT_FORMS.map((form) => (
            <div key={form.id} className={styles.recentCard} onClick={() => router.push(`/fill-out/${form.id}`)}>
              <div className={styles.recentThumb}>
                <div className={styles.thumbTitleBar} />
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`${styles.thumbLine} ${styles[['l','m','s','l','m','s'][i]]}`} />
                ))}
              </div>
              <div className={styles.recentInfo}>
                <div className={styles.formsIcon}>
                  <FormsDocIcon />
                </div>
                <div className={styles.recentMeta}>
                  <p className={styles.recentName}>{form.name}</p>
                  <p className={styles.recentDate}>{form.date}</p>
                </div>
                <button className={styles.moreBtn} aria-label="More options">
                  <span /><span /><span />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function TemplatePlaceholder({ color }: { color: string }) {
  return (
    <div className={styles.templateThumb}>
      <div className={`${styles.tHeader} ${styles[color + 'Header']}`} />
      <div className={`${styles.tLine} ${styles.full} ${styles[color + 'Line']}`} />
      <div className={`${styles.tLine} ${styles.med} ${styles[color + 'Line']}`} />
      <div className={`${styles.tLine} ${styles.short}`} />
      <div className={`${styles.tLine} ${styles.full}`} />
    </div>
  );
}

function FormsDocIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="white">
      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
    </svg>
  );
}
export default function Privacy() {
  return (
    <main style={styles.main}>
      <h1 style={styles.h1}>Admit<span style={{ color: '#E8735A' }}>ly</span> — Privacy Policy</h1>
      <p style={styles.updated}>Last updated: [add today's date when you publish this]</p>

      <p style={styles.p}>
        This explains what Admitly collects, why, and what we don't do with it.
      </p>

      <h2 style={styles.h2}>What we collect</h2>
      <ul style={styles.ul}>
        <li>Your Google account email — used to identify you and track your free/paid status.</li>
        <li>The text of essays you submit — sent to generate your feedback.</li>
        <li>Payment information — handled entirely by Stripe. We never see or store your card number.</li>
      </ul>

      <h2 style={styles.h2}>How we use it</h2>
      <p style={styles.p}>
        Essay text is sent to Anthropic's Claude API to generate the feedback you asked for.
        Your email is used to track how many free reviews you've used and whether you're
        subscribed. If you're on a plan with version history, we also save your essay text and
        feedback so you can come back and see it again — this is only ever visible to you,
        tied to your own signed-in account, and never used to train any AI model.</p>

      <h2 style={styles.h2}>What we don't do</h2>
      <ul style={styles.ul}>
        <li>We don't sell your data to anyone.</li>
        <li>We don't share your essays with any third party except to generate your feedback.</li>
        <li>We don't use your essays for any purpose beyond the feedback you requested.</li>
      </ul>

      <h2 style={styles.h2}>Who else touches your data</h2>
      <ul style={styles.ul}>
        <li>Anthropic — generates your essay feedback.</li>
        <li>Supabase — hosts our database (email + usage counts only).</li>
        <li>Stripe — processes payments; we never see your full card details.</li>
        <li>Google — handles sign-in; we only ever receive your verified email address.</li>
      </ul>

      <h2 style={styles.h2}>Your rights</h2>
      <p style={styles.p}>
        You can request your account, usage record, and saved essay history be deleted at any
        time by emailing <a href="mailto:hello@admitly.io">hello@admitly.io</a>.
      </p>

      <h2 style={styles.h2}>Age</h2>
      <p style={styles.p}>
        Admitly is intended for high school and college-age students. If you are under 13,
        please have a parent or guardian help you use this site.
      </p>

      <h2 style={styles.h2}>Changes</h2>
      <p style={styles.p}>
        We may update this policy as Admitly changes. Continued use after an update means you
        accept the revised policy.
      </p>

      <h2 style={styles.h2}>Contact</h2>
      <p style={styles.p}>
        Questions? Email <a href="mailto:hello@admitly.io">hello@admitly.io</a>.
      </p>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: { maxWidth: 680, margin: '0 auto', padding: '48px 24px', fontFamily: 'Inter, sans-serif', color: '#2E2A24', lineHeight: 1.6 },
  h1: { fontFamily: 'Fraunces, serif', fontSize: 32, marginBottom: 4 },
  h2: { fontFamily: 'Fraunces, serif', fontSize: 20, marginTop: 32, marginBottom: 10 },
  p: { fontSize: 15, color: '#6F6A5D', marginBottom: 12 },
  ul: { fontSize: 15, color: '#6F6A5D', paddingLeft: 20, marginBottom: 12 },
  updated: { fontSize: 13, color: '#948C7C', marginBottom: 24 },
};

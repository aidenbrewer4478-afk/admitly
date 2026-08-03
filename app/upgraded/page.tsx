export default function Upgraded() {
  return (
    <main style={styles.main}>
      <div style={styles.badge}>✓</div>
      <h1 style={styles.h1}>You're on the Unlimited plan</h1>
      <p style={styles.p}>
        Unlimited essay reviews and feedback rounds, starting now. Head back to your Google
        Doc and reopen Admitly — it should already show your new plan.
      </p>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    maxWidth: 480,
    margin: '0 auto',
    padding: '80px 24px',
    fontFamily: 'Inter, sans-serif',
    textAlign: 'center',
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: 'rgba(122,155,118,0.18)',
    color: '#5C7A58',
    fontSize: 26,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  h1: { fontFamily: 'Fraunces, serif', fontSize: 28, color: '#2E2A24', marginBottom: 12 },
  p: { fontSize: 15, color: '#6F6A5D', lineHeight: 1.6 },
};

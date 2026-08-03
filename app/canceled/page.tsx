export default function Canceled() {
  return (
    <main style={styles.main}>
      <h1 style={styles.h1}>No charge made</h1>
      <p style={styles.p}>
        Checkout was canceled — your account is still on the free plan, nothing was charged.
        You can upgrade any time from the Admitly menu in your Google Doc.
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
  h1: { fontFamily: 'Fraunces, serif', fontSize: 28, color: '#2E2A24', marginBottom: 12 },
  p: { fontSize: 15, color: '#6F6A5D', lineHeight: 1.6 },
};

import { AssistantPanel } from '../components/assistant/assistant-panel';

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '2rem 1rem',
        maxWidth: '520px',
        margin: '0 auto',
      }}
    >
      <header style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontSize: '1.6rem',
            fontWeight: 700,
            color: '#1a1a2e',
            margin: '0 0 0.4rem',
          }}
        >
          🛒 depaneurIA
        </h1>
        <p style={{ color: '#666', margin: 0, fontSize: '0.95rem' }}>
          Commandez simplement en écrivant ce que vous voulez.
        </p>
      </header>

      <AssistantPanel />
    </main>
  );
}

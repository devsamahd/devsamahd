"use client";
export default function StudioError({ reset }: { reset: () => void }) {
  return (
    <main className="login-page">
      <section className="login-card">
        <span className="monogram">
          ds<span>_</span>
        </span>
        <h1>Studio couldn’t load.</h1>
        <p>
          Your content hasn’t been changed. Check server storage, then try
          again.
        </p>
        <button className="button primary" onClick={reset}>
          Try again
        </button>
        <a href="/">Back to portfolio</a>
      </section>
    </main>
  );
}

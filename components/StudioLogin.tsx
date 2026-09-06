"use client";
import { useState, type FormEvent } from "react";
import { ArrowRight, LockKeyhole, ArrowUpRight } from "lucide-react";
import type { CmsConfiguration } from "../lib/cms-auth";
export function StudioLogin({ configuration }: { configuration: CmsConfiguration }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const password = new FormData(event.currentTarget).get("password");
    try {
      const response = await fetch("/api/studio/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not connect. Please retry.",
      );
      setBusy(false);
    }
  }
  return (
    <main className="login-page">
      <div className="login-card">
        <a className="wordmark" href="/">
          <span className="monogram">
            ds<span>_</span>
          </span>
          <span>STUDIO</span>
        </a>
        <span className="login-icon">
          <LockKeyhole size={24} />
        </span>
        <h1>A space for your next chapter.</h1>
        <p>Keep your work, words, and portfolio up to date.</p>
        {configuration.ready ? (
          <form onSubmit={login}>
            <label className="field">
              Studio password
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                autoFocus
              />
            </label>
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            <button className="button primary" disabled={busy}>
              {busy ? "Signing in…" : "Enter Studio"}
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <div className="setup-note">
            <strong>One-time setup</strong>
            <p>
              The running server has not loaded both required settings. For a
              local run, put them in <code>.env.local</code> (not{" "}
              <code>.env.example</code>) and restart the server. For a hosted
              run, add them to the app&apos;s runtime environment and redeploy.
            </p>
            <ul>
              <li>
                <code>CMS_PASSWORD</code>: {configuration.password.valid
                  ? "loaded"
                  : configuration.password.loaded
                    ? `too short (${configuration.password.length}/24 characters)`
                    : "missing"}
              </li>
              <li>
                <code>CMS_SESSION_SECRET</code>: {configuration.sessionSecret.valid
                  ? "loaded"
                  : configuration.sessionSecret.loaded
                    ? `too short (${configuration.sessionSecret.length}/32 characters)`
                    : "missing"}
              </li>
            </ul>
          </div>
        )}
        <a href="/" className="text-link">
          Back to portfolio <ArrowUpRight size={14} />
        </a>
      </div>
    </main>
  );
}

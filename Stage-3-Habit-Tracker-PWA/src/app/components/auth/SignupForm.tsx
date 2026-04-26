"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "../../lib/auth";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = signup(email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.replace("/dashboard");
  }

  return (
    <form className="card form-grid" onSubmit={onSubmit}>
      <h1>Create account</h1>
      <label htmlFor="signup-email">Email</label>
      <input
        id="signup-email"
        data-testid="auth-signup-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <label htmlFor="signup-password">Password</label>
      <input
        id="signup-password"
        data-testid="auth-signup-password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      {error ? <p className="error-text">{error}</p> : null}

      <button data-testid="auth-signup-submit" type="submit">
        Sign Up
      </button>
    </form>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginForm } from "../components/auth/LoginForm";
import { getSession } from "../lib/auth";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (session) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <main className="page-center">
      <LoginForm />
      <p className="auth-alt-action">
        No account? <Link href="/signup">Sign up</Link>
      </p>
    </main>
  );
}

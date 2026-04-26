"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignupForm } from "../components/auth/SignupForm";
import { getSession } from "../lib/auth";

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (session) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <main className="page-center">
      <SignupForm />
      <p className="auth-alt-action">
        Already registered? <Link href="/login">Log in</Link>
      </p>
    </main>
  );
}

import { LoginForm } from '@/components/login-form';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const role = params.role === 'teacher' || params.role === 'parent' || params.role === 'admin' || params.role === 'student' ? params.role : 'student';

  return (
    <main className="login-page">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />
      <LoginForm initialRole={role} />
    </main>
  );
}

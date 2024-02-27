import LoginForm from '@/components/auth/LoginForm';
import { Notifications } from '@mantine/notifications';

export function LoginPage() {
  return (
    <>
      <Notifications position="top-right" zIndex={1000} autoClose={2000} />
      <LoginForm />
    </>
  );
}

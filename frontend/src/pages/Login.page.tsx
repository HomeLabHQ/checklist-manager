import { Notifications } from '@mantine/notifications';
import LoginForm from '@/components/auth/LoginForm';

export function LoginPage() {
  return (
    <>
      <Notifications position="top-right" zIndex={1000} autoClose={2000} />
      <LoginForm />
    </>
  );
}

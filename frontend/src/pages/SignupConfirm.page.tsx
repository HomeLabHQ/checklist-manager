import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Notifications, notifications } from '@mantine/notifications';
import { ActionIcon, Container, Paper, Title } from '@mantine/core';
import { IconLogin } from '@tabler/icons-react';
import { useAuthRegisterConfirmCreateMutation } from '@/redux/api';

export default function SignupConfirmPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const [confirm, { isError }] = useAuthRegisterConfirmCreateMutation();

  useEffect(() => {
    if (token) {
      confirm({ signUpConfirmRequest: { token } })
        .unwrap()
        .then(() => {
          notifications.show({ message: 'Confirmation successful', color: 'green' });
          navigate('/');
        })
        .catch((error) => {
          notifications.show({ message: JSON.stringify(error.data), color: 'red' });
        });
    }
  }, []);
  return (
    <>
      <Container size={800} my={40}>
        <Title ta="center">Signup confirmation</Title>
        <Paper shadow="md" radius="md">
          <Notifications position="top-right" zIndex={1000} autoClose={2000} />{' '}
          {isError && (
            <h1>
              I’m sorry, but the signup confirmation link you provided is not valid. Please
              double-check the link and try again.Or try to login/register again{' '}
              <ActionIcon component="a" href="/login" variant="filled" size="sm">
                <IconLogin />
              </ActionIcon>
            </h1>
          )}
        </Paper>
      </Container>
    </>
  );
}

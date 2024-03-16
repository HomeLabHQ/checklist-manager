import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Notifications, notifications } from '@mantine/notifications';
import { Container, Paper, Title } from '@mantine/core';
import { upperFirst } from '@mantine/hooks';
import { useAuthSocialJwtPairCreateMutation } from '@/redux/api';

export default function SocialLoginPage() {
  const location = useLocation();
  const { provider } = useParams();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');
  const [social] = useAuthSocialJwtPairCreateMutation();
  useEffect(() => {
    if (code && provider) {
      social({
        oAuth2InputRequest: {
          code,
          provider,
          redirect_uri: window.location.origin + window.location.pathname,
        },
      })
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
    <Container size={800} my={40}>
      <Title ta="center">Signup confirmation for social {upperFirst(provider ?? '')}</Title>
      <Paper shadow="md" radius="md">
        <Notifications position="top-right" zIndex={1000} autoClose={2000} />
      </Paper>
    </Container>
  );
}

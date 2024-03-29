import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Container,
  Group,
  Button,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { useToggle, upperFirst } from '@mantine/hooks';
import { IconBrandGoogle, IconBrandLinkedin } from '@tabler/icons-react';
import classes from './LoginForm.module.css';
import {
  useAuthCreateMutation,
  useAuthRegisterCreateMutation,
  useAuthSocialLoginsRetrieveQuery,
} from '../../redux/api';

export default function LoginForm() {
  const [auth] = useAuthCreateMutation();
  const [register] = useAuthRegisterCreateMutation();
  const navigate = useNavigate();
  const [type, toggle] = useToggle(['login', 'register']);
  const { data } = useAuthSocialLoginsRetrieveQuery();
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
  });
  const onFinish = (values: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }) => {
    if (type === 'login') {
      auth({ customTokenObtainPairRequest: { email: values.email, password: values.password } })
        .unwrap()
        .then(() => {
          notifications.show({ message: 'Login successful', color: 'green' });
          navigate('/');
        })
        .catch((error) => {
          notifications.show({ message: JSON.stringify(error.data), color: 'red' });
        });
    }
    if (type === 'register') {
      register({
        signUpRequest: {
          first_name: values.first_name ?? '',
          last_name: values.last_name ?? '',
          email: values.email,
          password: values.password,
        },
      })
        .unwrap()
        .then(() => {
          notifications.show({ message: 'Register successful', color: 'green' });
          navigate('/');
        })
        .catch((error) => {
          notifications.show({ message: JSON.stringify(error.data), color: 'red' });
        });
    }
  };
  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Title ta="center" size="sm">
          Login with
        </Title>
        <Group justify="center" p="sm">
          <Button
            leftSection={<IconBrandLinkedin />}
            onClick={() => {
              window.location.href = data?.linkedin_openidconnect ?? '';
            }}
          >
            LinkedIn
          </Button>
          <Button
            leftSection={<IconBrandGoogle />}
            onClick={() => {
              window.location.href = data?.google_oauth2 ?? '';
            }}
          >
            Google
          </Button>
        </Group>
        <Title ta="center" size="sm">
          Or continue with email
        </Title>
        <form onSubmit={form.onSubmit((values) => onFinish(values))}>
          {type === 'register' && (
            <>
              <TextInput
                {...form.getInputProps('first_name')}
                label="First name"
                placeholder="Your name"
                required
                mt="md"
              />
              <TextInput
                {...form.getInputProps('last_name')}
                label="Last name"
                placeholder="Your last name"
                required
                mt="md"
              />
            </>
          )}
          <TextInput
            {...form.getInputProps('email')}
            label="Email"
            placeholder="you@mantine.dev"
            required
          />
          <PasswordInput
            {...form.getInputProps('password')}
            label="Password"
            placeholder="Your password"
            required
            mt="md"
          />
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
              {type === 'register'
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" type="submit">
            {upperFirst(type)}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

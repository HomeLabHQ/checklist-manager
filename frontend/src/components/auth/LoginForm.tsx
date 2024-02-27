import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import classes from './LoginForm.module.css';
import { useAuthCreateMutation } from '../../redux/api';

export default function LoginForm() {
  const [auth] = useAuthCreateMutation();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
  });
  const onFinish = (values: { email: string; password: string }) => {
    auth({ customTokenObtainPairRequest: { email: values.email, password: values.password } })
      .unwrap()
      .then(() => {
        notifications.show({ message: 'Login successful', color: 'green' });
        navigate('/');
      })
      .catch((error) => {
        notifications.show({ message: JSON.stringify(error.data), color: 'red' });
      });
  };
  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor size="sm" component="button">
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit((values) => onFinish(values))}>
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
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

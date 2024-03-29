import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Button, Fieldset, Group, Select, Stack, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import {
  ProjectRead,
  ProjectRequest,
  useChecklistProjectCreateMutation,
  useChecklistProjectUpdateMutation,
} from '@/redux/api';
import { ProjectLevel } from '@/settings/constants';

export default function ProjectForm(props: Readonly<{ project?: ProjectRead }>) {
  const [create] = useChecklistProjectCreateMutation();
  const [update] = useChecklistProjectUpdateMutation();
  const navigate = useNavigate();
  const handleSubmit = (values: ProjectRequest) => {
    if (props.project) {
      update({ code: props.project.code, projectRequest: { ...values } })
        .unwrap()
        .then(() => {
          navigate(`/project/${values.code}`);
        })
        .catch((error) => {
          notifications.show({ message: JSON.stringify(error.data), color: 'red' });
        });
    } else {
      create({ projectRequest: { ...values } })
        .unwrap()
        .then(() => {
          navigate(`/project/${values.code}`);
        })
        .catch((error) => {
          notifications.show({ message: JSON.stringify(error.data), color: 'red' });
        });
    }
  };
  const form = useForm<ProjectRequest>({
    initialValues: structuredClone(props.project) ?? {
      title: '',
      code: '',
      level: ProjectLevel[0],
    },
  });
  return (
    <div>
      <form
        onSubmit={form.onSubmit((values) => {
          handleSubmit(values);
        })}
      >
        <Fieldset legend={props.project ? 'Edit Project' : 'Create Project'}>
          <Group>
            <TextInput mb="md" label="Project title" {...form.getInputProps('title')} />
            <TextInput mb="md" label="Project code" {...form.getInputProps('code')} />
            <Select
              mb="md"
              {...form.getInputProps('level')}
              label="Your favorite library"
              data={ProjectLevel.map((value) => value)}
            />
            <Stack>
              <Group>
                <Button mb="xs" type="submit">
                  Save Project
                </Button>
                <Button mb="xs" color="red">
                  Cancel
                </Button>
              </Group>
            </Stack>
          </Group>
        </Fieldset>
      </form>
    </div>
  );
}

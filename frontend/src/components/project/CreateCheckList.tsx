import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ActionIcon, Button, Fieldset, Group, Space, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowDown, IconGripVertical, IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { CheckListRequest, ProjectRead, useChecklistChecklistCreateMutation } from '@/redux/api';
import makeKey from '@/hooks/makeKey';

function CreateCheckList(props: Readonly<{ project: ProjectRead }>) {
  const navigate = useNavigate();
  const [addChecklist] = useChecklistChecklistCreateMutation();

  const form = useForm<CheckListRequest>({
    initialValues: {
      title: '',
      project: props.project.id,
      sections: [],
    },
  });

  const renderSectionItems = (index: number): JSX.Element => (
    <Fieldset legend={form.values.sections?.[index].title}>
      {form.values.sections?.[index].items?.map((item, idx) => (
        <Draggable key={makeKey(idx, `sections-${index}`)} index={idx} draggableId={idx.toString()}>
          {(provided) => (
            <div {...provided.draggableProps} ref={provided.innerRef}>
              <Group key={makeKey(idx, `sections-${index}`)} {...provided.dragHandleProps}>
                <Space w="xs" />
                <Text {...form.getInputProps(`sections.${index}.items.${idx}.order`)}>
                  {index + 1}.{item.order ? item.order + 1 : 1}
                </Text>
                <TextInput
                  label="Title"
                  {...form.getInputProps(`sections.${index}.items.${idx}.title`)}
                />
                <TextInput
                  label="Description"
                  {...form.getInputProps(`sections.${index}.items.${idx}.description`)}
                />
                <ActionIcon
                  color="red"
                  onClick={() => form.removeListItem(`sections.${index}.items`, idx)}
                >
                  <IconTrash size="1rem" />
                </ActionIcon>
              </Group>
            </div>
          )}
        </Draggable>
      ))}
    </Fieldset>
  );

  const sections = form.values.sections?.map((item, index) => (
    <Fieldset key={makeKey(index, 'section')}>
      <Draggable key={makeKey(index, 'section')} index={index} draggableId={`section-${index}`}>
        {(provided) => (
          <div {...provided.draggableProps} ref={provided.innerRef}>
            <Group {...provided.dragHandleProps}>
              <Text {...form.getInputProps(`sections.${index}.order`)}>
                {item.order ? item.order + 1 : 1}
              </Text>
              <IconGripVertical stroke={1.5} />
              <TextInput
                placeholder="Section Title"
                {...form.getInputProps(`sections.${index}.title`)}
              />
              <TextInput
                placeholder="Section description"
                {...form.getInputProps(`sections.${index}.description`)}
              />
              <ActionIcon color="red" onClick={() => form.removeListItem('sections', index)}>
                <IconTrash size="1rem" />
              </ActionIcon>
              <ActionIcon
                onClick={() => {
                  form.insertListItem(`sections.${index}.items`, {
                    order: item.items?.length ?? 0,
                    title: '',
                    description: '',
                  });
                }}
              >
                <IconArrowDown size="1rem" />
              </ActionIcon>
              <DragDropContext
                onDragEnd={({ destination, source }) => {
                  form.setFieldValue(
                    `sections.${index}.items.${source?.index}.order`,
                    destination?.index
                  );
                  form.setFieldValue(
                    `sections.${index}.items.${destination?.index}.order`,
                    source?.index
                  );
                  form.reorderListItem(`sections.${index}.items`, {
                    from: source?.index,
                    to: Number(destination?.index),
                  });
                }}
              >
                <Droppable droppableId="section-items" direction="vertical">
                  {(providedSection) => (
                    <div {...providedSection.droppableProps} ref={providedSection.innerRef}>
                      {form.values.sections?.[index].items?.length
                        ? renderSectionItems(index)
                        : null}
                      {providedSection.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Group>
          </div>
        )}
      </Draggable>
    </Fieldset>
  ));

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        addChecklist({ checkListRequest: { ...values } })
          .unwrap()
          .then(() => {
            navigate(`/project/${props.project.code}`);
          })
          .catch((error) => {
            notifications.show({ message: JSON.stringify(error.data), color: 'red' });
          });
      })}
    >
      <Fieldset legend="Create checklist">
        <Group>
          <TextInput mb="md" required label="Checklist title" {...form.getInputProps('title')} />
          <TextInput mb="md" label="Checklist description" {...form.getInputProps('description')} />
          <Stack>
            <Group>
              <Button mb="xs" type="submit">
                Save checklist
              </Button>
              <Button
                mb="xs"
                color="red"
                onClick={() => navigate(`/project/${props.project.code}`)}
              >
                Cancel
              </Button>
            </Group>
            <Button
              mb="xs"
              onClick={() => {
                form.insertListItem('sections', {
                  id: null,
                  title: '',
                  description: '',
                  order: form.values.sections?.length,
                  items: [],
                });
              }}
            >
              Add section
            </Button>
          </Stack>
        </Group>
        <Group>
          <DragDropContext
            onDragEnd={({ destination, source }) => {
              form.setFieldValue(`sections.${source?.index}.order`, destination?.index);
              form.setFieldValue(`sections.${destination?.index}.order`, source?.index);
              form.reorderListItem('sections', {
                from: source?.index,
                to: Number(destination?.index),
              });
            }}
          >
            <Droppable droppableId="section-list" direction="vertical">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {sections}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Group>
      </Fieldset>
    </form>
  );
}

export default CreateCheckList;

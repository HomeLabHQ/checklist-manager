import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ActionIcon, Button, Fieldset, Group, Space, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowDown, IconGripVertical, IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import {
  CheckListRead,
  CheckListRequest,
  ProjectRead,
  useChecklistChecklistUpdateMutation,
} from '@/redux/api';
import makeKey from '@/hooks/makeKey';

function EditCheckList(props: Readonly<{ project: ProjectRead; checklist: CheckListRead }>) {
  const navigate = useNavigate();
  const [update] = useChecklistChecklistUpdateMutation();

  const form = useForm<CheckListRequest>({
    initialValues: props.checklist,
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
                color="green"
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
    <div>
      <form>
        <Group>
          <Button
            mb="md"
            onClick={() =>
              form.insertListItem('sections', {
                title: '',
                description: '',
                order: form.values.sections?.length,
                items: [],
              })
            }
          >
            Add section
          </Button>
          <TextInput mb="md" placeholder="Checklist Title" {...form.getInputProps('title')} />
          <Button mb="md" type="submit">
            Save checklist
          </Button>
        </Group>
        <Group>
          <DragDropContext
            onDragEnd={({ destination, source }) => {
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
      </form>
    </div>
  );
}

export default EditCheckList;

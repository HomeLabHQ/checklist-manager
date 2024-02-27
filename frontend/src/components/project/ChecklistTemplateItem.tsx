import {
  CheckListRequest,
  CheckListSectionsRequest,
  useChecklistChecklistCreateMutation,
  useChecklistChecklistRetrieveQuery,
  useChecklistProjectRetrieveQuery,
} from '@/redux/api';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ActionIcon, Button, Fieldset, Group, Space, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowDown, IconGripVertical, IconTrash } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import make_key from '@/hooks/make_key';
function ChecklistTemplateItem() {
  const { template, project } = useParams();
  const navigate = useNavigate();
  const [addChecklist] = useChecklistChecklistCreateMutation();

  const { data: project_data } = useChecklistProjectRetrieveQuery(
    { code: project ?? '' },
    { skip: !project }
  );
  const { data: checklist_data } = useChecklistChecklistRetrieveQuery(
    { id: Number(template) },
    { skip: !template }
  );

  const form = useForm<CheckListRequest>({
    initialValues: {
      title: '',
      project: 0,
      sections: [],
    },
  });
  useEffect(() => {
    form.setValues({
      title: checklist_data?.title ?? '',
      project: project_data?.id,
      sections: checklist_data?.sections ?? [],
    });
  }, [project_data, checklist_data]);

  const renderSectionItems = (section: CheckListSectionsRequest, index: number): JSX.Element => {
    return (
      <Fieldset legend={section.title}>
        {form.values.sections?.[index].items?.map((item, idx) => (
          <Draggable
            key={make_key(idx, `sections-${index}`)}
            index={idx}
            draggableId={idx.toString()}
          >
            {(provided, snapshot) => (
              <div {...provided.draggableProps} ref={provided.innerRef}>
                <Group key={make_key(idx, `sections-${index}`)} {...provided.dragHandleProps}>
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
  };

  const sections = form.values.sections?.map((item, index) => (
    <Fieldset key={make_key(index, 'section')}>
      <Draggable key={make_key(index, 'section')} index={index} draggableId={`section-${index}`}>
        {(provided, snapshot) => (
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
                onClick={() =>
                  form.insertListItem(`sections.${index}.items`, {
                    order: item.items?.length ?? 0,
                    title: '',
                    description: '',
                  })
                }
              >
                <IconArrowDown size="1rem" />
              </ActionIcon>
              <DragDropContext
                onDragEnd={({ destination, source }) => console.log(destination, source)}
              >
                <Droppable droppableId="section-items" direction="vertical">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {form.values.sections?.[index].items?.length
                        ? renderSectionItems(item, index)
                        : null}
                      {provided.placeholder}
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
      <form
        onSubmit={form.onSubmit((values) =>
          addChecklist({ checkListRequest: { ...values } })
            .unwrap()
            .then(() => {
              navigate(`/project/${project}`);
            })
            .catch(() => {})
        )}
      >
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
            onDragEnd={({ destination, source }) => console.log(destination, source)}
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

export default ChecklistTemplateItem;

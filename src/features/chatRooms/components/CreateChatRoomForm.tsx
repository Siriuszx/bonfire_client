import { useAppDispatch } from '@/app/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { getErrorData } from '@/utils/getErrorData';

import { pushNotificationAdded } from '@/features/pushNotifications/pushNotificationsSlice';
import {
  createChatRoomModalClosed,
  usePostChatRoomMutation,
} from '../chatRoomsSlice';

import { PushNotificationType } from '@/types/PushNotification';
import type { MouseEventHandler } from 'react';

import Form from '@/components/form/Form';
import FormTitle from '@/components/form/FormTitle';
import InputLabel from '@/components/form/InputLabel';
import TextInput from '@/components/form/TextInput';
import ValidationError from '@/components/form/ValidationError';
import Button from '@/components/general/Button';
import IconButton from '@/components/general/IconButton';
import { FaXmark } from 'react-icons/fa6';

const CreateChatRoomBodySchema = z.object({
  participantUsername: z
    .string()
    .min(3, 'Username must contain at least 3 characters')
    .max(100, 'Username must contain at most 100 characters'),
});
type TCreateChatBody = z.infer<typeof CreateChatRoomBodySchema>;

type CreateChatRoomFormProps = { onCloseClick: MouseEventHandler };

const CreateChatRoomForm = ({ onCloseClick }: CreateChatRoomFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TCreateChatBody>({
    resolver: zodResolver(CreateChatRoomBodySchema),
  });

  const dispatch = useAppDispatch();
  const [postChatRoom] = usePostChatRoomMutation();

  const handleFormSubmit = async (data: TCreateChatBody): Promise<void> => {
    try {
      await postChatRoom(data).unwrap();
      dispatch(
        pushNotificationAdded({
          body: 'Chat successfully created',
          type: PushNotificationType.SUCCESS,
        }),
      );
      dispatch(createChatRoomModalClosed());
    } catch (err) {
      const errorData = getErrorData(err);
      dispatch(
        pushNotificationAdded({
          body: `Create chat: "${errorData.message}"`,
          type: PushNotificationType.ERROR,
        }),
      );
    }
  };

  return (
    <Form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col items-start gap-4 rounded-md bg-white p-7 shadow-md"
    >
      <FormTitle className="flex w-full items-center justify-between">
        <span>Create chat</span>
        <IconButton
          aria-label="Close Form"
          onClick={onCloseClick}
          className="p-0"
        >
          <FaXmark size="1rem" />
        </IconButton>
      </FormTitle>
      <InputLabel htmlFor="create-chat-username">
        Enter participant username
      </InputLabel>
      <TextInput
        className="min-w-72"
        {...register('participantUsername')}
        id="create-chat-username"
        placeholder="e.g. user01"
      />
      {errors.participantUsername && (
        <ValidationError visible={!!errors.participantUsername}>
          {errors.participantUsername?.message}
        </ValidationError>
      )}
      <Button className="w-full" type="submit">
        Create
      </Button>
    </Form>
  );
};

export default CreateChatRoomForm;

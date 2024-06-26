import { useAppSelector } from '@/app/hooks';

import { selectMessagesByChatId } from '@/features/messages/messagesSlice';

const useChatLastMessage = (chatId: string) => {
  const messages = useAppSelector(selectMessagesByChatId(chatId, 0));

  return messages ? messages[0] : undefined;
};

export default useChatLastMessage;

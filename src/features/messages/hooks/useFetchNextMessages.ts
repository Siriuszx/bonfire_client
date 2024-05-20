import { useAppDispatch, useAppSelector } from '@/app/hooks';

import {
  hasMoreSet,
  messagesApiSlice,
  pageCountIncreased,
  selectMessageListState,
  useGetMessagesPageCountQuery,
} from '../messagesSlice';

const useHandleFetchNextMessages = (chatRoomId: string) => {
  const { data: totalPageCount } = useGetMessagesPageCountQuery({ chatRoomId });
  const { currentPage, hasMore } = useAppSelector(
    selectMessageListState(chatRoomId),
  );

  const nextPage = currentPage + 1;

  const dispatch = useAppDispatch();

  // FIXME: remove comment
  console.log(`Total: ${totalPageCount}`);
  console.log(`Current Page: ${currentPage}`);

  const fetchNext = async (): Promise<void> => {
    if (nextPage <= totalPageCount!) {
      await dispatch(
        messagesApiSlice.endpoints.getMessages.initiate({
          chatRoomId,
          page: nextPage,
        }),
      ).unwrap();
      dispatch(pageCountIncreased(chatRoomId));
    } else {
      dispatch(hasMoreSet({ chatRoomId, hasMore: false }));
    }
  };

  return { fetchNext, currentPage, hasMore };
};

export default useHandleFetchNextMessages;

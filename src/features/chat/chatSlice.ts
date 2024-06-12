import { createSlice } from '@reduxjs/toolkit';

import { apiSlice } from '../api/apiSlice';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';

type ChatState = {
  selectedChatId?: string;
  isSidebarOpen: boolean;
};

const initialState: ChatState = {
  selectedChatId: undefined,
  isSidebarOpen: true,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    selectedChatIdSet: (state, action: PayloadAction<string>) => {
      if (state.selectedChatId !== action.payload)
        state.selectedChatId = action.payload;
    },
    selectedChatCleared: (state) => {
      state.selectedChatId = undefined;
    },
    sidebarOpened: (state) => {
      state.isSidebarOpen = true;
    },
    sidebarClosed: (state) => {
      state.isSidebarOpen = false;
    },
  },
});

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    postParticipant: builder.mutation<
      void,
      { chatRoomId: string; body: { participantUsername: string } }
    >({
      query: ({ chatRoomId, body }) => ({
        url: `/chat-rooms/${chatRoomId}/participants`,
        method: 'POST',
        body,
      }),
    }),
    deleteChatRoom: builder.mutation<void, { chatRoomId: string }>({
      query: ({ chatRoomId }) => ({
        url: `/chat-rooms/${chatRoomId}/participants`,
        method: 'DELETE',
        body: { chatRoomId },
      }),
    }),
  }),
});

export const {
  selectedChatIdSet,
  selectedChatCleared,
  sidebarOpened,
  sidebarClosed,
} = chatSlice.actions;

export const { usePostParticipantMutation, useDeleteChatRoomMutation } =
  chatApiSlice;

export default chatSlice;

export const selectSelectedChatId = (state: RootState) =>
  state.chat.selectedChatId;

export const selectIsSidebarOpen = (state: RootState) =>
  state.chat.isSidebarOpen;

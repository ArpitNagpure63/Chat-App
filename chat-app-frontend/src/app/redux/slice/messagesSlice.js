import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name: 'messages',
    initialState: {
        conversations: [],
    },
    reducers: {
        setNewConversation: (state, action) => {
            state.conversations.push(action.payload);
        },
    },
});

export const { setNewConversation } = messageSlice.actions;

export default messageSlice.reducer;

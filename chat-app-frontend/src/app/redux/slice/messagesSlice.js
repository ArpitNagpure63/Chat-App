import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const sendNewMessage = createAsyncThunk('chat/send', async ({ message, recieverID }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/message/send/${recieverID}`,
        {
            credentials: 'include',
            method: 'POST',
            headers: {
                ['content-type']: 'application/json'
            },
            body: JSON.stringify({ message })
        }
    );
    return response.json();
});

export const getAllMessages = createAsyncThunk('chat/get', async ({ recieverID }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/message/${recieverID}`,
        {
            credentials: 'include',
            method: 'GET',
            headers: {
                ['content-type']: 'application/json'
            },
        }
    );
    return response.json();
});

export const getUserConversation = createAsyncThunk('chat/conversation', async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/conversation/`,
        {
            credentials: 'include',
            method: 'GET',
            headers: {
                ['content-type']: 'application/json'
            },
        }
    );
    return response.json();
});

const messageSlice = createSlice({
    name: 'messages',
    initialState: {
        userFriendsList: [],
        onGoingUserChat: null,
        isLoading: false,
        isMessageSending: false,
        errorMessage: '',
        isError: false,
        chats: []
    },
    reducers: {
        setNewConversation: (state, action) => {
            state.userFriendsList.unshift(action.payload);
        },
        setNewChat: (state, action) => {
            state.onGoingUserChat = action.payload;
        },
        resetConversation: (state) => {
            state.userFriendsList = [];
            state.onGoingUserChat = null;
            state.isLoading = false;
            state.errorMessage = '';
            state.isError = false;
            state.chats = [];
        }
    },
    extraReducers(builder) {
        builder
            .addCase(sendNewMessage.pending, (state) => {
                state.isMessageSending = true;
            })
            .addCase(sendNewMessage.fulfilled, (state, action) => {
                state.isMessageSending = false;
                if (action.payload.isError) state.isError = true;
                if (action.payload.error) state.errorMessage = action.payload.error;
                if (action.payload.newMessasge) {
                    state.chats.push(action.payload.newMessasge)
                }
            })
            .addCase(sendNewMessage.rejected, (state) => {
                state.isMessageSending = false;
            })
            .addCase(getAllMessages.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllMessages.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.isError) state.isError = true;
                if (action.payload.error) state.errorMessage = action.payload.error;
                if (action.payload.allMessages) {
                    state.chats = action.payload.allMessages;
                }
            })
            .addCase(getAllMessages.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(getUserConversation.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUserConversation.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.isError) state.isError = true;
                if (action.payload.error) state.errorMessage = action.payload.error;
                if (action.payload.userConversations) {
                    state.userFriendsList = action.payload.userConversations;
                }
            })
            .addCase(getUserConversation.rejected, (state) => {
                state.isLoading = false;
            })
    }
});

export const { setNewConversation, setNewChat, resetConversation } = messageSlice.actions;

export default messageSlice.reducer;

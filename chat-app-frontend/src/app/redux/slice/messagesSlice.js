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

const messageSlice = createSlice({
    name: 'messages',
    initialState: {
        userList: [],
        onGoingUserChat: null,
        isLoading: false,
        errorMessage: '',
        isError: false,
        chats: []
    },
    reducers: {
        setNewConversation: (state, action) => {
            state.userList.push(action.payload);
        },
        setNewChat: (state, action) => {
            state.onGoingUserChat = action.payload;
        },
        resetConversation: (state) => {
            state.userList = [];
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
                state.isLoading = true;
            })
            .addCase(sendNewMessage.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.isError) state.isError = true;
                if (action.payload.error) state.errorMessage = action.payload.error;
                if (action.payload.newMessasge) {
                    state.chats.push(action.payload.newMessasge)
                }
            })
            .addCase(sendNewMessage.rejected, (state) => {
                state.isLoading = false;
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
    }
});

export const { setNewConversation, setNewChat, resetConversation } = messageSlice.actions;

export default messageSlice.reducer;

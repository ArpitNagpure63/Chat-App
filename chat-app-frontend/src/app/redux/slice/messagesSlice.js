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

export const getOtherUsers = createAsyncThunk('chat/user', async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/users`,
        {
            credentials: 'include',
            method: 'GET',
            headers: {
                ['content-type']: 'application/json'
            }
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
        chats: [],
        onlineUsersList: [],
        unreadMessages: [],
        allUsers: [],
    },
    reducers: {
        setNewConversation: (state, action) => {
            state.userFriendsList.unshift(action.payload);
        },
        setNewChat: (state, action) => {
            state.onGoingUserChat = action.payload;
            if (state.unreadMessages.length) {
                const newUnreadMessages = state.unreadMessages.filter((item) => item !== action.payload._id);
                state.unreadMessages = newUnreadMessages;
            }
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsersList = action.payload;
        },
        addNewChatMessage: (state, action) => {
            const { message: { senderID } } = action.payload;
            if (senderID === state.onGoingUserChat?._id) state.chats.push(action.payload.message);
            else {
                const isUserFriend = state.userFriendsList.some((item) => item._id === senderID);
                if (isUserFriend) {
                    state.unreadMessages.push(senderID);
                } else {
                    const newFriend = state.allUsers.find((item) => item._id === senderID);
                    state.userFriendsList.unshift(newFriend);
                    state.unreadMessages.push(senderID);
                }
            }
        },
        resetConversation: (state) => {
            state.userFriendsList = [];
            state.onGoingUserChat = null;
            state.isLoading = false;
            state.errorMessage = '';
            state.isError = false;
            state.chats = [];
            state.onlineUsersList = [];
            state.unreadMessages = [];
            state.allUsers = [];
        },
    },
    extraReducers(builder) {
        builder
            .addCase(getOtherUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getOtherUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.isError) state.isError = true;
                if (action.payload.error) state.errorMessage = action.payload.error;
                if (action.payload.users) {
                    state.allUsers = [...action.payload.users];
                }
            })
            .addCase(getOtherUsers.rejected, (state) => {
                state.isLoading = false;
            })
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

export const { setNewConversation, setNewChat, setOnlineUsers, resetConversation, addNewChatMessage } = messageSlice.actions;

export default messageSlice.reducer;

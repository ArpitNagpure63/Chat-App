const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const signUpNewUser = createAsyncThunk('auth/signup', async ({ name, username, password, gender, randomAvatar }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/signup`,
        {
            credentials: 'include',
            method: 'POST',
            headers: {
                ['content-type']: 'application/json'
            },
            body: JSON.stringify({ name, username, password, gender, randomAvatar })
        }
    );
    return response.json();
});

export const loginUser = createAsyncThunk('auth/login', async ({ username, password }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/login`,
        {
            credentials: 'include',
            method: 'POST',
            headers: {
                ['content-type']: 'application/json'
            },
            body: JSON.stringify({ username, password })
        }
    );
    return response.json();
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/logout`,
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

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userAuthenticated: false,
        userInfo: null,
        isLoading: false,
        isError: false,
        errorMessage: '',
        otherUsers: [],
    },
    reducers: {
        resetErrorState: (state) => {
            state.isError = false;
            state.errorMessage = '';
        },
        setErrorState: (state) => {
            state.isError = true;
        },
        setErrorMessage: (state, action) => {
            state.errorMessage = action.payload;
        },
        setUserAuthState: (state, action) => {
            state.userAuthenticated = true;
            state.userInfo= action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(loginUser.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.isError) state.isError = true;
                if (action.payload.error) state.errorMessage = action.payload.error;
                if (action.payload.user) {
                    state.userInfo = action.payload.user;
                    state.userAuthenticated = true;
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(signUpNewUser.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(signUpNewUser.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.isError) state.isError = true;
                if (action.payload.error) state.errorMessage = action.payload.error;
                if (action.payload.user) {
                    state.userInfo = action.payload.user;
                    state.userAuthenticated = true;
                }
            })
            .addCase(signUpNewUser.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(getOtherUsers.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getOtherUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.isError) state.isError = true;
                if (action.payload.error) state.errorMessage = action.payload.error;
                if (action.payload.users) {
                    state.otherUsers = [...action.payload.users];
                }
            })
            .addCase(getOtherUsers.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.userAuthenticated = false;
                state.userInfo = null;
                state.isLoading = false;
                state.isError = false;
                state.errorMessage = '';
                state.otherUsers = [];
            })
            .addCase(logoutUser.rejected, (state) => {
                state.isLoading = false;
            })
    }
});

export const { resetErrorState, setErrorState, setErrorMessage, setUserAuthState } = userSlice.actions;

export default userSlice.reducer;

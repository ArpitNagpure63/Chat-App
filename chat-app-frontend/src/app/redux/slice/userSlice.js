const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const signUpNewUser = createAsyncThunk('auth/signup', async ({ name, username, password, gender, randomAvatar }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/signup`,
        {
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
            method: 'POST',
            headers: {
                ['content-type']: 'application/json'
            },
            body: JSON.stringify({ username, password })
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
        errorMessage: ''
    },
    reducers: {
        resetErrorState: (state, _action) => {
            state.isError = false;
            state.errorMessage = '';
        },
        setErrorState: (state, action) => {
            state.isError = true;
        },
        setErrorMessage: (state, action) => {
            state.errorMessage = action.payload;
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
    }
});

export const { resetErrorState, setErrorState, setErrorMessage } = userSlice.actions;

export default userSlice.reducer;

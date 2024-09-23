import { configureStore, createSlice } from '@reduxjs/toolkit';


//A reducer is a function that specifies how the state of the application changes in response to an action. It takes the current state and an action as arguments and returns a new state.
//A slice is a concept introduced in Redux Toolkit that combines actions and reducers in a single place.
const nameSlice = createSlice({
    name: 'userName',
    initialState: {
        user: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        clearUser: (state, action) => {
            state.user = null
        }
    }
});

const currentUserSlice = createSlice({
    name: 'CurrUser',
    initialState: {
        user: null,
        id: 0
    },
    reducers: {
        setCurrentUser: (state, action) => {
            state.user = action.payload.user;
            state.id = action.payload.id;
        },
        clearCurrentUser: (state, action) => {
            state.user = null;
            state.id = null;
        },
    }
});

export const { setUser, clearUser } = nameSlice.actions;
export const { setCurrentUser, clearCurrentUser } = currentUserSlice.actions;

const store = configureStore({
    reducer: {
        userName: nameSlice.reducer,  // Add reducers here
        currentUser: currentUserSlice.reducer
    },
});

export default store;
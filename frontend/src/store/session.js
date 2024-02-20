import { csrfFetch } from "./csrf";

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

// const ADD_ARTICLE = 'article/addArticle';

// action
const setUser = (user) => {
    return {
        type: SET_USER,
        payload: user
    }
}

const removeUser = () => {
    return {
        type: REMOVE_USER
    }
}

//thunk creator
export const login = (user) => async (dispatch) => {
    const { credential, password } = user;
    const response = await csrfFetch('/api/session', {
        method: 'POST',
        body: JSON.stringify({
            credential,
            password
        })
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    // return data;
    return response;
}

export const logout = () => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
        method: 'DELETE'
    });

    if (response.ok) {
        dispatch(removeUser());
        // return await response.json();
        return response;
    }
}

export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch('/api/session');
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
}

export const signup = (user) => async (dispatch) => {
    const {username, firstName, lastName, email, password} = user;
    const response = await csrfFetch('/api/users', {
        method: 'POST',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
            username,
            firstName,
            lastName,
            email,
            password
        })
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
}

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload };
        case REMOVE_USER:
            return { ...state, user: null };
        default:
            return state;
    }
}

export default sessionReducer;

import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = 'spot/getALlSpots';
const CREATE_SPOT = 'spot/creatSpot';

// action
const getALlSpotsAction = () => {
  return {
    type: GET_ALL_SPOTS
  }
}

const createSpotAction = (spot) => {
  return {
    type: CREATE_SPOT,
    payload: spot
  }
}

// Thunk Creators
export const getAllSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');
  dispatch(getALlSpotsAction());
  return response;
}

export const createSpot = (spot) => async (dispatch) => {
  const {address, city, state, country, lat, lng, description, price} = spot;
  const response = await csrfFetch('/api/spots', {
    method: 'POST',
    body: JSON.stringify({
      address,
      city,
      state,
      country,
      lat,
      lng,
      description,
      price
    })
  });
  if (response.ok) {
    dispatch(createSpotAction(response));
  }
}

const initialState = {};

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS:
      return {...state, Spots:}
  }
}

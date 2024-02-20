import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = 'spot/getALlSpots';
const CREATE_SPOT = 'spot/creatSpot';
const GET_SPOT_BY_ID = 'spot/getSpotById';
const DELETE_SPOT = 'spot/deleteSpot'
const EDIT_SPOT = 'spot/editSpot';

// action
const getALlSpotsAction = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    payload: spots
  }
}

const createSpotAction = (spot) => {
  return {
    type: CREATE_SPOT,
    payload: spot
  }
}

const getSpotByIdAction = (spot) => {
  return {
    type: GET_SPOT_BY_ID,
    payload: spot
  }
}

const deleteSpotAction = (spotId) => {
  return {
    type: DELETE_SPOT,
    payload: spotId
  }
}

const editSpotAction = (spot) => {
  return {
    type: EDIT_SPOT,
    payload: spot
  }
}

// Thunk Creators
export const getAllSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');
  const data = await response.json();

  dispatch(getALlSpotsAction(data.Spots));
  return response;
}

export const createSpot = (spot) => async (dispatch) => {
  const { address, city, state, country, lat, lng, name, description, price } = spot;
  console.log("spot ======> ", spot)
  const response = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    })
  });
  console.log("response ======> ", response)
  if (response.ok) {
    console.log("OK")
    const newSpot = await response.json()
    dispatch(createSpotAction(newSpot));
    return newSpot;
  }
  console.log("not ok")
  return await response.json();
}

export const editSpot = (spot) => async (dispatch) => {
  const { address, city, state, country, lat, lng, name, description, price } = spot;
  const response = await csrfFetch(`/api/spots/${spot.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    })
  });
  // console.log(" response ==============> ", await response.json())
  if (response.ok) {
    dispatch(editSpotAction(response));
    return spot;
  }
}

export const getSpotById = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  const data = await response.json();

  dispatch(getSpotByIdAction(data));
  return response;
}

export const deleteSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    dispatch(deleteSpotAction(spotId));
  }
  return response;
}

const initialState = { Spots: {}, spotShow: {} };

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS: {
      const newObj = {};
      action.payload.forEach(el => newObj[el.id] = { ...el });
      return { ...state, Spots: { ...newObj } };
    }
    case CREATE_SPOT:
      return { ...state, Spots: {...state.Spots, ...{[action.payload.id]: action.payload}}};
    case GET_SPOT_BY_ID:
      return { ...state, spotShow: { ...action.payload } };
    case DELETE_SPOT: {
      const newState = {...state};
      delete newState.Spots[action.payload];
      return newState;
    }
    case EDIT_SPOT:
      return {...state, Spots: {...state.Spots, ...{[action.payload.id]: action.payload}}};
    default:
      return state;
  }
}

export default spotReducer;

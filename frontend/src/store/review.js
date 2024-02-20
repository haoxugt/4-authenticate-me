import { csrfFetch } from "./csrf";

const GET_REVIEWS_BY_SPOTID = 'review/getReviewsBySpotId';

// action
const getReviewsBySpotIdAction = (reviews) => {
  return {
    type: GET_REVIEWS_BY_SPOTID,
    payload: reviews
  }
}

//
// Thunk Creators
export const getReviewsBySpotIdThunk = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getReviewsBySpotIdAction(data.Reviews));
    return data;
  }
  return response;
}

const initialState = {};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REVIEWS_BY_SPOTID: {
      const newObj = {};
      action.payload.forEach(el => newObj[el.id] = { ...el });
      return { ...state, ...newObj };
    }
    default:
      return state;
  }
}

export default reviewReducer;

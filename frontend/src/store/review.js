import { csrfFetch } from "./csrf";

const GET_REVIEWS_BY_SPOTID = 'review/getReviewsBySpotId';
// const CREATE_REVIEW = 'review/createReview';

// action
const getReviewsBySpotIdAction = (reviews) => {
  return {
    type: GET_REVIEWS_BY_SPOTID,
    payload: reviews
  }
}

// const createReviewAction = (review) => {
//   return {
//     type: CREATE_REVIEW,
//     payload: review
//   }
// }

//
// Thunk Creators
export const getReviewsBySpotIdThunk = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  // console.log(" data ========> ", await response.json())
  if (response.ok) {
    const data = await response.json();
    dispatch(getReviewsBySpotIdAction(data.Reviews));
    return data;
  }
}

export const createReviewThunk = (spotId, reviewObj) => async (dispatch) => {
  const { review, stars } = reviewObj;
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      review,
      stars
    })
  });

  if (response.ok) {
    // dispatch(createReviewAction(data));
    const data = dispatch(getReviewsBySpotIdThunk(spotId));
    return data;
  }
}

export const deleteReviewThunk = (review) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${review.id}`, {
    method: 'DELETE'
  })

  if (response.ok) {
    // dispatch(createReviewAction(data));
    const data = dispatch(getReviewsBySpotIdThunk(review.spotId));
    return data;
  }
}

const initialState = {};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REVIEWS_BY_SPOTID: {
      const newObj = {};
      if (action.payload !== "None") {
        action.payload.forEach(el => newObj[el.id] = { ...el });
      }
      return { ...newObj };
    }
    // case CREATE_REVIEW: {
    //   return {...state, ...{[action.payload.id]: action.payload}};
    // }
    default:
      return state;
  }
}

export default reviewReducer;

import { csrfFetch } from "./csrf";

const ADD_REVIEW = 'spots/AddReview';
const DELETE_REVIEW = 'spots/DeleteReview';

const addReview = (review) =>  ({
    type: ADD_REVIEW,
    payload: review
})

const deleteReview = (review) => ({
    type: DELETE_REVIEW,
    payload: review
})

export const postReview = (spotId, review, stars) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews` , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {review, stars}
            )
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(addReview(data));
        return data;
    }

}

export const removeReview = (reviewId) => async (dispatch) => {
        const res = await csrfFetch(`/api/reviews/${reviewId}`, {
            method: 'DELETE',
        })
        const data = await res.json();
        dispatch(deleteReview(data));
        return data;
}


const initialState = {};

const reviewReducer = (state = initialState, action) => {
    let newState = { ...state };

    switch(action.type) {
        case ADD_REVIEW:
            return {
                ...newState,
                reviews: action.payload
            }
        case DELETE_REVIEW:
            delete newState.reviews[action.spotId]
            return newState
         default:
            return state
    }
}

export default reviewReducer;
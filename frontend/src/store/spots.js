import { csrfFetch } from "./csrf";

const GET_CURRENT_SPOT = 'spots/getCurrentSpot';
const GET_SPOTS = 'spots/getAllSpots';
const ADD_SPOT = 'spots/create';
const GET_REVIEWS = 'spots/getReviews';
const DELETE_SPOT = 'spots/deleteReviews';

const getCurrentSpot = (spot) => ({
    type: GET_CURRENT_SPOT,
    payload: spot,
});

const getAllSpots = (spots) => ({
    type: GET_SPOTS,
    payload: spots,
});

const addSpot = (spot) => ({
    type: ADD_SPOT,
    payload: spot,
});

const getReviews = (reviews) => ({ 
    type: GET_REVIEWS,
    payload: reviews,
})

const deleteSpot = (spot) => ({
    type: DELETE_SPOT,
    payload: spot,
})

export const getSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots');

    if (res.ok) {
        const list = await res.json();
        dispatch(getAllSpots(list));
        return list;
    };
};

export const getReviewsThunk = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const data = await res.json();
    dispatch(getReviews(data));
    return data;
}

export const getCurrentSpotThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`);
    const data = await res.json();
    dispatch(getCurrentSpot(data));
    return data;
}


export const createSpot = (
    spot
) => async (dispatch) => {
    const {country, address, city, state, lat, lng, description, name, price, previewImage} = spot

    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify(
            {
                country, address, city, state, lat, lng, description, name, price, previewImage
            }
        )
    });

    // const res2 = await fetch(`/api/spots/${spot.id}/images`, {
    //         method: 'POST',
    //         body: JSON.stringify(
    //             {url, preview}
    //         )
    // })
    if(res.ok ){
        const data = await res.json();
        // const data2 = await res2.json();
    
        dispatch(addSpot(data));
        // dispatch(addImage(data));

        return data
    }
}



const initialState = { }

const spotReducer = (state = initialState, action) => {
    let newState = { ...state }
    switch (action.type) {
        case GET_CURRENT_SPOT:
            return {
                ...newState,
                currentSpot: action.payload
            }
        case GET_SPOTS: 
            return {
            ...newState,
            spots: action.payload
            }
        case ADD_SPOT:
            return {
                ...newState,
                spots: action.payload
            }
        case GET_REVIEWS:
            return {
                ...newState,
                reviews: action.payload 
            }
        case DELETE_SPOT:
                delete newState.spots[action.spotId]
                return newState
        default: 
        return state;
    }
}

export default spotReducer
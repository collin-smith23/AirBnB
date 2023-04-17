import { csrfFetch } from "./csrf";

const GET_CURRENT_SPOT = 'spots/getCurrentSpot';
const USER_SPOTS = 'spots/userSpots'
const GET_SPOTS = 'spots/getAllSpots';
const ADD_SPOT = 'spots/create';
const EDIT_SPOT = 'spots/edit';
const GET_REVIEWS = 'spots/getReviews';
const DELETE_SPOT = 'spots/deleteReviews';

const getCurrentSpot = (spot) => ({
    type: GET_CURRENT_SPOT,
    payload: spot,
});

const userSpots = (spots) => ({
    type: USER_SPOTS,
    payload: spots
})
const getAllSpots = (spots) => ({
    type: GET_SPOTS,
    payload: spots,
});
const addSpot = (spot) => ({
    type: ADD_SPOT,
    payload: spot,
});
const editSpot = (spot) => ({
    type: EDIT_SPOT,
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
export const getUserSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots/current');

    if(res.ok) {
        const spots = res.json();
        dispatch(userSpots(spots));
        return userSpots;
    }

}

export const getCurrentSpotThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`);
    const data = await res.json();
    dispatch(getCurrentSpot(data));
    return data;
}

export const getReviewsThunk = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const data = await res.json();
    dispatch(getReviews(data));
    return data;
}



export const createSpot = (
    spot
) => async (dispatch) => {
    const {country, address, city, state, lat, lng, description, name, price, previewImage} = spot;

    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify(
            {
                country, address, city, state, lat, lng, description, name, price, previewImage
            }
        )
    });

    if(res.ok ){
        const data = await res.json();
        dispatch(addSpot(data));

        return data
    }
}

export const updateSpot = (spotId, spot) => async (dispatch) => {
    const { country, address, city, state, lat, lng, description, name, price } = spot;

    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(
            {
                country, address, city, state, lat, lng, description, name, price
            }
        )
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(editSpot(data))
        return data;
    }
}

export const removeSpot = (spotId) => async (dispatch) => {
    // const {id} = spot;

    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE',
    })
    const data = await res.json();
    dispatch(deleteSpot(data))
    return data;
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
        case USER_SPOTS:
            return {
                ...newState,
                userSpots: action.payload
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
        case EDIT_SPOT:
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
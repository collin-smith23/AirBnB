import { csrfFetch } from "./csrf";
const GET_CURRENT_SPOT = 'spots/getCurrentSpot';
const GET_SPOTS = 'spots/getAllSpots';
const CREATE_SPOT = 'spots/create';
const GET_REVIEWS = 'spots/getReviews';
const CREATE_IMAGE = 'spots/createImage';

const getCurrentSpot = (spot) => ({
    type: GET_CURRENT_SPOT,
    payload: spot,
});

const getAllSpots = (spots) => ({
    type: GET_SPOTS,
    payload: spots,
});

const createSpot = (spot) => ({
    type: CREATE_SPOT,
    payload: spot,
});

const createImage = (image) => ({
    type: CREATE_IMAGE,
    payload: image,
});

const getReviews = (reviews) => ({ 
    type: GET_REVIEWS,
    payload: reviews,
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


export const createSpotThunk = (
    country, address, city, state, lat, lng, description, name, price, previewImage
) => async dispatch => {
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify(
        
                country, address, city, state, lat, lng, description, name, price, previewImage
        )
    });
    const data = await res.json();
    dispatch(createSpot(data));
    return res
}

// export const createSpotImage = (spotId, url, preview) => async dispatch => {
//     const res = await csrfFetch(`/api/spot/${spotId}/images`, {
//         method: 'POST',
//         body: JSON.stringify(
//             {
//                 url, preview
//             }
//         )
//     });
//     const data = await res.json();
//     dispatch(createImage(data));
//     return res
// }

const initialState = { spots: [] }

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
        case CREATE_SPOT:
            return {
                ...newState,
                spots: [...state.spots, action.payload]
            }
        case CREATE_IMAGE:
            return {
                ...newState,
                image: action.payload
            }
        case GET_REVIEWS:
            return {
                ...newState,
                reviews: action.payload 
            }
        default: 
        return state;
    }
}

export default spotReducer
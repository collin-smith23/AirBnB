
const GET_CURRENT_SPOT = 'spots/getCurrentSpot';
const GET_SPOTS = 'spots/getAllSpots';
const ADD_SPOT = 'spots/create';
const GET_REVIEWS = 'spots/getReviews';
const ADD_IMAGE = 'spots/addImage';
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

const addImage = (image) => ({
    type: ADD_IMAGE,
    payload: image
})

const getReviews = (reviews) => ({ 
    type: GET_REVIEWS,
    payload: reviews,
})

const deleteSpot = (spot) => ({
    type: DELETE_SPOT,
    payload: spot,
})

export const getSpotsThunk = () => async (dispatch) => {
    const res = await fetch('/api/spots');

    if (res.ok) {
        const list = await res.json();
        dispatch(getAllSpots(list));
        return list;
    };
};

export const getReviewsThunk = (spotId) => async dispatch => {
    const res = await fetch(`/api/spots/${spotId}/reviews`);
    const data = await res.json();
    dispatch(getReviews(data));
    return data;
}

export const getCurrentSpotThunk = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}`);
    const data = await res.json();
    dispatch(getCurrentSpot(data));
    return data;
}


export const createSpot = (
    spot
) => async (dispatch) => {
    const {country, address, city, state, lat, lng, description, name, price, previewImage} = spot

    const res = await fetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify(
            {
                spot
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

        return (res)
    }
}

// export const createSpotImage = (spotId, url, preview) => async dispatch => {
//     const res = await fetch(`/api/spot/${spotId}/images`, {
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

const initialState = {  }

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
        case ADD_IMAGE:
            return {
                ...newState,
                image: action.payload
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
import { csrfFetch } from "./csrf";
const ADD_IMAGE = 'spots/addImage';

const addImage = (image) => ({
    type: ADD_IMAGE,
    payload: image
})

export const createSpotImage = (image, spotId) => async dispatch => {
    const {url, preview} = image
    const res = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        body: JSON.stringify(
            {
                url, preview
            }
        )
    });
    const data = await res.json();
    dispatch(addImage(data));
    return data
}

const initialState = {spotImages: []}

const imageReducer = (state = initialState, action) => {
    let newState = state;
    switch (action.type) {
        case ADD_IMAGE:
            const newImage = action.image
            return { ...newState, spotImages: [...newState.spotImages, newImage] }
        default:
            return newState
    }
}

export default imageReducer
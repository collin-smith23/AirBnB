import { csrfFetch } from '../../store/csrf';
import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as spotActions from '../../store/spots';
import * as imageAction from '../../store/images';
import './editSpot.css';

function EditSpot(){
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector((state) => state.session.user)
    const spots = useSelector((state) => state)
    console.log('this is spots', spots)

    // const [currentSpot, setCurrentSpot] = useState({});
    const {spotId} = useParams();


    
    

    
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    
    const [errors, setErrors] = useState([]);
    const currentSpot = useSelector((state) => state.spot.currentSpot)
    
    useEffect(() => {
        dispatch(spotActions.getCurrentSpotThunk(spotId))
            .catch(err => console.log(err));
    }, [dispatch, spotId])

    console.log('this is my current spot', currentSpot)
    
    useEffect(() => {
        if (currentSpot) {
            setCountry(currentSpot.country);
            setAddress(currentSpot?.address || '');
            setCity(currentSpot?.city || '');
            setState(currentSpot?.state || '');
            setLat(currentSpot?.lat || '');
            setLng(currentSpot?.lng || '');
            setDescription(currentSpot?.description || '');
            setName(currentSpot?.name || '');
            setPrice(currentSpot?.price || '');
        }
    }, [currentSpot])
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        let currErrs = []; 
        if(!country) currErrs.push("Country is required");
        if(!address) currErrs.push('Address is required');
        if(!state) currErrs.push('State is required');
        if(!city) currErrs.push('City is required');
        if(!state) currErrs.push('State is required');
        if(!lat) currErrs.push('Latitude is required');
        if(!lng) currErrs.push('Longitude is required');
        if(!description) currErrs.push('Description needs a minimum of 30 characters');
        if(!name) currErrs.push('Name is required');
        if (!price) currErrs.push('Price is required');

        const spot = { country, address, city, state, lat, lng, description, name, price}


            if(!currErrs.length){
        let updatedSpot = await dispatch(spotActions.updateSpot(spotId, spot))
        if(updatedSpot) return history.push(`${spotId}`);
        }
        setErrors(currErrs)
        console.log(errors);
    }

    return (
        <div className="create-spot-form-box">
                <h1 className='create-spot-title'>Update a Spot</h1>
            <form className='create-spot-form' onSubmit={handleSubmit}>
                {/* {errors.length > 0 && (
                    <ul className='error-text'>
                        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                    </ul>
                )} */}
                <h2 className='asking-for-new-spot'>Where's your place located?</h2>
                <p>Guests will only get your exact address once they booked a reservation</p>
                    <div className = 'address-input'>

                    <label>
                        Country
                        <input name='country' className='create-spot-input' placeholder='Country' value={country} onChange={(e) => setCountry(e.target.value)} />
                        {errors.includes('Country is required') && <div className='error-message'>Country is required</div>}
                    </label>
                    <label>
                        Street Address 
                        <input name='address' className='create-spot-input' placeholder='Address' value={address} onChange={(e) => setAddress(e.target.value)} />
                        {errors.includes('Address is required') && <div className='error-message'>Address is required</div>}
                    </label>
                    <label>
                        City
                        <input name='city' className='create-spot-input' placeholder='City' value={city} onChange={(e) => setCity(e.target.value)} />
                        {errors.includes('City is required') && <div className='error-message'>City is required</div>}
                    </label>
                    <label>
                        State
                        <input name='state' className='create-spot-input' placeholder='State' value={state} onChange={(e) => setState(e.target.value)} />
                        {errors.includes('State is required') && <div className='error-message'>State is required</div>}
                    </label>
                    <label>
                        Latitude
                        <input name='lat' className='create-spot-input' placeholder='Latitude' value={lat} onChange={(e) => setLat(e.target.value)} />
                        {errors.includes('Latitude is required') && <div className='error-message'>Latitude is required</div>}
                    </label>
                    <label>
                        Longitude
                        <input name='lng' className='create-spot-input' placeholder='Longitude' value={lng} onChange={(e) => setLng(e.target.value)} />
                        {errors.includes('Longitude is required') && <div className='error-message'>Longitude is required</div>}
                    </label>
                    </div>
                <h2 className='describe-your-place-h2'> Describe your place to guests</h2>
                <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                    <input name='description' className='new-spot-description' min={30} placeholder='Please write at least 30 characters' value={description} onChange={(e) => setDescription(e.target.value)} />
                    {errors.includes('Description needs a minimum of 30 characters') && <div className='error-message'>Description needs a minimum of 30 characters</div>}
                    <h3 className='name-your-spot'>Create a title for your spot</h3>
                <p>Catch guests' attention with a spot title that highlights what makes your place special</p>
                    <input name='name' className='create-spot-input' placeholder='Name of your spot' value={name} onChange={(e) => setName(e.target.value)}></input>
                    {errors.includes('Name is required') && <div className='error-message'>Name is required</div>}
                <h3 className='set-price-for-spot'>Set a base price for your spot</h3>
                <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                <label>
                    $
                    <input name='price' className='create-spot-input' placeholder='Price per night (USD)' value={price} onChange={(e) => setPrice(e.target.value)}></input>
                    {errors.includes('Price is required') && <div className='error-message'>Price is required</div>}
                </label>
                {/* optional image section not working yet */} 
                {/* {/* <h3 className='upload-photo-section'>Liven up your spot with photos</h3>
                <p>Submit a link to at least one photo to publish your spot.</p>
                    <input className='preview-image-input' type='text' placeholder='Preview Image Url' value={previewImage.url} onChange={(e) => handleImageInput(e.target.value, 0)}></input>
                    {errors.includes('Preview image is required') && <div className='error-message'>Preview Image is required</div>}
                    <input className='spot-image-input' type='text' placeholder='Image Url' value={imgOne.url} onChange={(e) => handleImageInput(e.target.value, 1)}></input>
                    {errors.includes('Image URL must end in .png, .jpg, or .jpeg') && <div className="error-message">Image URL must end in .png, .jpg, or .jpeg</div>}
                    <input className='spot-image-input' type='text' placeholder='Image Url' value={imgTwo.url} onChange={(e) => handleImageInput(e.target.value, 2)}></input>
                    <input className='spot-image-input' type='text' placeholder='Image Url' value={imgThree.url} onChange={(e) => handleImageInput(e.target.value, 3)}></input>
                    <input className='spot-image-input' type='text' placeholder='Image Url' value={imgFour.url} onChange={(e) => handleImageInput(e.target.value, 4)}></input> */}
                    <button className='submit-spot-btm' type='submit' onClick={handleSubmit}>Update Your Spot</button>

            </form>
        </div>
    )

}

export default EditSpot;
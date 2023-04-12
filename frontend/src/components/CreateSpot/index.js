import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom'
import * as spotActions from '../../store/spots';
import './createSpot.css';

function CreateSpot(){
    const dispatch = useDispatch();
    const history = useHistory();

    const sessionUser = useSelector((state) => state.session.user)
    
    const { spotId } = useParams();

    
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [previewImage, setpreviewImage] = useState('');
    const [preview, setPreview] = useState(false);

    const [errors, setErrors] = useState([]);


    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(spotActions.createSpotThunk({country, address, city, state, lat, lng, description, name, price, previewImage}))
        // dispatch(spotActions.createSpotImage({spotId, previewImage, preview}))
        .catch(async (res) => {
            const data = await res.json();
            console.log(data);
            if (data.errors) setErrors(data.errors);
        });
    }

    return (
        <div className="create-spot-form-box">
            <form className='create-spot-form' onSubmit={handleSubmit}>
                {errors.length > 0 && (
                    <ul className='error-text'>
                        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                    </ul>
                )}
                <h1 className='create-spot-title'>Create a new Spot</h1>
                <h3 className='asking-for-new-spot'>Where's your place located?</h3>
                <p>Guests will only get your exact address once they booked a reservation</p>
                    <div className = 'address-input'>
                    <label>
                        Country
                        <input type='text' className='create-spot-input' placeholder='Country' value={country} onChange={(e) => setCountry(e.target.value)} />
                    </label>
                    <label>
                        Street Address
                        <input className='create-spot-input' placeholder='Address' value={address} onChange={(e) => setAddress(e.target.value)} />
                    </label>
                    <label>
                        City
                        <input className='create-spot-input' placeholder='City' value={city} onChange={(e) => setCity(e.target.value)} />
                    </label>
                    <label>
                        State
                        <input className='create-spot-input' placeholder='State' value={state} onChange={(e) => setState(e.target.value)} />
                    </label>
                    <label>
                        Latitude
                        <input className='create-spot-input' placeholder='Latitude' value={lat} onChange={(e) => setLat(e.target.value)} />
                    </label>
                    <label>
                        Longitude
                        <input className='create-spot-input' placeholder='Longitude' value={lng} onChange={(e) => setLng(e.target.value)} />
                    </label>
                    </div>
                <h3 className='describe-your-place-h2'> Describe your place to guests</h3>
                <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                    <input className='new-spot-description' min={30} placeholder='Please write at least 30 characters' value={description} onChange={(e) => setDescription(e.target.value)} />
                <h3 className='name-your-spot'>Create a title for your spot</h3>
                <p>Catch guests' attention with a spot title that highlights what makes your place special</p>
                    <input className='-create-spot-input' placeholder='Name of your spot' value={name} onChange={(e) => setName(e.target.value)}></input>
                <h3 className='set-price-for-spot'>Set a base price for your spot</h3>
                <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <input className='-create-spot-input' placeholder='Price per night (USD)' value={price} onChange={(e) => setPrice(e.target.value)}></input>
                <h3 className='upload-photo-section'>Liven up your spot with photos</h3>
                <p>Submit a link to at least one photo to publish your spot.</p>
                    <input className='preview-image-input' type='text' placeholder='Preview Image Url' onChange={(e) => setpreviewImage(e.target.value) && setPreview(true)}></input>
                    <input className='spot-image-input' type='text' placeholder='Image Url' onChange={(e) => setpreviewImage(e.target.value)}></input>
                    <input className='spot-image-input' type='text' placeholder='Image Url' onChange={(e) => setpreviewImage(e.target.value)}></input>
                    <input className='spot-image-input' type='text' placeholder='Image Url' onChange={(e) => setpreviewImage(e.target.value)}></input>
                    <input className='spot-image-input' type='text' placeholder='Image Url' onChange={(e) => setpreviewImage(e.target.value)}></input>
                    <button className='submit-spot-btm' type='submit' onClick={handleSubmit}>Submit</button>

            </form>
        </div>
    )

}

export default CreateSpot;
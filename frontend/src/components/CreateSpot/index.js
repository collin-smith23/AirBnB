import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as spotActions from '../../store/spots';
import './createSpot.css';

function CreateSpot(){
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user)
    const spots = useSelector((state) => state.spots);
    
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [preview, setPreview] = useState(false);
    const [image, setImage] = useState('');
    const [spot, setSpot] = useState([]);

    const [errors, setErrors] = useState([]);

    const updateSpotImage = (value, preview) => {
        setSpot({ ...spot, image: value });
        setPreview(preview);
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        const spot = { country, address, city, state, lat, lng, description, name, price, Images: [{ url: previewImage }] };

        console.log('this is my spot', spot)

        // dispatch(spotActions.createSpotThunk({country, address, city, state, lat, lng, description, name, price})) && 
        // dispatch(spotActions.createSpotImage({url, preview}))
        // .then((newSpot) => {
        //     //clear form data
        //     setFormData({
        //         country: '',
        //         address: '',
        //         city: '',
        //         state: '',
        //         lat: '',
        //         lng: '',
        //         description: '',
        //         name: '',
        //         price: '',
        //         url: '',
        //         preview: false,
        //     })
        // })
        // .catch(async (res) => {
        //     const data = await res.json();
        //     if (data && data.errors) setErrors(data.errors);
        // });
    }

    return (
        <div className="create-spot-form-box">
            <form className='create-spot-form' onSubmit={handleSubmit}>
                {/* {errors.length > 0 && (
                    <ul className='error-text'>
                        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                    </ul>
                )} */}
                <h1 className='create-spot-title'>Create a new Spot</h1>
                <h2 className='asking-for-new-spot'>Where's your place located?</h2>
                <p>Guests will only get your exact address once they booked a reservation</p>
                    <div className = 'address-input'>
                    <label>
                        Country
                        <input name='country' className='create-spot-input' placeholder='Country' value={spot.country} onChange={(e) => setCountry(e.target.value)} />
                    </label>
                    <label>
                        Street Address
                        <input name='address' className='create-spot-input' placeholder='Address' value={spot.address} onChange={(e) => setAddress(e.target.value)} />
                    </label>
                    <label>
                        City
                        <input name='city' className='create-spot-input' placeholder='City' value={spot.city} onChange={(e) => setCity(e.target.value)} />
                    </label>
                    <label>
                        State
                        <input name='state' className='create-spot-input' placeholder='State' value={spot.state} onChange={(e) => setState(e.target.value)} />
                    </label>
                    <label>
                        Latitude
                        <input name='lat' className='create-spot-input' placeholder='Latitude' value={spot.lat} onChange={(e) => setLat(e.target.value)} />
                    </label>
                    <label>
                        Longitude
                        <input name='lng' className='create-spot-input' placeholder='Longitude' value={spot.lng} onChange={(e) => setLng(e.target.value)} />
                    </label>
                    </div>
                <h2 className='describe-your-place-h2'> Describe your place to guests</h2>
                <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                    <input name='description' className='new-spot-description' min={30} placeholder='Please write at least 30 characters' value={spot.description} onChange={(e) => setDescription(e.target.value)} />
                    <h3 className='name-your-spot'>Create a title for your spot</h3>
                <p>Catch guests' attention with a spot title that highlights what makes your place special</p>
                    <input name='name' className='create-spot-input' placeholder='Name of your spot' value={spot.name} onChange={(e) => setName(e.target.value)}></input>
                <h3 className='set-price-for-spot'>Set a base price for your spot</h3>
                <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <input name='price' className='create-spot-input' placeholder='Price per night (USD)' value={spot.price} onChange={(e) => setPrice(e.target.value)}></input>
                <h3 className='upload-photo-section'>Liven up your spot with photos</h3>
                <p>Submit a link to at least one photo to publish your spot.</p>
                    <input className='preview-image-input' type='text' placeholder='Preview Image Url' value={spot.previewImage} onChange={(e) => {setImage(e.target.value, spot?.Images?.length === 0 ? true : false)}}></input>
                    <input className='spot-image-input' type='text' placeholder='Image Url' onChange={(e) => setImage(e.target.files[0])}></input>
                    <input className='spot-image-input' type='text' placeholder='Image Url' onChange={(e) => setImage(e.target.files[0])}></input>
                    <input className='spot-image-input' type='text' placeholder='Image Url' onChange={(e) => setImage(e.target.files[0])}></input>
                    <input className='spot-image-input' type='text' placeholder='Image Url' onChange={(e) => setImage(e.target.files[0])}></input>
                    <button className='submit-spot-btm' type='submit' onClick={handleSubmit}>Submit</button>

            </form>
        </div>
    )

}

export default CreateSpot;
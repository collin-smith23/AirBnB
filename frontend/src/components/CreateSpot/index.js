import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as spotActions from '../../store/spots';
import './createSpot.css';

function CreateSpot(){
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user)

    const [formData, setFormData] = useState({
        country: '',
        address: '',
        city: '',
        state: '',
        lat: '',
        lng: '',
        description: '',
        name: '',
        price: '',
        url: '',
        preview: false,
    })

    const [errors, setErrors] = useState([]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        const { country, address, city, state, lat, lng, description, name, price, url, preview } = formData;

        dispatch(spotActions.createSpotThunk({country, address, city, state, lat, lng, description, name, price})) && 
        dispatch(spotActions.createSpotImage({url, preview}))
        .then((newSpot) => {
            //clear form data
            setFormData({
                country: '',
                address: '',
                city: '',
                state: '',
                lat: '',
                lng: '',
                description: '',
                name: '',
                price: '',
                url: '',
                preview: false,
            })
        })
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
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
                <h2 className='asking-for-new-spot'>Where's your place located?</h2>
                <p>Guests will only get your exact address once they booked a reservation</p>
                    <div className = 'address-input'>
                    <label>
                        Country
                        <input className='create-spot-input' placeholder='Country' value={formData.country} onChange={handleInputChange} />
                    </label>
                    <label>
                        Street Address
                        <input className='create-spot-input' placeholder='Address' value={formData.address} onChange={handleInputChange} />
                    </label>
                    <label>
                        City
                        <input className='create-spot-input' placeholder='City' value={formData.city} onChange={handleInputChange} />
                    </label>
                    <label>
                        State
                        <input className='create-spot-input' placeholder='State' value={formData.state} onChange={handleInputChange} />
                    </label>
                    <label>
                        Latitude
                        <input className='create-spot-input' placeholder='Latitude' value={formData.lat} onChange={handleInputChange} />
                    </label>
                    <label>
                        Longitude
                        <input className='create-spot-input' placeholder='Longitude' value={formData.lng} onChange={handleInputChange} />
                    </label>
                    </div>
                <h2 className='describe-your-place-h2'> Describe your place to guests</h2>
                <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                    <input className='new-spot-description' min={30} placeholder='Please write at least 30 characters' value={formData.description} onChange={handleInputChange} />


            </form>
        </div>
    )

}

export default CreateSpot;
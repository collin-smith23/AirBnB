import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as spotActions from '../../store/spots';
import * as imageAction from '../../store/images';
import './createSpot.css';

function CreateSpot(){
    const dispatch = useDispatch();
    const history = useHistory();
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
    
    const [errors, setErrors] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    // const [preview, setPreview] = useState(false);
    
    const [imgOne, setImgOne] = useState({});
    const [imgTwo, setImgTwo] = useState({});
    const [imgThree, setImgThree] = useState({});
    const [imgFour, setImgFour] = useState({});

    if(!sessionUser) return <Redirect to='/'/>


    const handleImageInput = (newUrl, idx) => {
        if (idx === 0){
            setPreviewImage({url:newUrl, preview: true})
        }
        if (idx === 1) {
            setImgOne({url:newUrl, preview:false});
        }
        if (idx === 2) {
            setImgTwo({url:newUrl, preview:false});
        }
        if (idx === 3) {
            setImgThree({url:newUrl, preview:false});
        }
        if (idx === 4) {
            setImgFour({url:newUrl, preview:false});
        }
    }

    const isValidImg = (img, currErrs) => {
        if (!img) return null;
        let validTypes = ['.png', '.jpg', 'jpeg']
        let type = img.slice(-4)
        if (!validTypes.includes(type)) {
            currErrs.push('Image URL must end in .png, .jpg, or .jpeg')
        }
        else return;
    }


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
        if(!previewImage) currErrs.push('Preview image is required');
        isValidImg(previewImage.url, currErrs);
        isValidImg(imgOne.url, currErrs);
        isValidImg(imgTwo.url, currErrs);
        isValidImg(imgThree.url, currErrs);
        isValidImg(imgFour.url, currErrs);


            if(!currErrs.length){
                const newSpot = await dispatch( spotActions.createSpot({ country, address, city, state, lat, lng, description, name, price}));
            const {id} = newSpot
            
            const image = await dispatch(imageAction.createSpotImage(previewImage, id));
            if (imgOne) await dispatch(imageAction.createSpotImage(imgOne, id));
            if (imgTwo) await dispatch(imageAction.createSpotImage(imgTwo, id));
            if (imgThree) await dispatch(imageAction.createSpotImage(imgThree, id));
            if (imgFour) await dispatch(imageAction.createSpotImage(imgFour, id));   
            return history.push(`${id}`);
        }
        setErrors(currErrs)
        console.log(errors);
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
                <h2 className='set-price-for-spot'>Set a base price for your spot</h2>
                <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                <label>
                    $
                    <input name='price' className='create-spot-input' placeholder='Price per night (USD)' value={price} onChange={(e) => setPrice(e.target.value)}></input>
                    {errors.includes('Price is required') && <div className='error-message'>Price is required</div>}
                </label>
                <h2 className='upload-photo-section'>Liven up your spot with photos</h2>
                <p>Submit a link to at least one photo to publish your spot.</p>
                    <input className='preview-image-input' type='text' placeholder='Preview Image Url' value={previewImage.url} onChange={(e) => handleImageInput(e.target.value, 0)}></input>
                    {errors.includes('Preview image is required') && <div className='error-message'>Preview Image is required</div>}
                    <input className='spot-image-input' type='text' placeholder='Image Url' value={imgOne.url} onChange={(e) => handleImageInput(e.target.value, 1)}></input>
                    {errors.includes('Image URL must end in .png, .jpg, or .jpeg') && <div className="error-message">Image URL must end in .png, .jpg, or .jpeg</div>}
                    <input className='spot-image-input' type='text' placeholder='Image Url' value={imgTwo.url} onChange={(e) => handleImageInput(e.target.value, 2)}></input>
                    <input className='spot-image-input' type='text' placeholder='Image Url' value={imgThree.url} onChange={(e) => handleImageInput(e.target.value, 3)}></input>
                    <input className='spot-image-input' type='text' placeholder='Image Url' value={imgFour.url} onChange={(e) => handleImageInput(e.target.value, 4)}></input>
                    <button className='submit-spot-btm' type='submit' onClick={handleSubmit}>Create Spot</button>

            </form>
        </div>
    )

}

export default CreateSpot;
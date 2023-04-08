import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector} from 'react-redux'
import * as spotActions from '../../store/spots'
import './SpotDetail.css'


function SpotDetails() {
    const {spotId} = useParams()
    const dispatch = useDispatch();
    const [currSpot, setcurrSpot] = useState('');
    // const [reviews, setreviews] = useState('')

    const user = useSelector(state => state.session.user);
    const spot = currSpot;
    console.log(currSpot)


    useEffect(() => {
        dispatch(spotActions.getCurrentSpotThunk(spotId))
            .then(currSpot => setcurrSpot(currSpot))
            .catch(err => console.log(err));
    }, [spotId]);

    // useEffect(() => {
    //     dispatch(spotActions.getReviewsThunk(spotId))
    //         .then(reviews => setreviews(reviews))
    //         .catch(err => console.log(err));
    // }, [spotId]);

    return (
        <div>
            {currSpot ? (
                <div>
                    <h1 className="title-of-spot">{currSpot.name}</h1>
                    <h3 className="location-info-h3">{currSpot.city},{currSpot.state},{currSpot.country}</h3>
                    <div className='spot-image-container'>
                    {currSpot.SpotImages.map(img => (
                        <img className="spot-image-img" src={img.url}/>
                    ))
                    }
                    </div>
                    <h2>Hosted by {currSpot.Owner.firstName}, {currSpot.Owner.lastName}</h2>
                    <p className="spot-description"> {currSpot.description} </p>
                    <span className="reserve-button-container">
                        <div className="price-div">{`$${currSpot.price} night`}</div> 
                        <div className="reviews-preview-div">★ need to add reviews</div> 
                        <button className="reserve-button"
                            onClick={() => window.alert("Feature Coming Soon...")}
                        >Reserve</button>
                            </span>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default SpotDetails

import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector} from 'react-redux'
import * as spotActions from '../../store/spots'
import CreateReviewModal from '../CreatReviewModal'
import './SpotDetail.css'


function SpotDetails() {
    const {spotId} = useParams()
    const dispatch = useDispatch();
    const [currSpot, setcurrSpot] = useState('');
    const [reviews, setreviews] = useState([])
    const [showReviewForm, setShowReviewForm] = useState(false)
    const sessionUser = useSelector((state) => state.session.user)

    console.log('this is the reviews', reviews)

    
    useEffect(() => {
        dispatch(spotActions.getCurrentSpotThunk(spotId))
            .then(currSpot => setcurrSpot(currSpot))
            .catch(err => console.log(err));
    }, [spotId]);

    useEffect(() => {
        dispatch(spotActions.getReviewsThunk(spotId))
        .then(reviews => setreviews(reviews))
            .catch(err => console.log(err));
        }, [spotId]);

        // console.log(reviews[0])
        
        // useEffect(() => {
            //     if (!showReviewForm) return;
            
            //     const 
            // })
    const isUsersReview = (review, userId) => {
        console.log('this is my functions review', review);
        if(review.User.id === userId){
            return true;
            } else return false;
            }

    const userHasReviewed = (reviews, userId) => {
        let hasReviewed = false;
        reviews.forEach(review => {
            if(review.userId === userId) {
                hasReviewed = true;
            }
        })
        if(hasReviewed) return true;
        return false;
    }

    const avgRating = (reviews) => {
        let sum = 0;
        if (reviews.length < 1) return 'New'
        reviews.forEach(review => {
            sum += review.stars
        })
        return sum / reviews.length
    };

    const numberReviews = (reviews) => {
        if (reviews.length > 1) {
            return `${reviews.length} reviews`
        } if (reviews.length === 1) { 
            return `${reviews.length} review`
        } else return 'No Reviews Yet'
    }

    const dateFormat = (dateString) => {
        const date = new Date(dateString);
        const month = date.toLocaleDateString('default', { month: 'short' });
        const day = date.getDate();
        const year = date.getFullYear();

        const formattedDate = `${month}, ${day}`
        return formattedDate
    }
    const ownerId = currSpot.ownerId;
    const userId = sessionUser.id;
    console.log('this is ownerId', ownerId)
    console.log('this is sessionUserId', userId)



    return (
        <div>
            {showReviewForm && (
                <div className='create-review-form-box' >
                    <div className="create-form-modal">
                <CreateReviewModal />
                    </div>
                </div>
            ) }
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
                        <div className="reviews-preview-div">
                                <div className="avg-stars-div"> 
                             {`★${avgRating(reviews)}`}
                                </div>
                            {reviews.length > 0 && (
                                <>
                            <div className="review-star-average-dot">
                            ·
                            </div>
                            <div className="num-reviews-div">
                              {`${numberReviews(reviews)}`}
                            </div>
                                </>
                                )
                            }
                        </div> 
                            {!userHasReviewed(reviews, userId) && userId !== ownerId && (
                                <>
                                <button className="show-review-button" onClick={(e) => setShowReviewForm(true)}>Post Your Review</button>
                                </>
                            )
                        }
                        {!reviews.length && userId !== ownerId && (
                            <>
                            <div>Be the first to leave a review</div>
                            </>
                        )}
                        <button className="reserve-button"
                            onClick={() => window.alert("Feature Coming Soon...")}
                            >Reserve</button>
                            </span>
                    <span className="reviews-span">
                            <ul className="review-details-container">
                                {reviews.map(review => (
                                    <li className="review-details-li" key={review.id}>
                                        <h4 className="name-of-reviewer">{review.User.firstName}</h4>
                                        <div className="date-of-review">{dateFormat(review.createdAt)}</div>
                                        <p className="description">
                                        {review.review}
                                        </p>
                                        {isUsersReview(review, userId) && (
                                            <button>delete review</button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                    </span>

                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default SpotDetails
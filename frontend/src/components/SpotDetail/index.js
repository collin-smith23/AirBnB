import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector} from 'react-redux'
import * as spotActions from '../../store/spots'
import * as reviewActions from '../../store/reviews'
import CreateReviewModal from '../CreatReviewModal'
import DeleteReviewModal from '../DeleteReviewModal'
import './SpotDetail.css'


function SpotDetails() {
    const {spotId} = useParams()
    const dispatch = useDispatch();
    const [currSpot, setcurrSpot] = useState('');
    const [reviews, setreviews] = useState([]);
    const [reviewId, setReviewId] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [showReviewDelete, setShowReviewDelete] = useState(false)
    const sessionUser = useSelector((state) => state.session.user)

    // console.log('this is the reviews', reviews)
    // console.log('this is sessionUser', sessionUser)

    
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

    const isUsersReview = (review, sessionUser) => {
        if(!sessionUser) return false;
        let userId = sessionUser.id;
        // console.log('this is my functions review', review);
        if(review.User.id === userId){
            return true;
            } else return false;
            }

    const userHasReviewed = (reviews, sessionUser) => {
        if(!sessionUser) return false;
        let userId = sessionUser.id;
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
        const average = sum / reviews.length
        if (average === parseFloat(average)) return average.toFixed(1)
        return average.toFixed(2)
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
    
    let userId;
    if(sessionUser) userId = sessionUser.id
    // console.log('this is ownerId', ownerId)
    // console.log('this is sessionUserId', userId)

    const handleDeleteClick = (reviewId) => {
        setReviewId(reviewId);
        setShowReviewDelete(true);
    }

    const handleDeleteConfirm = () => {
        dispatch(reviewActions.removeReview(reviewId));
        setShowReviewDelete(false);
        window.location.reload();
    }

    const handleDeleteCancel = () => {
        setShowReviewDelete(false);
    }

    console.log(currSpot)

    return (
        <div>
            {showReviewForm && (
                <div className='create-review-form-box' >
                    <div className="create-form-modal">
                <CreateReviewModal />
                    </div>
                </div>
            ) }
            {showReviewDelete && (
                <div className="delete-review-box">
                    <div className="delete-review-modal">
                        <DeleteReviewModal onCancel={handleDeleteCancel} onDelete={handleDeleteConfirm}/>
                        </div>
                </div>
            )}
            {currSpot ? (
                <div>
                    <h1 className="title-of-spot">{currSpot.name}</h1>
                    <h3 className="location-info-h3">{currSpot.city},{currSpot.state},{currSpot.country}</h3>
                    <div className='spot-image-container'>
                        <div className='main-spot-image-container'>
                        {currSpot.SpotImages.filter(img => img.preview).map(img => (
                            <img className="spot-image-main" src={img.url} alt="Main Image"/>
                            ))}
                            </div>

                    <div className="spot-image-grid">
                        {currSpot.SpotImages.filter(img => !img.preview).map(img => (
                        <img className="spot-image-small" src={img.url}/>
                            ))}
                    </div>
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
                        <div className="reviews-bigger-div">
                                <h2 className="avg-stars-h2"> 
                             {`★${avgRating(reviews)}`}
                                </h2>
                            {reviews.length > 0 && (
                                <>
                            <h2 className="review-star-average-dot-h2">
                            ·
                            </h2>
                            <h2 className="num-reviews-h2">
                              {`${numberReviews(reviews)}`}
                            </h2>
                                </>
                                )
                            }
                        </div> 
                        {(sessionUser !== undefined) && (
                            <>
                            <div className="show-review-button-box">
                            {!userHasReviewed(reviews, sessionUser) && userId !== ownerId && (
                                <>
                                <button className="show-review-button" onClick={(e) => setShowReviewForm(true)}>Post Your Review</button>
                                </>
                                )
                            }
                            </div>
                            <div className="be-first-text">
                            {!reviews.length && userId !== ownerId && (
                                <>
                            <div>Be the first to leave a review</div>
                            </>
                            )}
                            </div>
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
                                        {(sessionUser !== undefined) && (
                                            <div className="delete-button-box">
                                        {isUsersReview(review, sessionUser) && (
                                            <button onClick={(e) => {
                                                handleDeleteClick(review.id)
                                            }}>Delete review</button>
                                            )}
                                            </div>
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

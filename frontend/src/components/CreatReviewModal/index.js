import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import * as reviewActions from '../../store/reviews'
import './createReview.css';

function StarRating({stars, setStars, setHoveredStar}) {

    const handleStarClick = (star) => {
        setStars(star);
    }

    return (
        <div className="star-rating">
            {[5,4,3,2,1].map((star) => (
                <span
                    key={star}
                    data-star={star}
                    className={star <= (stars || setHoveredStar) ? 'filled' : ''}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={(e) => setHoveredStar(setHoveredStar(star))}
                    onMouseLeave={() => setHoveredStar(0)}
                >
                    ✩
                </span>
            ))}
        </div>
    );
}


function PostReviewFormModal() {
    const dispatch = useDispatch();
    const history = useHistory();
    const {spotId} = useParams();
    
    const sessionUser = useSelector((state) => state.session.user);
    
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [errors, setErrors] = useState([]);
    
    const { closeModal } = useModal();

    const validReview = review.length > 10;
    const validStars = stars > 0;
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const res = await dispatch(reviewActions.postReview(spotId, review, stars))
                if(res) {
                    onclose();
                    window.location.reload();
                }
    }
    console.log(stars)

    return (
        <div className='review-form-box'>
            <form onSubmit={handleSubmit}>
        <h2>How was your stay?</h2>
        {errors.length > 0 && (
            <ul>
            {errors.map((error, idx) => <li key={idx}>{error}</li>)}
          </ul>
        )}
        <div className='review-text-container'>
            <input placeholder='Leave your review here...' value={review} onChange={(e) => {setReview(e.target.value)}}></input>
        </div>
        <div className='stars-container'>
            <label>
            <StarRating stars={stars} setStars={setStars} setHoveredStar={setHoveredStar} /> stars
            </label>
        </div>
        <button disabled={!validReview || !validStars}>Submit Your Review</button>
        </form>
        </div>
    )
}

export default PostReviewFormModal
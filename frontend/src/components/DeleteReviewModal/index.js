import React, {useState} from 'react'

import './deleteReview.css'

function DeleteReviewModal(props) {
    return (
        <div className='delete-review-item-box'>
        <h1>Confirm Delete</h1>
        <h3>Are you sure you want to delete this review?</h3>
        <span >
            <button className="yes-delete-btn" onClick={props.onDelete}>Yes (Delete Review)</button>
        </span>
        <span >
            <button className="no-keep-btn" onClick={props.onCancel}>No (Keep Review)</button>
        </span>
        </div>
    )
}

export default DeleteReviewModal
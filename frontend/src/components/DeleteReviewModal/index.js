import React, {useState} from 'react'

import './deleteReview.css'

function DeleteReviewModal(props) {
    return (
        <div>
        <h1>Confirm Delete</h1>
        <h3>Are you sure you want to delete this review?</h3>
        <span className="yes-delete-button">
            <button onClick={props.onDelete}>Yes (Delete Review)</button>
        </span>
        <span className="no-keep-button">
            <button onClick={props.onCancel}>No (Keep Review)</button>
        </span>
        </div>
    )
}

export default DeleteReviewModal
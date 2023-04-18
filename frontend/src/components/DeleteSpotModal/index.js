import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import * as spotActions from '../../store/spots'
import { useDispatch, useSelector } from 'react-redux';
import './deleteModal.css';




function DeleteSpotModal(props) {

  return (
    <div className="modal">
      <div className="modal-content">
        <h1>Confirm Delete</h1>
        <h2>Are you sure you want to remove this spot from the listings?</h2>
          <div className='yes-no-delete-buttons-box'>
          <button className='yes-delete-btn' onClick={props.onDelete}>Yes (Delete Spot)</button>
          <button className='no-keep-btn' onClick={props.onCancel}>No (Keep Spot)</button>
          </div>
      </div>
    </div>
  );
}

export default DeleteSpotModal;


import React, { useEffect, useState} from 'react';
import { NavLink } from 'react-router-dom';
import { csrfFetch } from '../../store/csrf';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector} from 'react-redux'
import * as spotActions from '../../store/spots'
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteSpotModal from '../DeleteSpotModal';
import './manageSpots.css'

function ManageSpots(){
    const sessionUser = useSelector((state) => state.session.user)
    const dispatch = useDispatch();
    const history = useHistory();
    console.log('this is my user',sessionUser)

    const [spots, setSpots] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [spotId, setSpotId] = useState('')
    const [editClicked, setEditClicked] = useState(false)

    const handleDeleteClick = (spotId) => {
        setSpotId(spotId)
        console.log(spotId)
        setShowDeleteModal(true);
      };
    
      const handleDeleteCancel = () => {
        setShowDeleteModal(false);
      };
    
      const handleDeleteConfirm = async () => {
        dispatch(spotActions.removeSpot(spotId));
        dispatch(spotActions.getUserSpots());
               setShowDeleteModal(false)
           window.location.reload();
      };

      const handleEditClick = () => {
        editClicked = true;
       };


    const averageRating = (spot) => {
        if (spot.avgRating === null) spot.avgRating = 'New'
        if (spot.avgRating !== 'New'){
            if (spot.avgRating === parseFloat(spot.avgRating)) return spot.avgRating.toFixed(1)
        return spot.avgRating.toFixed(2)
        }
        return spot.avgRating
        
    }

    useEffect(() => {
     fetch('/api/spots/current')
        .then(res => res.json())
        .then(data => {
            // console.log('---this is data', data)
            const spotsArray = data
            setSpots(spotsArray)
        })  
    }, [])

    console.log('this is spots', spots)

    return (
        <>
            {showDeleteModal && (
                <div className='confirm-delete-box'>
                    <div className = 'delete-spot-modal'>
                <DeleteSpotModal onCancel={handleDeleteCancel} onDelete={handleDeleteConfirm} />
                    </div>
                </div>
                )}
            <h2 className='manage-spot-title'>Manage Spots</h2>

            <button className='create-new-spot-btn-box'>
            <NavLink to='/spots/new' className='create-new-spot-btn'>Create New Spot</NavLink>
            </button>
        <div className='spots-slot'>
            {spots.map(spot=> (
                <div className='spot-slot' title={spot.name} >
                    <div className='spot-select' title={spot.name}  onClick={() => window.location.href = `${spot.id}`}>
                <img className='spot-image' src={spot.previewImage} alt={spot.name} />
                <span className='city-state-review-span'>
                <div>{spot.city}, {spot.state} </div>
                    <div className='avg-rating-div'>{`⭐ ${averageRating(spot)}`}</div>
                </span>
                    <div className='spot-price-div'>{`$${spot.price} night`}</div>
                    </div>
                <div className='delete-update-buttons'>
                    <button className='update-button'>
                        <NavLink to={`/spots/${spot.id}/edit`}>Update</NavLink>
                    </button>

                    <button className='delete-button' onClick={() => handleDeleteClick(spot.id)}>Delete</button>
                </div>
                </div>
            ))}
        </div>
            </>
    )

}

export default ManageSpots
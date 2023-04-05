import React, { useEffect, useState } from "react";
import './Spots.css'

function Spots() {
    const [spots, setSpots] = useState([]);

    useEffect(() => {
        fetch('/api/spots')
            .then(res => res.json())
            .then(data => {
                const spotsArray = data.Spots
                setSpots(spotsArray)
            })
    }, [])
    
    return (
        <div className="spots-slot">
    {spots.map(spot => (
        <div className="spot-slot">
            <img className='spot-image' src={spot.imageUrl} alt={spot.name}/>
            <div>{spot.city}, {spot.state}
                <div title={spot.name}>
                    {spot.reviews}
                </div>
            </div>
        </div>
    ))}
    </div>
)
}

export default Spots
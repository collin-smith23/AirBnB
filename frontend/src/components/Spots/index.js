import React, { useEffect, useState } from "react";
import './Spots.css'

function Spots() {
    const [spots, setSpots] = useState([]);

    const imgSource = (spot) => {
        if (spot.previewImage === null){
            spot.previewImage = 'https://imgs.search.brave.com/DBfFhJz7r65R_iKRH2jQE6oaZZo2qQYSCHJLvyiMjv0/rs:fit:474:296:1/g:ce/aHR0cDovL3d3dy5m/c3hhZGRvbnMuY29t/L3N0YXRpYy9pbWcv/bm8tcHJldmlldy5q/cGc'
        }
        return spot.previewImage
    }


    useEffect(() => {
        fetch('/api/spots')
            .then(res => res.json())
            .then(data => {
                const spotsArray = data.Spots
                setSpots(spotsArray)
            })
    }, [])
    // console.log(spots)
    return (
        <div className="spots-slot">
    {spots.map(spot => (
        <div className="spot-slot">
            <img className='spot-image' src={imgSource(spot)}/>
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
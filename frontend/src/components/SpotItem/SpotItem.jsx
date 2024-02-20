import './SpotItem.css';
import { FaStar } from "react-icons/fa";

function SpotItem({ spot }) {

  return (
    <div className='spot-card-container'>
      <span className="tooltiptext">{spot.name}</span>
      <img src={spot.previewImage} alt={spot.name} />
      <div className='spot-card-address-review'>
        <span>{spot.city}, {spot.state}</span>
        <span><FaStar /> {spot.avgRating === "None" ? "New" :
        (Number.isInteger(spot.avgRating) ? spot.avgRating + ".0" : spot.avgRating)}</span>
      </div>
      <span>${spot.price} night</span>
    </div>
  )
}

export default SpotItem;

import './SpotItem.css';
import { FaStar } from "react-icons/fa";

function SpotItem({spot}) {

  return (
    <div className='spot-card-container'>
      <img src={spot.previewImage} alt={spot.name} />
      <div><span>{spot.city}, {spot.state}, {spot.country}</span> <span><FaStar /> {spot.avgRating}</span></div>
      <span>${spot.price} night</span>
    </div>
  )
}

export default SpotItem;

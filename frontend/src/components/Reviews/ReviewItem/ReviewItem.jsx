import { FaUserCircle } from 'react-icons/fa';
import ReviewStars from '../ReviewStars';
import './ReviewItem.css'


function ReviewItem({review}) {
  console.log("review inside reviewitem======>", review);
  return (
    <div className='review-container'>
      <h3><FaUserCircle size={30} color="grey" /> {review.User.firstName}</h3>
      <p className='star-date'><ReviewStars num={review.stars} /> {review.createdAt}</p>
      <p>{review.review}</p>
    </div>
  )
}

export default ReviewItem;

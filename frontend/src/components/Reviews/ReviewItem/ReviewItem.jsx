import { FaUserCircle } from 'react-icons/fa';
import ReviewStars from '../ReviewStars';
import './ReviewItem.css'


function ReviewItem({review}) {
  // console.log("review inside reviewitem======>", review);
  const month = ["January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"];
  const date =  new Date(review.createdAt);
  console.log("review.createdAt ======> ", review.createdAt, date);
  const convertedDate = month[date.getMonth()] + " " + (date.getYear() + 1900);
  console.log("review.convertedDate ======> ", convertedDate);

  return (
    <div className='review-container'>
      <h3><FaUserCircle size={30} color="grey" /> {review.User.firstName}</h3>
      <p className='star-date'><ReviewStars num={review.stars} /> {convertedDate}</p>
      <p>{review.review}</p>
    </div>
  )
}

export default ReviewItem;

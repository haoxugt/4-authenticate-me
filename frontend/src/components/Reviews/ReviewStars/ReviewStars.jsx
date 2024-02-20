import { FaStar } from "react-icons/fa"
import './ReviewStars.css'

function ReviewStars({num}) {
  return (
    <span className="rating-star">
      <span className={num < 1 ? "empty" : "filled"} id='FaStar1' >
        <FaStar />
      </span>
      <span className={num < 2 ? "empty" : "filled"} id='FaStar2' >
        <FaStar />
      </span>
      <span className={num < 3 ? "empty" : "filled"} id='FaStar3' >
        <FaStar />
      </span>
      <span className={num < 4 ? "empty" : "filled"} id='FaStar4' >
        <FaStar />
      </span>
      <span className={num < 5 ? "empty" : "filled"} id='FaStar5' >
        <FaStar />
      </span>
    </span>
  )
}

export default ReviewStars;

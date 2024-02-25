import { FaStar } from "react-icons/fa";
import { useState } from "react";
import './ReviewStarsInput.css'

function ReviewStarsInput({ stars, disabled, onChange }) {
  const [activeRating, setActiveRating] = useState(stars);

  const ratingUpdate = (e) => {
    if (!disabled) {
      switch (e.currentTarget.id) {
        case 'FaStar1':
          setActiveRating(1);
          return;
        case 'FaStar2':
          setActiveRating(2);
          return;
        case 'FaStar3':
          setActiveRating(3);
          return;
        case 'FaStar4':
          setActiveRating(4);
          return;
        case 'FaStar5':
          setActiveRating(5);
          return;
        default:
          setActiveRating(stars)
          return;
      }
    }
  }

  const onClickHandler = (e) => {
    if (!disabled) {
      onChange(Number(e.currentTarget.id[e.currentTarget.id.length - 1]))
    }
  }

  return (
    <span className="rating-star-input">
      <span className={activeRating < 1 ? "empty" : "filled"}
        id='FaStar1'
        onMouseEnter={ratingUpdate}
        onMouseLeave={() => setActiveRating(stars)}
        onClick={onClickHandler}
      >
        <FaStar />
      </span>
      <span className={activeRating < 2 ? "empty" : "filled"}
        id='FaStar2'
        onMouseEnter={ratingUpdate}
        onMouseLeave={() => setActiveRating(stars)}
        onClick={onClickHandler}>
        <FaStar />
      </span>
      <span className={activeRating < 3 ? "empty" : "filled"}
        id='FaStar3'
        onMouseEnter={ratingUpdate}
        onMouseLeave={() => setActiveRating(stars)}
        onClick={onClickHandler}>
        <FaStar />
      </span>
      <span className={activeRating < 4 ? "empty" : "filled"}
        id='FaStar4'
        onMouseEnter={ratingUpdate}
        onMouseLeave={() => setActiveRating(stars)}
        onClick={onClickHandler}>
        <FaStar />
      </span>
      <span className={activeRating < 5 ? "empty" : "filled"}
        id='FaStar5'
        onMouseEnter={ratingUpdate}
        onMouseLeave={() => setActiveRating(stars)}
        onClick={onClickHandler}>
        <FaStar />
      </span>
    </span>
  )
}

export default ReviewStarsInput;

import { useEffect, useState } from "react";
import { useModal } from "../../../context/Modal";
import { useDispatch } from "react-redux";
// import ReviewStars from "../ReviewStars";
import ReviewStarsInput from "../ReviewStarsInput";
import { createReviewThunk } from "../../../store/review";
import { getSpotById } from "../../../store/spot";
// import { useParams } from "react-router-dom";

import './ReviewForm.css'


function ReviewFormModal({ spotId }) {
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState({});
  const [disabledPostButton, setDisabledPostButton] = useState(true);
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(createReviewThunk(spotId, { review, stars }))
      .then(closeModal)
      .then(() => dispatch(getSpotById(spotId)))
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
    // return (<Navigate to='/' />);
  };

  const onChange = (number) => {
    setStars(parseInt(number));
  }

  useEffect(() => {
    if (review.length >= 10 && stars >= 1) {
      setDisabledPostButton(false);
    } else {
      setDisabledPostButton(true);
    }
  }, [review, stars])

  return (
    <div className="review-form-container">
      <h3>How was your stay?</h3>
      <form onSubmit={handleSubmit}>
        {errors.credential && <p className='errors'>{errors.credential}</p>}
        <div className='review-container'>
          <label>
            <textarea
              // id="login-credential-input"
              className="review-context"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder='Leave your review here...'
            >
            </textarea>
          </label>

          <label className="review-star-container">
            <ReviewStarsInput stars={stars} disabled={false} onChange={onChange} /> Stars
          </label>
        </div>
        {/* <label>this spot is No. {spotId}</label> */}
        <button type="submit"
          className="startButton"
          disabled={disabledPostButton}>
          Submit Your Review
        </button>

      </form>
    </div>
  )

}

export default ReviewFormModal;

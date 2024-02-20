import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteReviewThunk } from "../../../store/review";
import { getSpotById } from "../../../store/spot";
import './DeleteReviewModal.css'

function DeleteReviewModal({ review }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(deleteReviewThunk(review));
    await dispatch(getSpotById(review.spotId))
    closeModal();
  }

  return (
    <div className='delete-review-container'>
      <h3>Confirm Delete</h3>
      <span>Are you sure you want to delete this review?</span>
      <form onSubmit={handleSubmit}>
        <button type="submit" className="delete-button yes-button" >Yes (Delete Review)</button>
        <button type="submit" className="delete-button no-button" onClick={closeModal}>No (Keep Review)</button>
      </form>
    </div>
  )
}

export default DeleteReviewModal;

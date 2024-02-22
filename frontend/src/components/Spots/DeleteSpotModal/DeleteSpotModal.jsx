import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteSpot } from "../../../store/spot";
// import { getSpotById } from "../../../store/spot";
// import './DeleteSpotModal.css'

function DeleteSpotModal({ spot }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(deleteSpot(spot.id));
    closeModal();
  }

  return (
    <div className='delete-review-container'>
      <h3>Confirm Delete</h3>
      <span>Are you sure you want to delete this spot?</span>
      <form onSubmit={handleSubmit}>
        <button type="submit" className="delete-button yes-button" >Yes (Delete Spot)</button>
        <button type="submit" className="delete-button no-button" onClick={closeModal}>No (Keep Spot)</button>
      </form>
    </div>
  )
}

export default DeleteSpotModal;

// import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import OpenModalButton from "../../Modals/OpenModalButton/OpenModalButton";
import ReviewFormModal from '../ReviewFormModal';


function PostReviewButton({ id }) {
  return (
    // <button name={id}>Delete</button>
    <OpenModalButton
      itemText="Post Your Review"
      // onItemClick={closeMenu}
      modalComponent={<ReviewFormModal id={id}/>}
    />
  )
}

export default PostReviewButton;

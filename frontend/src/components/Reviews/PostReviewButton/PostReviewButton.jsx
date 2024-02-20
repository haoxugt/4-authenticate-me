import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import ReviewFormModal from '../ReviewFormModal';

function PostReviewButton({ id }) {
  return (
    // <button name={id}>Delete</button>
    <OpenModalMenuItem
      itemText="Post Your Review"
      // onItemClick={closeMenu}
      modalComponent={<ReviewFormModal id={id}/>}
    />
  )
}

export default PostReviewButton;

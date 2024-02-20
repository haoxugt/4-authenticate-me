import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllSpots, getSpotById } from "../../../store/spot";
import { getReviewsBySpotIdThunk, createReviewThunk } from "../../../store/review";
import { FaStar } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import ReviewItem from "../../Reviews/ReviewItem";
import PostReviewButton from "../../Reviews/PostReviewButton/PostReviewButton";

import './SpotShowPage.css'

function SpotShowPage() {
  const { spotId } = useParams();
  const spot = useSelector(state => state.spot.Spots[spotId]);
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const spotShow = useSelector(state => state.spot.spotShow);
  const reviewsObj = useSelector(state => state.review);
  let reviews = Object.values(reviewsObj);
  reviews.sort((a, b) => {
    return (new Date(b.createdAt)) - (new Date(a.createdAt));
  })
  // const

  useEffect(() => {
    async function getSpotByIdRun() {

      if (!spot) await dispatch(getAllSpots());
      await dispatch(getSpotById(spotId));
      await dispatch(getReviewsBySpotIdThunk(spotId))
    }
    getSpotByIdRun();
  }, [dispatch, spot, spotId]);

  const reserveBooking = (e) => {
    e.preventDefault();
    alert("Feature Coming Soon");
  }

  // const postReview = async (e) => {
  //   e.preventDefault();
  //   console.log("post a review");
  //   await dispatch(createReviewThunk(spotId))
  // }

  if (!spot) return <h2>Spot can not be found</h2>;
  // if (!spot) return null;
  if (!Object.values(spotShow).length) {
    return <h2>Page loading</h2>;
  }
  // if(!reviews.length) return null;
  // console.log(" reviews =======> " , reviews)

  return (
    <div className="spotshow-page-container">
      <h2>{spotShow?.name}</h2>
      <div><span>{spotShow?.city}</span>{", "}
        <span>{spotShow?.state}</span>{", "}
        <span>{spotShow?.country}</span>
      </div>
      <div className="spotshow-img-container">
        <img src={spotShow.SpotImages && spotShow.SpotImages[0].url}
          alt={spotShow.SpotImages && `${spotShow?.name}-spotImage-${spotShow.SpotImages[0].id}`} />
        <div className="spotshow-imgs-right">
          {spotShow.SpotImages && spotShow.SpotImages.slice(1, 5).map((el) => {
            return (
              <img src={el.url} key={el.id}
                alt={`${spotShow?.name}-spotImage-${el.id}`} />
            )
          })}
        </div>
      </div>
      <div className="details-info-container">
        <div>
          <h2>Hosted by {spotShow?.Owner.firstName} {spotShow?.Owner.lastName}</h2>
          <p>{spotShow?.description}</p>
        </div>
        <div className="price-review-box">
          <p>
            <span>${spotShow?.price} night</span>
            <span><FaStar />
              {spot.avgRating === "None" ? "New" :
                (Number.isInteger(spot.avgRating) ? spot.avgRating + ".0" : spot.avgRating)}
              {spotShow.numReviews === 0 ? null : (<><LuDot />
                {spotShow.numReviews === 1 ? (<>{spotShow.numReviews} Review</>) : (<>{spotShow.numReviews} Reviews</>)} </>)} </span>
          </p>
          <button type="submit" className="reserve-button" onClick={reserveBooking}>Reserve</button>
        </div>
      </div>
      {/* review parts */}
      <div className="review-list-container">
        <h2><FaStar />
          {spot.avgRating === "None" ? "New" :
            (Number.isInteger(spot.avgRating) ? spot.avgRating + ".0" : spot.avgRating)}
          {spotShow.numReviews === 0 ? null : (<><LuDot />
            {spotShow.numReviews === 1 ? (<>{spotShow.numReviews} Review</>) : (<>{spotShow.numReviews} Reviews</>)} </>)}
        </h2>
        {/* post review button */}
        {sessionUser && sessionUser.id !== spot.ownerId && !reviews.filter(el => el.userId === sessionUser.id).length && (<PostReviewButton id={spot.id} />)}
        {reviews.length ?
          reviews.map(el => {
            return (
              <div key={el.id}>
                <ReviewItem review={el} />
                {sessionUser && el.userId === sessionUser.id && <button name={el.id}>Delete</button>}
              </div>
            )
          }) :
          (<>{sessionUser && sessionUser.id !== spot.ownerId ? <p>Be the first to post a review!</p> : null}</>)

        }
      </div>

    </div >
  )
}

export default SpotShowPage;

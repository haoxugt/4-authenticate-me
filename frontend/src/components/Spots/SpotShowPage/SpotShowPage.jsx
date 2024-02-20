import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllSpots, getSpotById } from "../../../store/spot";
import { getReviewsBySpotIdThunk } from "../../../store/review";
import { FaStar } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import ReviewItem from "../../Reviews/ReviewItem";

import './SpotShowPage.css'

function SpotShowPage() {
  const { spotId } = useParams();
  const spot = useSelector(state => state.spot.Spots[spotId]);
  const dispatch = useDispatch();

  const spotShow = useSelector(state => state.spot.spotShow);
  const reviewsObj = useSelector(state => state.review);
  let reviews = Object.values(reviewsObj);
  // const


  useEffect(() => {
    async function getSpotByIdRun() {

      if (!spot) await dispatch(getAllSpots());
      await dispatch(getSpotById(spotId));
      await dispatch(getReviewsBySpotIdThunk(spotId))
    }
    getSpotByIdRun();
  }, [dispatch, spot, spotId]);

  if (!spot) return <h2>Spot can not be found</h2>;
  if (!Object.values(spotShow).length) {
    return <h2>Page loading</h2>;
  }
  console.log(" reviews =======> " , reviews)

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
            <span><FaStar /> {spotShow.avgStarRating} <LuDot /> {spotShow.numReviews} Reviews</span>
          </p>
          <button type="submit">Reserve</button>
        </div>
      </div>
      <div className="review-list-container">
        <h2><FaStar /> {spotShow.avgStarRating} <LuDot /> {spotShow.numReviews} Reviews</h2>
        {/* {reviews?.map(el => {
          return (

          )
        })} */}
        {reviews.length && <ReviewItem review={reviews[1]} />}
      </div>

    </div>
  )
}

export default SpotShowPage;

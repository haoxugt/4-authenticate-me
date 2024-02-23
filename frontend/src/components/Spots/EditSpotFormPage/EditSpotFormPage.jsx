import { useParams } from "react-router-dom";
import SpotForm from "../SpotForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getSpotById } from "../../../store/spot";

function EditSpotFormPage() {
  const { spotId } = useParams();
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const spot = useSelector(state => state.spot.spotShow);

  useEffect(() => {
    async function getSingleSpotRun() {
      await dispatch(getSpotById(spotId));
    }
    getSingleSpotRun();
  }, [dispatch, spotId]);

  if (!sessionUser) return <h2>You must log in.</h2>;
  if ( sessionUser && sessionUser.id !== spot.ownerId) {
    return <h2>You must be the owner of this spot.</h2>;
  }

  if (!Object.values(spot).length) return (<></>);

  return (
    +spot.id === +spotId && (
      <SpotForm spot={spot} formType="Edit a spot" />
    )
  )
}

export default EditSpotFormPage;

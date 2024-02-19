import { useParams } from "react-router-dom";
import SpotForm from "../SpotForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getSpotById } from "../../../store/spot";

function EditSpotFormPage() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector(state => state.spot.spotShow);

  useEffect(() => {
    async function getSingleSpotRun() {
      await dispatch(getSpotById(spotId));
    }
    getSingleSpotRun();
  }, [dispatch, spotId]);

  if (!spot) return (<></>);

  return <SpotForm spot={spot} formType="Edit a spot" />;
}

export default EditSpotFormPage;

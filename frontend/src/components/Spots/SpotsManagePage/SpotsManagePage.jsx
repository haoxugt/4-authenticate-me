import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { Navigate } from "react-router-dom";
import SpotItem from "../../SpotItem";
import { getAllSpots, deleteSpot } from "../../../store/spot";
import { useDispatch } from "react-redux";

function SpotsManagePage() {
  const sessionUser = useSelector(state => state.session.user);
  const spotState =  useSelector(state => state.spot);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // if (!Object.values(spotState).length) {}

  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch]);

  if (!sessionUser) return <h2>You must log in.</h2>;
  const spots = Object.values(spotState.Spots).filter(el => el.ownerId === sessionUser.id );
  const updateSpotButton = (e) => {
    // return <Navigate to='../1' replace={true} />;
    e.preventDefault();
    const spotId = Number(e.target.name.slice(11));
    navigate(`/spots/${spotId}/edit`);
  }

  const deleteSpotButton = async (e) => {
    e.preventDefault();
    const spotId = Number(e.target.name.slice(11));
    await dispatch(deleteSpot(spotId));
    // console.log("spotid====>", spotId);
  }

  return (
    <div className="spots-container">
    {spots?.map((spot) => {
      return (
        <NavLink key={spot.id} to={`spots/${spot.id}`}>
          <SpotItem spot={spot}/>
          <button name={`update-spot${spot.id}`}type="submit" onClick={updateSpotButton}>Update</button>
          <button name={`delete-spot${spot.id}`} type="submit" onClick={deleteSpotButton}>Delete</button>
        </NavLink>
        )
    })}
  </div>
  )
}

export default SpotsManagePage;

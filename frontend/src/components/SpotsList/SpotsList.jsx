import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getAllSpots } from "../../store/spot";
import SpotItem from "../SpotItem";
import './SpotsList.css'


function SpotsList() {
  const dispatch = useDispatch();
  const spotState = useSelector(state => state.spot);
  const spots = Object.values(spotState.Spots);


  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch]);

  return (
    <div className="spots-container">
      {spots?.map((spot) => {
        return (
          <NavLink key={spot.id} to={`/spots/${spot.id}`}>
            <SpotItem spot={spot}/>
          </NavLink>
          )
      })}
    </div>
  )
}

export default SpotsList;

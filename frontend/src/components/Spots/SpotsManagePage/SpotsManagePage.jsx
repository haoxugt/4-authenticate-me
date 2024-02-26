import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { Navigate } from "react-router-dom";
import SpotItem from "../../SpotItem";
import { getAllSpots } from "../../../store/spot";
import { useDispatch } from "react-redux";
import OpenModalButton from "../../Modals/OpenModalButton/OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal";
import './SpotsManagePage.css'

function SpotsManagePage() {
  const sessionUser = useSelector(state => state.session.user);
  const spotState = useSelector(state => state.spot);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // if (!Object.values(spotState).length) {}

  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch]);

  if (!sessionUser) return <h2>You must log in.</h2>;
  const spots = Object.values(spotState.Spots).filter(el => el.ownerId === sessionUser.id);
  const updateSpotButton = (e) => {
    // return <Navigate to='../1' replace={true} />;
    e.preventDefault();
    const spotId = Number(e.target.name.slice(11));
    navigate(`/spots/${spotId}/edit`);
  }

  // const deleteSpotButton = async (e) => {
  //   e.preventDefault();
  //   const spotId = Number(e.target.name.slice(11));
  //   await dispatch(deleteSpot(spotId));
  //   // console.log("spotid====>", spotId);
  // }

  const createSpot = (e) => {
    e.preventDefault();
    // dispatch(sessionActions.logout());
    // closeMenu();
    navigate('/spots/new');
  };

  return (
    <>
      <div className='manage-menu'>
        <h3 className='manage-spot-title'>Manage Spots</h3>
        {spots?.length === 0 && (
          <button className='manage-spot-creat-spot-button' onClick={createSpot}>Create a New Spot</button>
        )}
      </div>
      <div className="spots-container">

        {spots?.map((spot) => {
          return (
            <div className='spot-button-container' key={spot.id}>
              <NavLink  to={`/spots/${spot.id}`}>
                <SpotItem spot={spot} />
              </NavLink>
              <div className="manage-spot-button">
                <button name={`update-spot${spot.id}`} type="submit" onClick={updateSpotButton}>Update</button>
                {/* <button name={`delete-spot${spot.id}`} type="submit" onClick={deleteSpotButton}>Delete</button> */}
                <OpenModalButton
                  itemText="Delete"
                  // onItemClick={closeMenu}
                  modalComponent={<DeleteSpotModal spot={spot} />}
                />
              </div>
            </div >
          )
        })}
      </div>
    </>
  )
}

export default SpotsManagePage;

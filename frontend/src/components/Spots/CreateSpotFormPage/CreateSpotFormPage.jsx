import { useSelector } from "react-redux";
import SpotForm from "../SpotForm";

function CreateSpotFormPage() {
  const sessionUser = useSelector(state => state.session.user);
  if (!sessionUser) return <h2>You must log in.</h2>;
  const spot = {
    address: '',
    city: '',
    state: '',
    country: '',
    lat: '',
    lng: '',
    name: '',
    description: '',
    price: ''
  }
  return <SpotForm spot={spot} formType="Create a new spot" />
}

export default CreateSpotFormPage;

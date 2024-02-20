import SpotForm from "../SpotForm";

function CreateSpotFormPage() {
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

import { useState } from 'react';
import './SpotForm.css';
import { useDispatch } from 'react-redux';
import { editSpot, createSpot } from '../../../store/spot';
import { useNavigate } from 'react-router-dom';

function SpotForm({ spot, formType }) {
    const [address, setAddress] = useState(spot?.address);
    const [city, setCity] = useState(spot?.city);
    const [state, setState] = useState(spot?.state);
    const [country, setCountry] = useState(spot?.country);
    const [lat, setLat] = useState(spot?.lat);
    const [lng, setLng] = useState(spot?.lng);
    const [name, setName] = useState(spot?.name);
    const [description, setDescription] = useState(spot?.description);
    const [price, setPrice] = useState(spot?.price);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!Object.values(errors)) {console.log(errors)}
        spot = {
            ...spot,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        }

        if (formType === 'Edit a spot') {
            const toEditSpot = await dispatch(editSpot(spot));
            if (toEditSpot) {
                navigate(`/spots/${toEditSpot.id}`);
                setErrors({});
            }
        } else if (formType === 'Create a new spot') {
            const newSpot = await dispatch(createSpot(spot));
            console.log("newSpot =========> ", newSpot);
            if (newSpot.id) {
                navigate(`/spots/${newSpot.id}`);
                setErrors({});
            } else {
                setErrors({...errors, ...newSpot.errors});
                console.log("errors =========> " , errors);
            }
        }
    }

    return (
        <div>
            <p>{formType}</p>
            <form onSubmit={handleSubmit}>
                <div className='spot-from-container'>
                    <label>Address</label>
                    <input
                        type="text"
                        onChange={(e) => setAddress(e.target.value)}
                        value={address}
                        placeholder='Address'
                        required
                    />

                    <label>
                        City
                        <input
                            type="text"
                            onChange={(e) => setCity(e.target.value)}
                            value={city}
                            placeholder='City'
                            required
                        />
                    </label>
                    <label>
                        State {errors.state && <span className='errors'>{errors.state}</span>}
                        <input
                            type="text"
                            onChange={(e) => setState(e.target.value)}
                            value={state}
                            placeholder='State'
                            // required
                        />
                    </label>
                    <label>
                        Country
                        <input
                            type="text"
                            onChange={(e) => setCountry(e.target.value)}
                            value={country}
                            placeholder='Country'
                            // required
                        />
                    </label>
                    <label>
                        Latitude
                        <input
                            type="text"
                            onChange={(e) => setLat(e.target.value)}
                            value={lat}
                            placeholder='Latitude'
                            required
                        />
                    </label>
                    <label>
                        longtitude {errors.lng && <span className='errors'>{errors.lng}</span>}
                        <input
                            type="text"
                            onChange={(e) => setLng(e.target.value)}
                            value={lng}
                            placeholder='Longtitude'
                            required
                        />
                    </label>
                    <label>
                        Create a title for your spot
                        <input
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            placeholder='Name'
                            required
                        />
                    </label>
                    <label>
                        Describe your place to guests
                        <textarea
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            placeholder='Description'
                        >
                        </textarea>
                    </label>
                    <label>
                        <input
                            type="number"
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                            placeholder='Price'
                        />
                    </label>
                </div>
                <button type="submit" className="spot-spot-button">{formType}</button>
            </form>
        </div>
    );
}

export default SpotForm;

import { useEffect, useState } from 'react';
import './SpotForm.css';
import { useDispatch } from 'react-redux';
import { editSpot, createSpot, createSpotImageThunk } from '../../../store/spot';
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
    const [spotImage1, setSpotImage1] = useState(spot && spot.SpotImages && spot.SpotImages.length && spot.SpotImages[0]?.url || "");
    const [spotImage2, setSpotImage2] = useState(spot && spot.SpotImages && spot.SpotImages.length && spot.SpotImages[1]?.url || "");
    const [spotImage3, setSpotImage3] = useState(spot && spot.SpotImages && spot.SpotImages.length && spot.SpotImages[2]?.url || "");
    const [spotImage4, setSpotImage4] = useState(spot && spot.SpotImages && spot.SpotImages.length && spot.SpotImages[3]?.url || "");
    const [spotImage5, setSpotImage5] = useState(spot && spot.SpotImages && spot.SpotImages.length && spot.SpotImages[4]?.url || "");

    const [image, setImage] = useState(null);

    const disabledImageUpdate = formType === 'Edit a spot';
    const formTitle = formType === 'Edit a spot' ? 'Update your Spot' : 'Create a New Spot';
    const formButton = formType === 'Edit a spot' ? 'Update your Spot' : 'Create Spot';
    const [errors, setErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        setHasSubmitted(true);

        if (Object.values(errors).length) return null;

        spot = {
            ...spot,
            address,
            city,
            state,
            country,
            lat: lat || 0,
            lng: lng || 0,
            name,
            description,
            price
        }

        let spotImage1Obj = { image, preview: true};
        console.log("image =====> ", image, spotImage1Obj )
        let spotImage2Obj = spotImage2 && { url: spotImage2, preview: false};
        let spotImage3Obj = spotImage3 && { url: spotImage3, preview: false};
        let spotImage4Obj = spotImage4 && { url: spotImage4, preview: false};
        let spotImage5Obj = spotImage5 && { url: spotImage5, preview: false};

        if (formType === 'Edit a spot') {

            // const toEditSpot = await dispatch(editSpot(spot));
            dispatch(editSpot(spot))
            .then(res => {
                navigate(`/spots/${res.id}`);
                setErrors({});
                setHasSubmitted(false);
                return;
            })
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
                return;
            })

        } else if (formType === 'Create a new spot') {
            // const newSpot = await dispatch(createSpot(spot));
            // console.log("newSpot =========> ", newSpot);
            // if (newSpot.id) {
            //     navigate(`/spots/${newSpot.id}`);
            //     setErrors({});
            // } else {
            //     setErrors({ ...errors, ...newSpot.errors });
            //     console.log("errors =========> " , errors);
            // }
            let newSpotId;
            dispatch(createSpot(spot))
                .then(res => newSpotId = res.id)
                // .then(spotId => dispatch(createSpotImageThunk(spotId, spotImage1Obj)))
                .then(spotId => dispatch(createSpotImageThunk(spotId, spotImage1Obj)))
                // .then(() => dispatch(createSpotImageThunk(newSpotId, image)))
                .then(() => spotImage2 && dispatch(createSpotImageThunk(newSpotId, spotImage2Obj)))
                .then(() => spotImage3 && dispatch(createSpotImageThunk(newSpotId, spotImage3Obj)))
                .then(() => spotImage4 && dispatch(createSpotImageThunk(newSpotId, spotImage4Obj)))
                .then(() => spotImage5 && dispatch(createSpotImageThunk(newSpotId, spotImage5Obj)))
                .then(() => {
                    navigate(`/spots/${newSpotId}`);
                    setErrors({});
                    setHasSubmitted(false);
                    return;
                })
                .catch(async (res) => {
                    const data = await res.json();

                    if (data && data.errors) setErrors(data.errors);
                    return;
                })

        }
    }

    const checkImageExtension = (url) => {
        return url.toLowerCase().endsWith("png") ||
            url.toLowerCase().endsWith("jpg") ||
            url.toLowerCase().endsWith("jpeg")
    }

    const updateFile = e => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setSpotImage1(file);
            console.log("file =====> ", file)
        }
    };

    useEffect(() => {
        const err = {};
        setHasSubmitted(false);
        if (country.length === 0) err.country = "Country is required";
        if (address.length === 0) err.address = "Address is required";
        if (city.length === 0) err.city = "City is required";
        if (state.length === 0) err.state = "State is required";
        // if (lat.length === 0) setLat(0);
        if (Number(lat) < -90 || Number(lat) > 90) err.lat = "Latitude must be within -90 and 90";
        // if (lng.length === 0) setLng(0);
        // console.log(Number(lat), lat)
        if (Number(lng) < -180 || Number(lng) > 180) err.lat = "Longitude must be within -180 and 180";
        if (name.length === 0) err.name = "Name is required";
        if (description.length < 30) err.description = "Description needs 30 or more characters";
        if (price.length === 0) err.price = "Price per night is required";
        if (price?.length && price <= 0) err.price = "Price per day must be a positive number";

        if (spotImage1.length === 0) err.previewImage = "Preview image is required"
        if (spotImage1?.length && !checkImageExtension(spotImage1)) err.previewImage = "Image URL must end in .png, .jpg, or .jpeg";
        if (spotImage2?.length && !checkImageExtension(spotImage2)) err.spotImage2 = "Image URL must end in .png, .jpg, or .jpeg";
        if (spotImage3?.length && !checkImageExtension(spotImage3)) err.spotImage3 = "Image URL must end in .png, .jpg, or .jpeg";
        if (spotImage4?.length && !checkImageExtension(spotImage4)) err.spotImage4 = "Image URL must end in .png, .jpg, or .jpeg";
        if (spotImage5?.length && !checkImageExtension(spotImage5)) err.spotImage5 = "Image URL must end in .png, .jpg, or .jpeg";

        setErrors(err);
        // if (!Object.values(err).length) {

        // }
    }, [country, address, city, state,
        lat, lng, name, description,
        price, spotImage1, spotImage2, spotImage3,
        spotImage4, spotImage5]);

    return (
        <div>

            <h2 className='spot-form-page-title'>{formTitle}</h2>
            <h3 className='title-intro'>1 Where&apos;s your place located?</h3>
            <p className='paragraph-intro'>Guests will only get your exact address once they booked a reservation.</p>
            <form onSubmit={handleSubmit}>

                <div className='spot-from-container'>

                    <label>
                        Country
                        {hasSubmitted && errors.country && <span className='errors'>{errors.country}</span>}
                    </label>
                    <input
                        type="text"
                        onChange={(e) => setCountry(e.target.value)}
                        value={country}
                        placeholder='Country'
                    // required
                    />

                    <label>
                        Street Address
                        {hasSubmitted && errors.address && <span className='errors'>{errors.address}</span>}
                    </label>
                    <input
                        type="text"
                        onChange={(e) => setAddress(e.target.value)}
                        value={address}
                        placeholder='Address'
                    // required
                    />
                    <div className='city-state-container'>
                        <div className='city-container'>
                            <label>
                                City
                                {hasSubmitted && errors.city && <span className='errors'>{errors.city}</span>}
                            </label>
                            <div>
                                <input
                                    className='city-input'
                                    type="text"
                                    onChange={(e) => setCity(e.target.value)}
                                    value={city}
                                    placeholder='City'
                                // required
                                />
                            </div>
                        </div>
                        ,
                        <div className='state-container'>
                            <label>
                                State
                                {hasSubmitted && errors.state && <span className='errors'>{errors.state}</span>}
                            </label>
                            <input
                                type="text"
                                onChange={(e) => setState(e.target.value)}
                                value={state}
                                placeholder='State'
                            // required
                            />
                        </div>
                    </div>

                    <div className='lat-lng-container hidden'>
                        <div className='lat-container'>
                            <label>
                                Latitude
                                {hasSubmitted && errors.lat && <span className='errors'>{errors.lat}</span>}
                            </label>
                            <div>
                                <input
                                    className='lat-input'
                                    type="text"
                                    onChange={(e) => setLat(e.target.value)}
                                    value={lat}
                                    placeholder='Latitude (optional)'
                                // required
                                />
                            </div>
                        </div>
                        ,
                        <div className='lng-container'>
                            <label>
                                Longtitude
                                {hasSubmitted && errors.lng && <span className='errors'>{errors.lng}</span>}
                            </label>
                            <input
                                type="text"
                                onChange={(e) => setLng(e.target.value)}
                                value={lng}
                                placeholder='Longtitude (optional)'
                            // required
                            />
                        </div>
                    </div>


                    {/* spot description part */}
                    <h3 className='title-intro'>2 Describe your place to guests</h3>
                    <p className='paragraph-intro'>Mention the best features of your space,
                        any special amentities like fast wifi or parking, and what you
                        love about the neighborhood.</p>
                    <textarea
                        className='description-textarea'
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        placeholder='Please write at least 30 characters'
                    >
                    </textarea>
                    {hasSubmitted && errors.description && <span className='errors'>{errors.description}</span>}

                    {/* spot name part */}
                    <h3 className='title-intro'>3 Create a title for your spot</h3>
                    <p className='paragraph-intro'>Catch guests&apos; attention with a spot title that highlights what makes
                        your place special.</p>
                    <input
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        placeholder='Name of your spot'
                    // required
                    />
                    {hasSubmitted && errors.name && <span className='errors'>{errors.name}</span>}

                    {/* spot price part */}
                    <h3 className='title-intro'>4 Set a base price for your spot</h3>
                    <p className='paragraph-intro'>Competitive pricing can help your listing stand out and rank higher
                        in search results.</p>

                    <span className='price-container'><span>$ </span> <input
                        className='price-input'
                        type="number"
                        onChange={(e) => setPrice(e.target.value)}
                        value={price}
                        placeholder='Price, per night (USD)'
                    /></span>
                    <p className='errors'>{hasSubmitted && errors.price && errors.price}</p>

                    {/* spot images part */}
                    {/* {formType === "Create a new spot" &&  */}
                    <div>

                        <h3 className='title-intro'>5 Liven up your spot with photos</h3>
                        <p className='paragraph-intro'>Submit a link to at least one photo to publish your spot.
                            {formType === 'Edit a spot' && <span className='update-image-info'> Not suppoted for updating.</span>}
                        </p>

                        {/* <input
                            className='spotimage-input'
                            type="text"
                            onChange={(e) => setSpotImage1(e.target.value)}
                            value={spotImage1}
                            placeholder='Preview Image URL'
                            disabled={disabledImageUpdate}
                        />
                        <p className='errors'>{hasSubmitted && errors.previewImage && errors.previewImage}</p> */}
                         <input
                            className='spotimage-input'
                            type="file"
                            onChange={updateFile}
                            // value={image}
                            // placeholder='Image File (optional)'
                            // disabled={disabledImageUpdate}
                        />
                        <p className='errors'>{hasSubmitted && errors.previewImage && errors.previewImage}</p>
                        <input
                            className='spotimage-input'
                            type="text"
                            onChange={(e) => setSpotImage2(e.target.value)}
                            value={spotImage2}
                            placeholder='Image URL (optional)'
                            disabled={disabledImageUpdate}
                        />
                        <p className='errors'>{hasSubmitted && errors.spotImage2 && errors.spotImage2}</p>
                        <input
                            className='spotimage-input'
                            type="text"
                            onChange={(e) => setSpotImage3(e.target.value)}
                            value={spotImage3}
                            placeholder='Image URL (optional)'
                            disabled={disabledImageUpdate}
                        />
                        <p className='errors'>{hasSubmitted && errors.spotImage3 && errors.spotImage3}</p>
                        <input
                            className='spotimage-input'
                            type="text"
                            onChange={(e) => setSpotImage4(e.target.value)}
                            value={spotImage4}
                            placeholder='Image URL (optional)'
                            disabled={disabledImageUpdate}
                        />
                        <p className='errors'>{hasSubmitted && errors.spotImage4 && errors.spotImage4}</p>
                        <input
                            className='spotimage-input'
                            type="text"
                            onChange={(e) => setSpotImage5(e.target.value)}
                            value={spotImage5}
                            placeholder='Image URL (optional)'
                            disabled={disabledImageUpdate}
                        />
                        <p className='errors'>{hasSubmitted && errors.spotImage5 && errors.spotImage5}</p>
                        {/* <input
                            className='spotimage-input'
                            type="file"
                            onChange={updateFile}
                            // value={image}
                            // placeholder='Image File (optional)'
                            // disabled={disabledImageUpdate}
                        />
                        <p className='errors'>{hasSubmitted && errors.spotImage5 && errors.spotImage5}</p> */}
                    </div>
                    {/* } */}
                </div>
                <div id="position-line"></div>
                <button type="submit" className="spot-spot-button">{formButton}</button>
            </form>
        </div>
    );
}

export default SpotForm;

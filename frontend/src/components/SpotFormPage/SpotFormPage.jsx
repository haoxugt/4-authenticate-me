import './SpotFormPage.css';

function SpotFormPage( {formType} ) {

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div>
            <p>{ formType }</p>
            <form onSubmit={handleSubmit}>
                <div className='create-from-container'>
                    <label>Address</label>
                    <input
                        type="text"
                        onChange={(e) => { console.log(e) }}
                        id="address"
                        placeholder='Address'
                        required
                    />

                    <label>
                        City
                        <input
                            type="text"
                            onChange={() => { }}
                            placeholder='City'
                            required
                        />
                    </label>
                    <label>
                        State
                        <input
                            type="text"
                            onChange={() => { }}
                            placeholder='State'
                            required
                        />
                    </label>
                    <label>
                        Country
                        <input
                            type="text"
                            onChange={() => { }}
                            placeholder='Country'
                            required
                        />
                    </label>
                    <label>
                        Latitude
                        <input
                            type="text"
                            onChange={() => { }}
                            placeholder='Latitude'
                            required
                        />
                    </label>
                    <label>
                        longtitude
                        <input
                            type="text"
                            onChange={() => { }}
                            placeholder='Longtitude'
                            required
                        />
                    </label>
                    <label>
                        Create a title for your spot
                        <input
                            type="text"
                            onChange={() => { }}
                            placeholder='Name'
                            required
                        />
                    </label>
                    <label>
                        Describe your place to guests
                        <textarea

                            placeholder='Description'
                            required
                        >
                        </textarea>
                    </label>
                    <label>
                        <input
                            type="number"
                            onChange={() => { }}
                            placeholder='Price'
                            required
                        />
                    </label>
                </div>
                <button type="submit" className="create-spot-button">Create new spot</button>
            </form>
        </div>
    );
}

export default SpotFormPage;

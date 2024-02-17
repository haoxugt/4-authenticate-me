const handleSubmit = (e) => {
    e.preventDefault();
}


function CreateSpotFormPage() {
    return (
        <div className="create-form-container">
            <p>Create a spot</p>
            <form onSubmit={handleSubmit}>
                <lable>
                    <input
                        type="text"
                        onChange={() => {}}
                        placeholder='Address'
                        required
                    />
                </lable>
                <lable>
                    <input
                        type="text"
                        onChange={() => {}}
                        placeholder='City'
                        required
                    />
                </lable>
                <lable>
                    <input
                        type="text"
                        onChange={() => {}}
                        placeholder='State'
                        required
                    />
                </lable>
                <lable>
                    <input
                        type="text"
                        onChange={() => {}}
                        placeholder='Country'
                        required
                    />
                </lable>
                <lable>
                    <input
                        type="text"
                        onChange={() => {}}
                        placeholder='Latitude'
                        required
                    />
                </lable>
                <lable>
                    <input
                        type="text"
                        onChange={() => {}}
                        placeholder='Longtitude'
                        required
                    />
                </lable>
                <lable>
                    <input
                        type="text"
                        onChange={() => {}}
                        placeholder='Name'
                        required
                    />
                </lable>
                <lable>
                    <textarea
                        type="text"
                        onChange={() => {}}
                        placeholder='Description'
                        required
                    />
                </lable>
                <lable>
                    <input
                        type="number"
                        onChange={() => {}}
                        placeholder='Price'
                        required
                    />
                </lable>
            </form>
        </div>
    );
}

export default CreateSpotFormPage;

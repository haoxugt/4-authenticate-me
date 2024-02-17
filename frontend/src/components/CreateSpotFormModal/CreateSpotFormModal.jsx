function CreateSpotFormModal() {
    return (
        <div className="create-form-container">
            <p>Create a spot</p>
            <form onSubmit={handleSubmit}>
                <lable>
                    <input
                        type="text"
                        onChange={(e) => }
                        placeholder='Address'
                        required
                    />
                </lable>
                <lable>
                    <input
                        type="text"
                        onChange={(e) => }
                        placeholder='City'
                        required
                    />
                </lable>
                <lable>
                    <input
                        type="text"
                        onChange={(e) => }
                        placeholder='State'
                        required
                    />
                </lable>
                <lable>
                    <input
                        type="text"
                        onChange={(e) => }
                        placeholder='Country'
                        required
                    />
                </lable>
                <lable>
                    <input
                        type="text"
                        onChange={(e) => }
                        placeholder='Latitude'
                        required
                    />
                </lable>
                <lable>
                    <input
                        type="text"
                        onChange={(e) => }
                        placeholder='Longtitude'
                        required
                    />
                </lable>
                <lable>
                    <input
                        type="text"
                        onChange={(e) => }
                        placeholder='Name'
                        required
                    />
                </lable>
                <lable>
                    <textarea
                        type="text"
                        onChange={(e) => }
                        placeholder='Description'
                        required
                    />
                </lable>
                <lable>
                    <input
                        type="number"
                        onChange={(e) => }
                        placeholder='Price'
                        required
                    />
                </lable>
            </form>
        </div>
    );
}


export default function NewPharmacy(){

    return (
        <>
        <div className="container">
            <div className="card m-auto p-2">
                <div className="card-body">
                <form >
                    <div className="logo">
                        <h1 className="logo-caption font-weight-bolder"><span className="tweak">P</span>harmacy <span className="tweak">M</span>anagement</h1>
                        <h2 className="logo-caption font-weight-bolder"><span className="tweak">O</span>ne <span className="tweak">T</span>ime <span className="tweak">S</span>etup</h2>
                        <p className="h5 text-center text-light">Enter necessary pharmacy details</p>
                    </div>

                    <div className="input-group form-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"><i className="fas fa-plus-square text-white"></i></span>
                    </div>
                    <input id="pharmacy_name" type="text" className="form-control" placeholder="pharmacy name" />
                    </div>

                    <div className="input-group form-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"><i className="fas fa-address-card text-white"></i></span>
                    </div>
                    <textarea id="address" className="form-control" placeholder="address" style={{maxHeight: "100px"}} ></textarea>
                    </div>

                    <div className="input-group form-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"><i className="fas fa-envelope text-white"></i></span>
                    </div>
                    <input id="email" type="email" className="form-control" placeholder="email" />
                    </div>

                    <div className="input-group form-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"><i className="fas fa-mobile-alt text-white"></i></span>
                    </div>
                    <input id="contact_number" type="number" className="form-control" placeholder="contact number" />
                    </div>

                    <div className="input-group form-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"><i className="fa fa-user-circle text-white"></i></span>
                    </div>
                    <input type="text" className="form-control" placeholder="select profile image" id="profile_name" />
                    &emsp;<p className="m-auto text-light">Optional</p>
                    <input id="profile_image" type="file" accept="image/*" className="form-control" style={{display: "none"}} />
                    </div> 

                    <div className="input-group form-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"><i className="fas fa-user text-white"></i></span>
                    </div>
                    <input id="username" type="text" className="form-control" placeholder="enter username" />
                    </div>

                    <div className="input-group form-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"><i className="fas fa-lock text-white"></i></span>
                    </div>
                    <input id="password" type="text" className="form-control" placeholder="enter password" />
                    </div>

                    <div className="input-group form-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"><i className="fas fa-key text-white"></i></span>
                    </div>
                    <input id="confirm_password" type="password" className="form-control" placeholder="confirm password" />
                    </div> 

                    <div className="form-group">
                    <button className="btn btn-default btn-block btn-custom">START</button>
                    </div>
                </form>
                </div>
            </div>
        </div>

        </>
    )
}
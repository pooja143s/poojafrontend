export default function AddUser() {
    return (
        <>
            {/* Header Start */}
            <div className="container-fluid bg-primary py-5 mb-5 page-header">
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 text-center">
                            <h1 className="display-3 text-white animated slideInDown">
                                Add User
                            </h1>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb justify-content-center">
                                    <li className="breadcrumb-item">
                                        <a className="text-white" href="#">
                                            Dashboard
                                        </a>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <a className="text-white" href="#">
                                            users
                                        </a>
                                    </li>

                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            {/* Header End */}
            {/* Service Start */}
            <div className="container-xxl">
                <div className="container">

                    <div className="col-lg-8 offset-lg-2 col-md-12 wow fadeInUp" data-wow-delay="0.5s">
                        <form>

                            <div className="row my-2">
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="name"
                                            className="form-control"
                                            id="email"
                                            placeholder="Your Name "
                                        />
                                        <label htmlFor="email">Your Name</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="subject"
                                            placeholder="Your Phone Number"
                                        />
                                        <label htmlFor="subject">Phone Number</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row my-2">
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            placeholder="Your Email"
                                        />
                                        <label htmlFor="email">Your Email</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="subject"
                                            placeholder="Password"
                                        />
                                        <label htmlFor="subject">Password</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row my-2">
                               
                                <div className="col-md-12">
                                    <div className="form-floating">
                                       <textarea name=""   className="form-control" id=""></textarea>
                                        <label htmlFor="subject">Address</label>
                                    </div>
                                </div>
                            </div>
                           
                        

                            <div className="row g-3">
                                <div className="col-12">
                                    <button className="btn btn-primary w-100 py-3" type="submit">
                                        Login
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>


                </div>
            </div>

            {/* Team End */}
        </>
    )
}


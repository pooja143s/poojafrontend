import { Link } from "react-router-dom";

export default function ManageUsers() {
    return (
        <>
            {/* Header Start */}
            <div className="container-fluid bg-primary py-5 mb-5 page-header">
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 text-center">
                            <h1 className="display-3 text-white animated slideInDown">
                                User List
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
                    <div className="row my-2">
                        <div className="col-md h4">
                            Manage User
                        </div>
                        <div className="col-md text-end">
                            <Link to="/admin/user/add">
                                <button className="btn btn-sm btn-primary rounded rounded-pill">
                                    + Add New User
                                </button>
                            </Link>

                        </div>
                    </div>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone</th>
                                <th scope="col">CreatedAt</th>
                                <th scope="col">UpdatedAt</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>Mohit</td>
                                <td>mohit@gmail.com</td>
                                <td>5678909876</td>
                                <td>2026-02-26</td>
                                <td>2026-02-27</td>
                                <td>
                                    <button className="btn btn-sm text-primary">
                                        <i className="bi bi-pencil-square"></i>


                                    </button>
                                </td>
                            </tr>

                        </tbody>
                    </table>


                </div>
            </div>

            {/* Team End */}
        </>
    )
}


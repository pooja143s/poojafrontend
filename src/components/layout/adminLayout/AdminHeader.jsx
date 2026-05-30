import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
export default function AdminHeader() {

    const nav = useNavigate()
    const logout = (e) => {
        e.preventDefault()
        toast.success("Logout Successfully")
        localStorage.clear()
        nav('/login')
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
                <a
                    href="index.html"
                    className="navbar-brand d-flex align-items-center px-4 px-lg-5"
                >
                    <h2 className="m-0 text-primary">
                        <i className="fa fa-book me-3" />
                        ALUMNI FY
                    </h2>
                </a>
                <button
                    type="button"
                    className="navbar-toggler me-4"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarCollapse"
                >
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <div className="navbar-nav ms-auto p-4 p-lg-0">
                        <NavLink to="/admin/dashboard" className="nav-item nav-link" >
                            Dashboard
                        </NavLink>
                        <NavLink to="/admin/topics/manage" className="nav-item nav-link"    >
                            Topics
                        </NavLink>
                        <NavLink to="/admin/alumni/manage" className="nav-item nav-link"    >
                            Alumnis
                        </NavLink>
                        <NavLink to="/admin/students/manage" className="nav-item nav-link"    >
                            Students
                        </NavLink>
                        <div className="nav-item dropdown">
                            <a
                                href="#"
                                className="nav-link dropdown-toggle"
                                data-bs-toggle="dropdown"
                            >
                                More Links
                            </a>
                            <div className="dropdown-menu fade-down m-0">
                                <Link to={"/admin/mentorship"} className="dropdown-item">
                                    Mentorship
                                </Link>

                                <Link to="/admin/discussions" className="dropdown-item">
                                    Discussions
                                </Link>

                                <Link to="/admin/sessions" className="dropdown-item">
                                    Live Sessions
                                </Link>
                                <Link to="/admin/enrollments" className="dropdown-item">
                                    Enrollments
                                </Link>
                            </div>
                        </div>
                    </div>
                    <a onClick={logout} className="btn btn-primary py-4 px-lg-5 d-none d-lg-block">
                        Logout
                        <i className="fa fa-arrow-right ms-3" />
                    </a>
                </div>
            </nav>

        </>
    )

}
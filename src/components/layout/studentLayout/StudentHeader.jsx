import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export default function StudentHeader() {
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
                        <NavLink to="/" className="nav-item nav-link">
                            Home
                        </NavLink>
                        <NavLink to="/about" className="nav-item nav-link">
                            About
                        </NavLink>
                        <NavLink to="/alumnis" className="nav-item nav-link">
                            Alumnis
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
                                <Link to={`/mentorships/${null}`} className="dropdown-item">
                                    Mentorship Programs
                                </Link>

                                <Link to="/discussions" className="dropdown-item">
                                    Discussions
                                </Link>

                                <Link to="/liveSessions" className="dropdown-item">
                                    Live Sessions
                                </Link>
                                <Link to="/topics" className="dropdown-item">
                                    Topics
                                </Link>
                            </div>
                        </div>
                        <div className="nav-item dropdown">
                            <a
                                href="#"
                                className="nav-link dropdown-toggle"
                                data-bs-toggle="dropdown"
                            >
                                Account
                            </a>
                            <div className="dropdown-menu fade-down m-0">
                                <Link to="/profile" className="dropdown-item">
                                    Profile
                                </Link>

                                <Link to="/enrollment/history" className="dropdown-item">
                                    Enrollment History
                                </Link>
                            </div>
                        </div>

                        {localStorage.getItem("token") ? "" :
                            <div className="nav-item dropdown">
                                <a
                                    href="#"
                                    className="nav-link dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                >
                                    Register
                                </a>
                                <div className="dropdown-menu fade-down m-0">
                                    <Link to="/student/register" className="dropdown-item">
                                        Register as Student
                                    </Link>

                                    <Link to="/alumni/register" className="dropdown-item">
                                        Register as Alumni
                                    </Link>
                                </div>
                            </div>
                        }
                    </div>
                    {
                        localStorage.getItem("token") ? <Link className="btn btn-primary py-4 px-lg-5 d-none d-lg-block" onClick={logout}>
                            Logout
                        </Link> : <Link to="/login" className="btn btn-primary py-4 px-lg-5 d-none d-lg-block">
                            Login
                        </Link>
                    }
                </div>
            </nav>
        </>
    )
}
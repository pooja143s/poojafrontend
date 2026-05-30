import { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import 'react-responsive-pagination/themes/classic-light-dark.css';
import { allAlumnis, blockUnblockAlumni } from "../../../services/userService";
import { Link } from "react-router-dom";

export default function ViewAlumnis() {
    const [search, setSearch] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [alumnis, setAlumnis] = useState([]);

    useEffect(() => {
        getAllAlumnis();
    }, []);

    const getAllAlumnis = () => {
        setLoading(true);
        let payload = {
            isBlocked: false,
            isDeleted: false,
            status: true
        }
        if (search && search !== "") {
            payload.search = search.trim();
        }
        allAlumnis(payload).then((res) => {
            if (res.data.success) {
                setLoading(false);
                setAlumnis(res.data.data);
            } else {
                setLoading(false);
                toast.error(res.data.message);
            }
        }).catch((err) => {
            setLoading(false);
            console.log(err);
            toast.error(err.response?.data?.message || err.message);
        })
    };

    const hitSearch = () => {
        getAllAlumnis();
    }

    const alumniBlockUnblock = (_id, isBlocked) => {
        setLoading(true);
        blockUnblockAlumni({ _id: _id, isBlocked: isBlocked })
            .then((res) => {
                if (res.data.success) {
                    setLoading(false);
                    toast.success(res.data.message);
                    getAllAlumnis();
                } else {
                    toast.error(res.data.message);
                    setLoading(false);
                }
            })
            .catch((err) => {
                setLoading(false);
                toast.error(err.message);
            });
    }

    return (
        <>
            {loading && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100vh",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 999999
                }}>
                    <PuffLoader color="#fff" size={80} />
                </div>
            )}
            {/* Header Start */}
            <div className="container-fluid bg-primary page-header">
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 text-center">
                            <h1 className="display-3 text-white animated slideInDown">
                                Alumnis
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
                                            Alumnis
                                        </a>
                                    </li>

                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-xxl">
                <div className="container">

                    {/* Search Bar */}
                    <div className="row my-3">
                        <div className="col-12 d-flex justify-content-end">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    hitSearch();
                                }}
                                style={{ width: "100%", maxWidth: "350px" }}
                            >
                                <div className="input-group shadow-sm">
                                    <input
                                        type="text"
                                        className="form-control border-end-0"
                                        placeholder="Search Alumni..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <button type="submit" className="input-group-text bg-white border-start-0">
                                        <i className="bi bi-search"></i>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Instructors Section */}
                    <div className="container-xxl py-5">
                        <div className="container">
                            <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                                <h6 className="section-title bg-white text-center text-primary px-3">
                                    Alumni Mentors
                                </h6>
                                <h1 className="mb-5">Meet Our Mentors</h1>
                            </div>
                            <div className="row g-4">
                                {
                                    alumnis.length > 0 ? (
                                        alumnis.map((alumni, index) => (
                                            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                                                <div className="team-item bg-light">
                                                    <div className="overflow-hidden">
                                                        <img className="img-fluid" src={alumni.profileImage} alt=""  />
                                                    </div>
                                                    <div
                                                        className="position-relative d-flex justify-content-center"
                                                        style={{ marginTop: "-23px" }}
                                                    >
                                                        <div className="bg-light d-flex justify-content-center pt-2 px-2 gap-2 flex-wrap">
                                                            <span className="badge bg-primary">Experience : {alumni.experience}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-center p-4">
                                                        <h5 className="mb-0">{alumni.name}</h5>
                                                        <small>{alumni.currentJob}</small>
                                                    </div>
                                                    <div className="d-flex justify-content-center mb-2">
                                                        <Link to={`/mentorships/${alumni._id}`} className="btn btn-primary mb-2">View Mentorships</Link>
                                                    </div>
                                                </div>
                                            </div>

                                        ))
                                    ) : (
                                        <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                                            No Alumnis found.
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}


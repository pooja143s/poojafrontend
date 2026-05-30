import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import Switch from "react-switch";
import { toast } from "react-toastify";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';
import ReactModal from "react-modal";
import { allEnrollmentsAdmin, changeEnrollmentStatus, manageEnrollments } from "../../../services/enrollmentService";


const modalStyle = {
    content: {
        width: '50%',
        margin: 'auto',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        padding: 20,
        border: 'none',
        borderRadius: '8px',
        maxHeight: '90vh',
        overflow: 'auto',
        zIndex: 100000,
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 100001,
    }
};
export default function AdminAllEnrollments() {
    const [_id, setId] = useState("");

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);

    const [search, setSearch] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const [enrollments, setEnrollments] = useState([]);

    useEffect(() => {
        getEnrollments();
    }, [page]);

    const getEnrollments = () => {
        setLoading(true);
        let payload = {
            limit: limit,
            startPoint: (page - 1) * limit,
            isBlocked: false,
            isDeleted: false,
            status: true
        }
        if (search && search !== "") {
            payload.search = search.trim();
        }
        allEnrollmentsAdmin(payload).then((res) => {
            if (res.data.success) {
                setLoading(false);
                setEnrollments(res.data.data);
                setTotal(res.data.total);
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
        // setPage(1);
        getAllTopics();
    }

    const updateStatus = (_id, status) => {
        setLoading(true);

        changeEnrollmentStatus({ _id, enrollmentStatus: status }) // API you created
            .then((res) => {
                setLoading(false);

                if (res.data.success) {
                    toast.success(res.data.message);
                    getEnrollments(); //  FIX (you used wrong function before)
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch((err) => {
                setLoading(false);
                toast.error(err.response?.data?.message || err.message);
            });
    };



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
                                Enrollments
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
                                            Enrollments
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
                    <div className="row my-2 align-items-center">
                        <div className="col-md-6">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    hitSearch();
                                }}
                            >
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search Enrollments..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <button type="submit" className="input-group-text bg-white" >
                                        <i className="bi bi-search"></i>
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Mentorship Title</th>
                                <th>Mentor</th>
                                <th>Learner</th>
                                <th>Enrolled On</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                enrollments.length > 0 ? (
                                    enrollments.map((enrollment, index) => (
                                        <tr key={enrollment._id}>
                                            <td>{index + 1}</td>
                                            <td>{enrollment.mentorshipId?.title}</td>
                                            <td>{enrollment.mentorshipId?.alumniId?.name}</td>
                                            <td>
                                                <span>{enrollment.studentId?.name}</span> <br />
                                                <small className="text-muted" >{enrollment.studentId?.email}</small>
                                            </td>
                                            <td>
                                                <i className="fa fa-calendar-alt text-primary me-2"></i>
                                                {new Date(enrollment.createdAt).toLocaleDateString("en-GB", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="text-center">
                                                <span className={`badge px-3 py-2 ${enrollment.enrollmentStatus === "Approved" ? "bg-success" :
                                                    enrollment.enrollmentStatus === "Rejected" ? "bg-danger" : "bg-warning"
                                                    }`} style={{ borderRadius: "20px" }}>
                                                    {enrollment.enrollmentStatus || "Pending"}
                                                </span>
                                            </td>
                                            <td>
                                                {/* ACTION BUTTONS */}
                                                <div className="d-flex justify-content-center gap-2">
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        disabled={enrollment.enrollmentStatus === "Approved"}
                                                        onClick={() => updateStatus(enrollment._id, "Approved")}
                                                    >
                                                        Approve
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        disabled={enrollment.enrollmentStatus === "Rejected"}
                                                        onClick={() => updateStatus(enrollment._id, "Rejected")}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="text-center">
                                            No Enrollments found.
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    <ResponsivePagination
                        current={page}
                        total={Math.ceil(total / limit)}
                        onPageChange={setPage}
                    />
                </div>
            </div>

        </>
    )
}


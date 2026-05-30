import { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import 'react-responsive-pagination/themes/classic-light-dark.css';
import { allEnrollments } from "../../../services/enrollmentService";
import ReactModal from "react-modal";
import { addFeedback } from "../../../services/userService";

export default function ViewEnrollmentHistory() {
    const [loading, setLoading] = useState(false);
    const [enrollments, setEnrollments] = useState([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMentorship, setSelectedMentorship] = useState("");
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState("");

    useEffect(() => {
        getEnrollments();
    }, []);

    const getEnrollments = () => {
        const studentId = localStorage.getItem("studentId");
        if (!studentId) {
            toast.error("Student ID not found. Please login again.");
            return;
        }
        setLoading(true);
        let payload = {
            studentId: studentId,
            isBlocked: false,
            isDeleted: false,
            status: true
        }
        allEnrollments(payload).then((res) => {
            if (res.data.success) {
                setLoading(false);
                setEnrollments(res.data.data);
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

    const openModal = (mentorshipId) => {
        setSelectedMentorship(mentorshipId);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setMessage("");
        setRating("");
    };

    const submitFeedback = (e) => {
        e.preventDefault();

        if (!message || !rating) {
            return toast.error("All fields required");
        }

        const studentId = localStorage.getItem("studentId");
        const payload = {
            mentorshipId: selectedMentorship,
            addedById: studentId,
            message,
            rating
        };

        setLoading(true);

        addFeedback(payload)
            .then((res) => {
                setLoading(false);
                if (res.data.success) {
                    toast.success(res.data.message);
                    closeModal();
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch((err) => {
                setLoading(false);
                toast.error(err.response?.data?.message || err.message);
            });
    };

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
                                Enrollment History
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
            <div className="container-fluid">
                <div className="container-fluid">
                    {/* nstructors Section */}
                    <div className="container-fluid py-2">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md">
                                    <h3 className="text-primary">Your Enrollments</h3>
                                </div>
                            </div>
                            <div className="table-responsive wow fadeInUp" data-wow-delay="0.1s">
                                <table className="table table-hover table-bordered bg-light shadow-sm">
                                    <thead className="bg-primary text-white">
                                        <tr>
                                            <th scope="col" className="py-3 px-4">#</th>
                                            <th scope="col" className="py-3">Mentorship Title</th>
                                            <th scope="col" className="py-3">Alumni Mentor</th>
                                            <th scope="col" className="py-3">Meeting Link</th>
                                            <th scope="col" className="py-3">Enrolled On</th>
                                            <th scope="col" className="py-3 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {enrollments.length > 0 ? (
                                            enrollments.map((enrollment, index) => (
                                                <tr key={index} className="align-middle">
                                                    <td className="px-4 font-weight-bold">{index + 1}</td>
                                                    <td>
                                                        <h6 className="mb-0 text-dark">{enrollment.mentorshipId?.title}</h6>
                                                        <small className="text-muted">Duration: {enrollment.mentorshipId?.duration || "N/A"}</small>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <i className="fa fa-user-tie text-primary me-2"></i>
                                                            <span>{enrollment.mentorshipId?.alumniId?.name || "N/A"}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {enrollment?.enrollmentStatus === "Approved" ? (
                                                            enrollment.mentorshipId?.meetingLink ? (
                                                                <a href={enrollment.mentorshipId?.meetingLink} target="_blank" rel="noreferrer">
                                                                    Join
                                                                </a>
                                                            ) : "-"
                                                        ) : (
                                                            <span className="text-muted">Provided after approval</span>
                                                        )}
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
                                                        <div className="d-flex justify-content-center align-items-center gap-2">

                                                            {/* STATUS BADGE */}
                                                            <span
                                                                className={`badge px-3 py-2 ${enrollment.enrollmentStatus === "Approved"
                                                                    ? "bg-success"
                                                                    : enrollment.enrollmentStatus === "Rejected"
                                                                        ? "bg-danger"
                                                                        : "bg-warning"
                                                                    }`}
                                                                style={{ borderRadius: "20px", fontSize: "14px" }}
                                                            >
                                                                {enrollment.enrollmentStatus || "Pending"}
                                                            </span>

                                                            {/* ICON */}
                                                            {enrollment.enrollmentStatus === "Approved" && (
                                                                <i
                                                                    className="bi bi-chat-dots-fill text-primary"
                                                                    style={{ cursor: "pointer", fontSize: "20px" }}
                                                                    title="Add Feedback"
                                                                    onClick={() => openModal(enrollment.mentorshipId?._id)}
                                                                ></i>
                                                            )}

                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center py-5 text-muted">
                                                    <i className="fa fa-info-circle me-2"></i>
                                                    No Enrollment History found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <ReactModal
                isOpen={modalOpen}
                onRequestClose={closeModal}
                contentLabel="Manage Category"
                style={modalStyle}
            >
                <div className="container-xxl ">
                    <div className="container">
                        <div className="text-center">
                            <h6 className="section-title bg-white text-center text-primary px-3">
                                Give Feedback</h6>
                        </div>

                        <form onSubmit={submitFeedback}>
                            <div className="mb-3">
                                <label className="form-label">Rating (1-5)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    className="form-control"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Message</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>

                            <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-danger" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </ReactModal>
        </>
    )
}


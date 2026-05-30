import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import Switch from "react-switch";
import { toast } from "react-toastify";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';
import ReactModal from "react-modal";
import { addMentorship, allMentorships, blockUnblockMentorship, singleMentorship, updateMentorship } from "../../../services/mentorshipService";
import { adminAllFeedback } from "../../../services/userService";


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
export default function AdminManageMentorShip() {

    const [alumniId, setAlumniId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [sessionDate, setSessionDate] = useState("");
    const [sessionTime, setSessionTime] = useState("");
    const [duration, setDuration] = useState("");
    const [meetingLink, setMeetingLink] = useState("");
    const [maxParticipants, setMaxParticipants] = useState("");

    const [modalIsOpen, setIsOpen] = useState(false);
    const [formType, setFormType] = useState("");
    const [_id, setId] = useState("");

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);

    const [search, setSearch] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const [mentorships, setMentorships] = useState([]);

     // Feedback Modal States
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [selectedMentorship, setSelectedMentorship] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [feedbackLoading, setFeedbackLoading] = useState(false);

    const openModal = (_id, type) => {
        setIsOpen(true);
        setFormType(type);
        setId(_id);
        if (type === "update") {
            singleMentorship({ _id: _id }).then((res) => {
                if (res.data.success) {
                    setLoading(false);
                    setAlumniId(res.data.data.alumniId);
                    setTitle(res.data.data.title);
                    setDescription(res.data.data.description);
                    setSessionDate(res.data.data.sessionDate ? new Date(res.data.data.sessionDate).toISOString().split("T")[0] : "");
                    setSessionTime(res.data.data.sessionTime);
                    setDuration(res.data.data.duration);
                    setMeetingLink(res.data.data.meetingLink);
                    setMaxParticipants(res.data.data.maxParticipants);
                }
                else {
                    setLoading(false);
                    toast.error(res.data.message)
                }
            }).catch((err) => {
                setLoading(false);
                console.log(err);
                toast.error(err)
            })
        }
    }
    const closeModal = () => {
        setIsOpen(false);
        getAllTopics();
        setTitle("");
        setDescription("");
        setSessionDate("");
        setDuration("");
        setMeetingLink("");
        setMaxParticipants("");
    }

    const openFeedbackModal = (mentorship) => {
        setSelectedMentorship(mentorship);
        setIsFeedbackModalOpen(true);
        getFeedbacks(mentorship._id);
    };

    const closeFeedbackModal = () => {
        setIsFeedbackModalOpen(false);
        setSelectedMentorship(null);
        setFeedbacks([]);
    };

    const getFeedbacks = (mentorshipId) => {
        setFeedbackLoading(true);

        adminAllFeedback({ mentorshipId })
            .then((res) => {
                setFeedbackLoading(false);
                if (res.data.success) {
                    setFeedbacks(res.data.data);
                }
            })
            .catch((err) => {
                setFeedbackLoading(false);
                console.log(err);
            });
    };

    useEffect(() => {
        getAllTopics();
    }, [page]);

    const getAllTopics = () => {
        setLoading(true);
        let payload = {
            limit: limit,
            startPoint: (page - 1) * limit
        }
        if (search && search !== "") {
            payload.search = search.trim();
        }
        allMentorships(payload).then((res) => {
            if (res.data.success) {
                setLoading(false);
                setMentorships(res.data.data);
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

    const toggleMentorshipStatus = (_id, isBlocked) => {
        setLoading(true);
        blockUnblockMentorship({ _id: _id, isBlocked: isBlocked })
            .then((res) => {
                if (res.data.success) {
                    setLoading(false);
                    toast.success(res.data.message);
                    getAllTopics();
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

    const submit = (e) => {
        e.preventDefault()
        setLoading(true);
        let payload = {
            alumniId: localStorage.getItem("alumniId"),
            title: title,
            description: description,
            sessionDate: sessionDate,
            sessionTime: sessionTime,
            duration: duration,
            meetingLink: meetingLink,
            maxParticipants: maxParticipants
        }
        if (formType === "update") {
            payload._id = _id;
            updateMentorship(payload).then((res) => {
                if (res.data.success) {
                    setLoading(false);
                    toast.success(res.data.message)
                    closeModal();
                }
                else {
                    setLoading(false);
                    toast.error(res.data.message)
                }
            }).catch((err) => {
                setLoading(false);
                console.log(err);
                toast.error(err)
            })
        }
        else if (formType === "add") {
            addMentorship(payload).then((res) => {
                if (res.data.success) {
                    setLoading(false);
                    toast.success(res.data.message)
                    closeModal();
                }
                else {
                    setLoading(false);
                    toast.error(res.data.message)
                }
            }).catch((err) => {
                setLoading(false);
                console.log(err);
                toast.error(err)
            })
        }
        else {
            toast.error("Invalid form type");
            setLoading(false);
            return;
        }
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
                                Mentorships
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
                                            Mentorships
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
                                        placeholder="Search Mentorships..."
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
                                <th>Title</th>
                                <th>Alumni</th>
                                <th>Description</th>
                                <th>Session Date</th>
                                <th>Session Time</th>
                                <th>Duration</th>
                                <th>Meeting Link</th>
                                <th>Max</th>
                                <th>Available</th>
                                <th>Status</th>
                                <th>Feedbacks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                mentorships.length > 0 ? (
                                    mentorships.map((mentorship, index) => (
                                        <tr key={mentorship._id}>
                                            <td>{index + 1}</td>
                                            <td>{mentorship.title}</td>
                                            <td>
                                                <span>{mentorship.alumniId?.name}</span> <br />
                                                <small className="text-muted" >{mentorship.alumniId?.email}</small>
                                            </td>
                                            <td>
                                                <div data-bs-toggle="tooltip" data-bs-placement="top" title={mentorship.description || "-"}>
                                                    {mentorship.description ? mentorship.description.slice(0, 15) + "..." : "-"}
                                                </div>
                                            </td>
                                            <td>
                                                {mentorship.sessionDate
                                                    ? new Date(mentorship.sessionDate).toLocaleString("en-GB", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })
                                                    : "-"}
                                            </td>
                                            <td>
                                                {mentorship.sessionTime}
                                            </td>
                                            <td>{mentorship.duration || "-"}</td>
                                            <td>
                                                {mentorship.meetingLink ? (
                                                    <a href={mentorship.meetingLink} target="_blank" rel="noreferrer">
                                                        Join
                                                    </a>
                                                ) : "-"}
                                            </td>
                                            <td>{mentorship.maxParticipants}</td>
                                            <td>{mentorship.availableSlots}</td>
                                            <td className="text-center">
                                                <Switch
                                                    checked={!mentorship.isBlocked}
                                                    onColor="#2BC5D4"
                                                    onChange={() =>
                                                        toggleMentorshipStatus(mentorship._id, !mentorship.isBlocked)
                                                    }
                                                    height={24}
                                                />
                                            </td>
                                            <td className="text-center">
                                                <i
                                                    className="bi bi-chat-dots-fill text-primary"
                                                    style={{ cursor: "pointer", fontSize: "18px" }}
                                                    title="View Feedbacks"
                                                    onClick={() => openFeedbackModal(mentorship)}
                                                ></i>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="text-center">
                                            No mentorship programs found.
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
<ReactModal
                isOpen={isFeedbackModalOpen}
                onRequestClose={closeFeedbackModal}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        zIndex: 9000
                    },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        maxHeight: '90vh',
                        borderRadius: '15px',
                        padding: '0',
                        border: 'none',
                        overflow: 'hidden'
                    }
                }}
            >
                <div className="card border-0">
                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 text-white">Mentorship Feedbacks</h5>
                        <button onClick={closeFeedbackModal} className="btn-close btn-close-white"></button>
                    </div>

                    <div className="card-body" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                        {selectedMentorship && (
                            <>
                                <h4 className="text-primary">{selectedMentorship.title}</h4>
                                <p className="text-muted">{selectedMentorship.description}</p>
                                <hr />

                                {feedbackLoading ? (
                                    <div className="text-center py-3">
                                        <div className="spinner-border text-primary"></div>
                                    </div>
                                ) : feedbacks.length > 0 ? (
                                    feedbacks.map((fb, index) => (
                                        <div key={index} className="bg-light p-3 rounded mb-3 shadow-sm border-start border-primary border-4">
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <strong>{fb.addedById?.name}</strong>
                                                    <br />
                                                    <small className="text-muted">{fb.addedById?.email}</small>
                                                </div>
                                                <small className="text-muted">
                                                    {new Date(fb.createdAt).toLocaleDateString("en-GB")}
                                                </small>
                                            </div>
                                            <p className="mt-2 mb-0">{fb.message || fb.feedback}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-muted">No feedbacks found.</p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </ReactModal>
        </>
    )
}


import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import Switch from "react-switch";
import { toast } from "react-toastify";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';
import ReactModal from "react-modal";
import { addLiveSession, allLiveSessions, blockUnblockLiveSession, singleLiveSession, updateLiveSession } from "../../../services/liveSessionService";



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
export default function ViewLiveSessions() {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const [alumniId, setAlumniId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [meetingLink, setMeetingLink] = useState("");
    const [sessionDate, setSessionDate] = useState("");
    const [sessionTime, setSessionTime] = useState("");
    const [topicId, setTopicId] = useState("");

    const [modalIsOpen, setIsOpen] = useState(false);
    const [formType, setFormType] = useState("");
    const [_id, setId] = useState("");

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);

    const [search, setSearch] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const [mentorships, setMentorships] = useState([]);

    const openModal = (_id, type) => {
        setIsOpen(true);
        setFormType(type);
        setId(_id);
        if (type === "update") {
            singleLiveSession({ _id: _id }).then((res) => {
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
        allLiveSessions(payload).then((res) => {
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
        blockUnblockLiveSession({ _id: _id, isBlocked: isBlocked })
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
            meetingLink: meetingLink,
        }
        if (formType === "update") {
            payload._id = _id;
            updateLiveSession(payload).then((res) => {
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
            addLiveSession(payload).then((res) => {
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

    const handleJoinClick = (e, link) => {
        const token = localStorage.getItem("token");

        if (!token) {
            e.preventDefault();
            toast.error("Please Login First");
        } else {
            window.open(link, "_blank");
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
                                Live Sessions
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
                                            Live Sessions
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

            <div className="container-xxl ">
                <div className="container">
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
                                        placeholder="Search Live Sessions..."
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
                    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                        <h6 className="section-title bg-white text-center text-primary px-3">
                            Live Guidance
                        </h6>
                        <h1 className="mb-5">Ongoing & Upcoming Sessions</h1>
                    </div>
                    <div className="row g-4">


                        {
                            mentorships.length > 0 ? (
                                mentorships.map((mentorship, index) => (
                                    <div className="col-lg-3 col-md-6 wow fadeInUp" key={index}>
                                        <div className="team-item bg-light shadow-sm">

                                            {/* Profile Image */}
                                            <div className="overflow-hidden">
                                                <img
                                                    className="img-fluid"
                                                    src={mentorship.alumniId?.profileImage || "img/default-user.jpg"}
                                                    alt=""
                                                />
                                            </div>

                                            {/* Join Button instead of social icons */}
                                            <div
                                                className="position-relative d-flex justify-content-center"
                                                style={{ marginTop: "-23px" }}
                                            >
                                                <div className="bg-light pt-2 px-3">
                                                    {mentorship.meetingLink ? (
                                                        <a
                                                            href={mentorship.meetingLink}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="btn btn-sm btn-primary"
                                                            onClick={(e) => handleJoinClick(e, mentorship.meetingLink)}
                                                        >
                                                            Join Session
                                                        </a>
                                                    ) : (
                                                        <span className="badge bg-secondary">Unavailable</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="text-center p-4">

                                                {/* Title */}
                                                <h5 className="mb-1">{mentorship.title}</h5>

                                                {/* Description */}
                                                <small
                                                    className="d-block mb-2 text-muted"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() =>
                                                        setExpandedIndex(expandedIndex === index ? null : index)
                                                    }
                                                >
                                                    {expandedIndex === index
                                                        ? mentorship.description || "-"
                                                        : mentorship.description
                                                            ? mentorship.description.slice(0, 40) + "..."
                                                            : "-"}

                                                    {mentorship.description && (
                                                        <span className="text-primary ms-1">
                                                            {expandedIndex === index ? "Show less" : "Read more"}
                                                        </span>
                                                    )}
                                                </small>

                                                {/* Date */}
                                                <small className="d-block text-muted">
                                                    {mentorship.sessionDate
                                                        ? new Date(mentorship.sessionDate).toLocaleDateString("en-GB", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        })
                                                        : "-"}
                                                </small>

                                                {/* Time */}
                                                <small className="d-block text-primary fw-semibold">
                                                    {mentorship.sessionTime || "Time N/A"}
                                                </small>

                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center">
                                        No Live Sessions found.
                                    </td>
                                </tr>
                            )
                        }



                    </div>
                </div>
            </div>





        </>
    )
}


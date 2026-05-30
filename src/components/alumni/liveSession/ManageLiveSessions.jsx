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
export default function ManageLiveSessions() {

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
        setSessionTime("");
        setMeetingLink("");
        setMaxParticipants("");

    }

    useEffect(() => {
        getAllTopics();
    }, [page]);

    const getAllTopics = () => {
        setLoading(true);
        let payload = {
            alumniId: localStorage.getItem("alumniId"),
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
                                        placeholder="Search Live Sessions..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <button type="submit" className="input-group-text bg-white" >
                                        <i className="bi bi-search"></i>
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="col-md-6 text-md-end text-start">
                            <Link onClick={() => openModal(null, "add")}>
                                <button className="btn btn-primary rounded-pill">
                                    + Create Live Session
                                </button>
                            </Link>
                        </div>
                    </div>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Session Date</th>
                                <th>Session Time</th>
                                <th>Meeting Link</th>
                                <th>Status</th>
                                <th>Action</th>
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
                                  
                                            <td>
                                                {mentorship.meetingLink ? (
                                                    <a href={mentorship.meetingLink} target="_blank" rel="noreferrer">
                                                        Join
                                                    </a>
                                                ) : "-"}
                                            </td>
                              
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
                                                <div className="d-flex justify-content-center gap-2">
                                                    <Link
                                                        onClick={() => openModal(mentorship._id, "update")}
                                                        className="btn btn-sm text-primary"
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </Link>
                                                </div>
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
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Manage Category"
                style={modalStyle}
            >
                <div className="container-xxl ">
                    <div className="container">
                        <div className="text-center">
                            <h6 className="section-title bg-white text-center text-primary px-3">
                                {formType === "add" ? "Add Live Session" : "Update Live Session"}
                            </h6>
                        </div>

                        <div className="row g-4">
                            <div className="col-lg-12">
                                <form onSubmit={submit}>
                                    <div className="row">

                                        {/* Title */}
                                        <div className="col-md-12">
                                            <div className="form-floating">
                                                <input
                                                    required
                                                    type="text"
                                                    className="form-control"
                                                    id="title"
                                                    value={title}
                                                    placeholder="Title"
                                                    onChange={(e) => setTitle(e.target.value)}
                                                />
                                                <label htmlFor="title">Title</label>
                                            </div>
                                        </div>

                                        <div className="col-md-6 mt-3">
                                            <div className="form-floating">
                                                <input
                                                    required
                                                    type="date"
                                                    className="form-control"
                                                    id="sessionDate"
                                                    value={sessionDate}
                                                    onChange={(e) => setSessionDate(e.target.value)}
                                                />
                                                <label htmlFor="sessionDate">Session Date</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mt-3">
                                            <div className="form-floating">
                                                <input
                                                    required
                                                    type="time"
                                                    className="form-control"
                                                    id="sessionTime"
                                                    value={sessionTime}
                                                    onChange={(e) => setSessionTime(e.target.value)}
                                                />
                                                <label htmlFor="sessionTime">Session Time</label>
                                            </div>
                                        </div>
                                      
                                        {/* Meeting Link */}
                                        <div className="col-md-12 mt-3">
                                            <div className="form-floating">
                                                <input
                                                    required
                                                    type="url"
                                                    className="form-control"
                                                    id="meetingLink"
                                                    placeholder="Meeting Link"
                                                    value={meetingLink}
                                                    onChange={(e) => setMeetingLink(e.target.value)}
                                                />
                                                <label htmlFor="meetingLink">Meeting Link</label>
                                            </div>
                                        </div>

                                        {/* Max Participants */}

                                        {/* Description */}
                                        <div className="col-md-12 mt-3">
                                            <div className="form-floating">
                                                <textarea
                                                    className="form-control"
                                                    id="description"
                                                    placeholder="Description"
                                                    style={{ height: "100px" }}
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                />
                                                <label htmlFor="description">Description</label>
                                            </div>
                                        </div>

                                        {/* Buttons */}
                                        <div className="row my-2">
                                            <div className="col-md">
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <button
                                                        type="button"
                                                        className="btn btn-md btn-danger"
                                                        onClick={closeModal}
                                                    >
                                                        Cancel
                                                    </button>

                                                    <button
                                                        className="btn btn-md btn-primary"
                                                        type="submit"
                                                        disabled={loading}
                                                    >
                                                        {loading ? "Please wait..." : "Submit"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>


            </ReactModal>


        </>
    )
}


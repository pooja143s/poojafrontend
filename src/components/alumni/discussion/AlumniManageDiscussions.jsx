import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import Switch from "react-switch";
import { toast } from "react-toastify";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';
import ReactModal from "react-modal";
import { addMentorship, allMentorships, blockUnblockMentorship, singleMentorship, updateMentorship } from "../../../services/mentorshipService";
import { allTopics } from "../../../services/topicService";
import { addDiscussion, allDiscussions, blockUnblockDiscussion, singleDiscussion, updateDiscussion } from "../../../services/discussionService";
import { addDiscussionReply, allDiscussionReplies } from "../../../services/discussionReplyService";


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
export default function AlumniManageDiscussions() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [topicId, setTopicId] = useState("");
    const [userId, setUserId] = useState("");


    const [modalIsOpen, setIsOpen] = useState(false);
    const [formType, setFormType] = useState("");
    const [_id, setId] = useState("");

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);

    const [search, setSearch] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const [mentorships, setMentorships] = useState([]);
    const [topics, setTopics] = useState([]);

    // Reply Modal states
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [selectedDiscussionForReply, setSelectedDiscussionForReply] = useState(null);
    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState("");
    const [replyLoading, setReplyLoading] = useState(false);

    const openModal = (_id, type) => {
        setIsOpen(true);
        setFormType(type);
        getAllTopics()
        setId(_id);
        if (type === "update") {
            singleDiscussion({ _id: _id }).then((res) => {
                if (res.data.success) {
                    setLoading(false);
                    setTitle(res.data.data.title);
                    setDescription(res.data.data.description);
                    setTopicId(res.data.data.topicId || "");

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
        getAllDiscussions();
        setTitle("");
        setDescription("");
        setTopicId("");

    }
    useEffect(() => {
        getAllDiscussions();
    }, [page]);


    const getAllTopics = () => {
        setLoading(true);
        let payload = {
            isBlocked: false,
            isDeleted: false,
        }
        allTopics(payload).then((res) => {
            if (res.data.success) {
                setLoading(false);
                setTopics(res.data.data);
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

    const getAllDiscussions = () => {
        setLoading(true);
        let payload = {
            userId: localStorage.getItem("_id"),
            limit: limit,
            startPoint: (page - 1) * limit
        }
        if (search && search !== "") {
            payload.search = search.trim();
        }
        allDiscussions(payload).then((res) => {
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

        getAllDiscussions();
    }

    const toggleMentorshipStatus = (_id, isBlocked) => {
        setLoading(true);
        blockUnblockDiscussion({ _id: _id, isBlocked: isBlocked })
            .then((res) => {
                if (res.data.success) {
                    setLoading(false);
                    toast.success(res.data.message);
                    getAllDiscussions();
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
            title: title,
            description: description,
            topicId: topicId,
            userId: localStorage.getItem("_id"),
        }
        if (formType === "update") {
            payload._id = _id;
            updateDiscussion(payload).then((res) => {
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
            addDiscussion(payload).then((res) => {
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

    const openReplyModal = (discussion) => {
        setSelectedDiscussionForReply(discussion);
        setIsReplyModalOpen(true);
        getReplies(discussion._id);
    };

    const closeReplyModal = () => {
        setIsReplyModalOpen(false);
        setSelectedDiscussionForReply(null);
        setReplies([]);
        setNewReply("");
    };

    const getReplies = (discussionId) => {
        setReplyLoading(true);
        allDiscussionReplies({ discussionId, status: true, isBlocked: false, isDeleted: false }).then((res) => {
            setReplyLoading(false);
            if (res.data.success) {
                setReplies(res.data.data);
            }
        }).catch((err) => {
            setReplyLoading(false);
            console.log(err);
        });
    };

    const handleReplySubmit = (e) => {
        e.preventDefault();
        const userId = localStorage.getItem("_id");
        if (!userId) {
            toast.error("Please login to post a reply.");
            return;
        }
        if (!newReply.trim()) {
            toast.error("Reply cannot be empty.");
            return;
        }

        setReplyLoading(true);
        const payload = {
            discussionId: selectedDiscussionForReply._id,
            userId,
            message: newReply.trim()
        };

        addDiscussionReply(payload).then((res) => {
            setReplyLoading(false);
            if (res.data.success) {
                toast.success(res.data.message);
                setNewReply("");
                getReplies(selectedDiscussionForReply._id);
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            setReplyLoading(false);
            toast.error(err.response?.data?.message || err.message);
        });
    };

    const getRoleBadge = (userType) => {
        switch (userType) {
            case 1:
                return <span className="badge bg-danger ms-2">Admin</span>;
            case 2:
                return <span className="badge bg-success ms-2">Alumni</span>;
            case 3:
                return <span className="badge bg-info ms-2 text-dark">Student</span>;
            default:
                return null;
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
                                Discussions List
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
                                            Discussions
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
                                        placeholder="Search Discussions..."
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
                                    + Create Discussion
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
                                <th>Topic</th>
                                <th>Status</th>
                                <th className="text-center">Action</th>
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
                                            <td>{mentorship.topicId !== null ? mentorship.topicId.name : "-"}</td>

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
                                                        onClick={() => openReplyModal(mentorship)}
                                                        className="btn btn-lg text-info"
                                                        title="View & Reply"
                                                    >
                                                        <i className="bi bi-chat-left-dots"></i>
                                                    </Link>
                                                    <Link
                                                        onClick={() => openModal(mentorship._id, "update")}
                                                        className="btn btn-lg text-primary"
                                                        title="Edit"
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
                                {formType === "add" ? "Add Discussion" : "Update Discussion"}
                            </h6>
                        </div>

                        <div className="row g-4">
                            <div className="col-lg-12">
                                <form onSubmit={submit}>
                                    <div className="row">

                                        {/* Title */}
                                        <div className="col-md-6">
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
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <select
                                                    className="form-control"
                                                    id="title"
                                                    value={topicId}
                                                    placeholder="Title"
                                                    onChange={(e) => setTopicId(e.target.value)}
                                                >
                                                    <option value={null} selected >
                                                        Select Topic
                                                    </option>
                                                    {
                                                        topics.map((topic) => (
                                                            <option value={topic._id}>{topic.name}</option>
                                                        ))
                                                    }
                                                </select>
                                                <label htmlFor="title">Topic (Optional)</label>
                                            </div>
                                        </div>

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
            
            <ReactModal
                isOpen={isReplyModalOpen}
                onRequestClose={closeReplyModal}
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
                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3">
                        <h5 className="mb-0 text-white">Discussion Thread</h5>
                        <button onClick={closeReplyModal} className="btn-close btn-close-white shadow-none"></button>
                    </div>
                    <div className="card-body p-4" style={{ overflowY: 'auto', maxHeight: 'calc(90vh - 130px)' }}>
                        {selectedDiscussionForReply && (
                            <>
                                <div className="mb-4">
                                    <h4 className="text-primary">{selectedDiscussionForReply.title}</h4>
                                    <div className="d-flex align-items-center mb-2">
                                        <small className="text-muted">Created by: </small>
                                        <span className="fw-bold ms-1 text-dark">{selectedDiscussionForReply.userId?.name}</span>
                                        {getRoleBadge(selectedDiscussionForReply.userId?.userType)}
                                    </div>
                                    <p className="text-muted">{selectedDiscussionForReply.description}</p>
                                    <hr />
                                </div>

                                <div className="replies-section mb-4">
                                    <h6 className="mb-3"><i className="bi bi-chat-left-text me-2"></i>All Replies</h6>
                                    {replyLoading && replies.length === 0 ? (
                                        <div className="text-center py-3">
                                            <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                                        </div>
                                    ) : replies.length > 0 ? (
                                        <div className="reply-list">
                                            {replies.map((reply, idx) => (
                                                <div key={idx} className="bg-light p-3 rounded mb-3 border-start border-primary border-4 shadow-sm">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <div className="d-flex align-items-center">
                                                            <span className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>
                                                                {reply.userId?.name || "User"}
                                                            </span>
                                                            {getRoleBadge(reply.userId?.userType)}
                                                        </div>
                                                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                                                            <i className="bi bi-clock me-1"></i>
                                                            {new Date(reply.createdAt).toLocaleDateString("en-GB", {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                            })}
                                                        </span>
                                                    </div>
                                                    <p className="mb-0 text-dark" style={{ lineHeight: '1.5' }}>{reply.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted small text-center italic">No replies found for this discussion.</p>
                                    )}
                                </div>

                                <form onSubmit={handleReplySubmit} className="mt-auto">
                                    <div className="form-group mb-3">
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Write your response as an Alumni..."
                                            value={newReply}
                                            onChange={(e) => setNewReply(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary px-4 rounded-pill"
                                            disabled={replyLoading}
                                        >
                                            {replyLoading ? 'Posting...' : 'Post Reply'}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </ReactModal>


        </>
    )
}


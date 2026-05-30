import { Link } from "react-router-dom";
import { allTopics } from "../../../services/topicService";
import { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import { getDiscussionByTopic } from "../../../services/discussionService";
import ReactModal from "react-modal";
import { addDiscussionReply, allDiscussionReplies } from "../../../services/discussionReplyService";

export default function ViewAlumniTopics() {
    const [search, setSearch] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [topics, setTopics] = useState([]);
    const [discussions, setDiscussions] = useState([]);
    const [discussionLoading, setDiscussionLoading] = useState(false);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDiscussion, setSelectedDiscussion] = useState(null);
    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState("");
    const [replyLoading, setReplyLoading] = useState(false);

    useEffect(() => {
        getAllTopics();
    }, []);

    const getAllTopics = () => {
        setLoading(true);
        let payload = {}
        if (search && search !== "") {
            payload.search = search.trim();
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
    const hitSearch = () => {
        getAllTopics();
    }
    const openModal = (topic) => {
        setSelectedDiscussion(null); // reset
        setReplies([]);
        setIsModalOpen(true);

        getDiscussions(topic._id);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDiscussion(null);
        setReplies([]);
        setNewReply("");
    };

    const getDiscussions = (topicId) => {
        setDiscussionLoading(true);

        //  Replace with your API
        getDiscussionByTopic({ topicId })
            .then((res) => {
                setDiscussionLoading(false);
                if (res.data.success) {
                    setDiscussions(res.data.data);
                }
            })
            .catch((err) => {
                setDiscussionLoading(false);
                console.log(err);
                toast.error("Failed to load discussions");
            });
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
            discussionId: selectedDiscussion._id,
            userId: userId,
            message: newReply.trim()
        };

        addDiscussionReply(payload).then((res) => {
            setReplyLoading(false);
            if (res.data.success) {
                toast.success(res.data.message);
                setNewReply("");
                getReplies(selectedDiscussion._id);
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
                    zIndex: 9999
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
                                Topics List
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
                                            Topics
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
                    <div className="row my-2 align-items-center">
                        <div className="col-md-6">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault(); // prevents page reload
                                    hitSearch();
                                }}
                            >
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search topics..."
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
                    <div className="row">
                        {topics.length > 0 ? (
                            topics.map((topic, index) => (
                                <div key={topic._id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                                    <div className="card h-100 shadow-sm border-0">
                                        <div className="card-body">
                                            <h5 className="card-title fw-bold">
                                                {topic.name}
                                            </h5>
                                            <p className="text-muted mb-2" style={{ fontSize: "14px" }}>
                                                Created on:   {new Date(topic.createdAt).toLocaleDateString("en-GB", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </p>
                                            <span className="badge bg-success">Active</span>
                                        </div>
                                        <div className="card-footer bg-white border-0 d-flex justify-content-between">
                                            <button className="btn btn-sm btn-outline-primary"
                                                onClick={() => openModal(topic)}>
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center">
                                <p>No topics found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ReactModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        zIndex: 1000
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
                        <h5 className="mb-0 text-white">Discussion Details</h5>
                        <button onClick={closeModal} className="btn-close btn-close-white shadow-none"></button>
                    </div>
                    <div className="card-body p-4" style={{ overflowY: 'auto', maxHeight: 'calc(80vh - 130px)' }}>
                        {discussionLoading ? (
                            <p className="text-center">Loading discussions...</p>
                        ) : discussions.length > 0 ? (
                            discussions.map((d) => (
                                <div key={d._id} className="mb-4 border-bottom pb-3">

                                    <h5 className="text-primary">{d.title}</h5>

                                    <div className="d-flex align-items-center mb-2">
                                        <small className="text-muted">Created by:</small>
                                        <span className="fw-bold ms-1">{d.userId?.name}</span>
                                        {getRoleBadge(d.userId?.userType)}
                                    </div>

                                    <p className="text-muted">{d.description}</p>

                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => {
                                            setSelectedDiscussion(d);
                                            getReplies(d._id);
                                        }}
                                    >
                                        View Replies
                                    </button>

                                    {/* Replies */}
                                    {selectedDiscussion && (
                                        <>
                                            <div className="replies-section mb-4">
                                                <h6 className="mb-3"><i className="bi bi-chat-left-text me-2"></i>Replies</h6>
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
                                                    <p className="text-muted small text-center italic">No replies yet. Be the first to join the conversation!</p>
                                                )}
                                            </div>

                                            <form onSubmit={handleReplySubmit} className="mt-auto">
                                                <div className="form-group mb-3">
                                                    <textarea
                                                        className="form-control"
                                                        rows="3"
                                                        placeholder="Write your reply here..."
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
                            ))
                        ) : (
                            <p className="text-center">No discussions found</p>
                        )}
                    </div>
                </div>
            </ReactModal>
        </>
    )
}


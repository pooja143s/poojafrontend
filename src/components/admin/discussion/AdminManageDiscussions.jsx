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
export default function AdminManageDiscussions() {

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
                    
                    </div>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Topic</th>
                                <th className="text-center">Status</th>
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


        </>
    )
}


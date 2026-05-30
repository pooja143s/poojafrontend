import { Link } from "react-router-dom";
import { addTopic, allTopics, blockUnblockTopic, singleTopic, updateTopic } from "../../../services/topicService";
import { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import Switch from "react-switch";
import { toast } from "react-toastify";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';
import ReactModal from "react-modal";

const modalStyle = {
    content: {
        width: '30%',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

export default function ManageTopics() {
    const [name, setName] = useState('')

    const [modalIsOpen, setIsOpen] = useState(false);
    const [formType, setFormType] = useState("");
    const [_id, setId] = useState("");

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);

    const [search, setSearch] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const [topics, setTopics] = useState([]);

    const openModal = (_id, type) => {
        setIsOpen(true);
        setFormType(type);
        setId(_id);
        if (type === "update") {
            singleTopic({ _id: _id }).then((res) => {
                if (res.data.success) {
                    setLoading(false);
                    setName(res.data.data.name);
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
        setName("");

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
        allTopics(payload).then((res) => {
            if (res.data.success) {
                setLoading(false);
                setTopics(res.data.data);
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

    const toggleTopicStatus = (_id, isBlocked) => {
        setLoading(true);
        blockUnblockTopic({ _id: _id, isBlocked: isBlocked })
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
            name: name,
        }
        if (formType === "update") {
            payload._id = _id;
            updateTopic(payload).then((res) => {
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
            addTopic(payload).then((res) => {
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
                                            users
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
                        <div className="col-md-6 text-md-end text-start">
                            <Link onClick={() => openModal(null, "add")}>
                                <button className="btn btn-primary rounded-pill">
                                    + Add New Topic
                                </button>
                            </Link>
                        </div>

                    </div>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">CreatedAt</th>
                                <th scope="col" className="text-center">Status</th>
                                <th scope="col" className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                topics.length > 0 ? (
                                    topics.map((topic, index) => (
                                        <tr>
                                            <th scope="row">{index + 1}</th>
                                            <td>{topic.name}</td>
                                            <td>
                                                {new Date(topic.createdAt).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}

                                            </td>
                                            <td className="text-center">
                                                <Switch checked={!topic.isBlocked} onColor="#2BC5D4" onChange={() => toggleTopicStatus(topic._id, !topic.isBlocked)} height={24} />
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex justify-content-center align-items-center gap-2">

                                                    <Link onClick={() => openModal(topic._id, "update")} className="btn btn-lg text-primary">
                                                        <i className="bi bi-pencil-square"></i>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No topics found.
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

            {/* Team End */}




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
                                {formType === "add" ? "Add Topic" : "Update Topic"}
                            </h6>
                        </div>

                        <div className="row g-4">
                            <div className="col-lg-12">
                                <form onSubmit={submit}>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-floating">
                                                <input
                                                    required
                                                    type="text"
                                                    className="form-control"
                                                    id="name" value={name}
                                                    placeholder="Topic  Name"
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                                <label htmlFor="name">Topic Name</label>
                                            </div>
                                        </div>

                                        <div className="row my-2">
                                            <div className="col-md">
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <button type="button" className="btn btn-md btn-danger" onClick={closeModal}>
                                                        Cancel
                                                    </button>
                                                    <button className="btn btn-md btn-primary" type="submit" disabled={loading} >
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


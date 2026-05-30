import { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import Switch from "react-switch";
import { toast } from "react-toastify";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';
import ReactModal from "react-modal";
import { blockUnblockDiscussion } from "../../../services/discussionService";
import { allAlumnis, blockUnblockAlumni } from "../../../services/userService";

export default function ManageAlumins() {

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);

    const [search, setSearch] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const [alumnis, setAlumnis] = useState([]);

    useEffect(() => {
        getAllAlumnis();
    }, [page]);

    const getAllAlumnis = () => {
        setLoading(true);
        let payload = {
            limit: limit,
            startPoint: (page - 1) * limit
        }
        if (search && search !== "") {
            payload.search = search.trim();
        }
        allAlumnis(payload).then((res) => {
            if (res.data.success) {
                setLoading(false);
                setAlumnis(res.data.data);
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
                                        placeholder="Search Alumni..."
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
                    <table className="table table-bordered  align-middle">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Profile</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Current Job</th>
                                <th>Company</th>
                                <th>Expertise</th>
                                <th>Graduation Year</th>
                                <th>Gender</th>
                                <th>Bio</th>
                                <th className="text-center">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                alumnis.length > 0 ? (
                                    alumnis.map((alumni, index) => (
                                        
                                        <tr key={alumni._id}>
                                            <td>{index + 1}</td>

                                            {/* Profile Image */}
                                            <td>
                                                <img
                                                    src={alumni.profileImage}
                                                    alt="profile"
                                                    style={{
                                                        height: "60px",
                                                        width: "60px",
                                                        borderRadius: "50%",
                                                        objectFit: "cover"
                                                    }}
                                                />
                                            </td>

                                            {/* Basic Info */}
                                            <td>{alumni.name}</td>
                                            <td>{alumni.email}</td>
                                            <td>{alumni.phone}</td>

                                            {/* Professional Info */}
                                            <td>{alumni.currentJob || "N/A"}</td>
                                            <td>{alumni.company || "N/A"}</td>

                                            {/* Expertise */}
                                            <td>
                                                {
                                                    alumni.expertise?.length > 0
                                                        ? alumni.expertise.join(", ")
                                                        : "Not provided"
                                                }
                                            </td>

                                            {/* Academic */}
                                            <td>{alumni.graduationYear || "N/A"}</td>

                                            {/* Personal */}
                                            <td>{alumni.gender || "N/A"}</td>
                                            <td>{alumni.bio || "Not Updated"}</td>

                                            {/* Status */}
                                            <td className="text-center">
                                                <Switch
                                                    checked={!alumni.isBlocked}
                                                    onColor="#2BC5D4"
                                                    onChange={() =>
                                                        alumniBlockUnblock(alumni._id, !alumni.isBlocked)
                                                    }
                                                    height={24}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="12" className="text-center">
                                            No Alumnis found.
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


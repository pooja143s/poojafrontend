import { useEffect, useState } from "react";
import { alumniProfile, StudentChangePassword, studentProfile, UpdateStudentProfile } from "../../services/userService";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import ReactModal from "react-modal";
import { allTopics, userTopicAdd } from "../../services/topicService";
import Select from "react-select";


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

export default function StudentProfile() {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState("");

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [bio, setBio] = useState("");
    const [educationLevel, setEducationLevel] = useState("")
    const [graduationYear, setGraduationYear] = useState("");
    const [currentJob, setCurrentJob] = useState("");
    const [company, setCompany] = useState("");
    const [experience, setExperience] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [modalType, setModalType] = useState(""); // "edit" | "password"
    const [modalOpen, setModalOpen] = useState(false);
    const [topicOptions, setTopicOptions] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);

    // password states
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // interest state
    const [interest, setInterest] = useState("")

    const openModal = (type) => {
        setModalType(type);
        setModalOpen(true);

        if (type === "interest") {
            getTopicOptions();
        }
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = () => {
        setLoading(true);
        let payload = {
            _id: localStorage.getItem("studentId"),
        }
        studentProfile(payload).then((res) => {
            if (res.data.success) {
                setLoading(false);
                setProfile(res.data.data);
                setName(res.data.data.name);
                setPhone(res.data.data.phone);
                setProfileImage(res.data.data.profileImage);
                setBio(res.data.data.bio);
                setGraduationYear(res.data.data.graduationYear);
                setCurrentJob(res.data.data.currentJob);
                setCompany(res.data.data.company);
                setExperience(res.data.data.experience);
                setGender(res.data.data.gender);
                setAddress(res.data.data.address);

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

    const getTopicOptions = () => {
        allTopics({})
            .then((res) => {
                if (res.data.success) {
                    const options = res.data.data.map((t) => ({
                        value: t._id,
                        label: t.name
                    }));
                    setTopicOptions(options);
                }
            })
            .catch((err) => {
                console.log(err);
                toast.error("Failed to load topics");
            });
    };

    const updateProfile = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("_id", localStorage.getItem("studentId"));
        formData.append("name", name);
        formData.append("phone", phone);
        formData.append("gender", gender);
        formData.append("address", address);
        formData.append("bio", bio);
        formData.append("educationLevel", educationLevel);

        if (profileImage instanceof File) {
            formData.append("profileImage", profileImage);
        }

        setLoading(true);

        //  CALL YOUR UPDATE API HERE
        UpdateStudentProfile(formData)
            .then((res) => {
                setLoading(false);
                if (res.data.success) {
                    toast.success(res.data.message);
                    getProfile();
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
                                Profile
                            </h1>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb justify-content-center">
                                    <li className="breadcrumb-item">
                                        <a className="text-white" href="#">
                                            Home
                                        </a>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <a className="text-white" href="#">
                                            Pages
                                        </a>
                                    </li>
                                    <li
                                        className="breadcrumb-item text-white active"
                                        aria-current="page"
                                    >
                                        Profile
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            {/* Header End */}
            <section>
                <div className="container py-5">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="card mb-4">
                                <div className="card-body text-center">
                                    <img
                                        src={profile.profileImage}
                                        alt="avatar"
                                        className="rounded-circle img-fluid"
                                        style={{ width: 150, height: 150, objectFit: "cover" }}
                                    />
                                    <h5 className="my-3">{profile.name}</h5>
                                    <p className="text-muted mb-1">{profile.currentJob}</p>

                                    <div className="d-flex justify-content-center mb-2">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => openModal("password")}
                                        >
                                            Change Password
                                        </button>

                                        <button
                                            className="btn btn-outline-primary ms-1"
                                            onClick={() => openModal("edit")}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-lg-8">
                            <div className="card mb-4">
                                <div className="card-body">
                                    {/* Full Name */}
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Full Name</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{profile.name}</p>
                                        </div>
                                    </div>
                                    <hr />

                                    {/* Email */}
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Email</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{profile.email}</p>
                                        </div>
                                    </div>
                                    <hr />

                                    {/* Phone */}
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Phone</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{profile.phone}</p>
                                        </div>
                                    </div>
                                    <hr />



                                    {/* Graduation Year */}
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Education Level</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{profile.educationLevel || "Not provided"}</p>
                                        </div>
                                    </div>
                                    <hr />

                                    {/* Bio */}
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Bio</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{profile.bio || "Not provided"}</p>
                                        </div>
                                    </div>
                                    <hr />

                                    {/* Gender */}
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Gender</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{profile.gender}</p>
                                        </div>
                                    </div>
                                    <hr />
                                    {/* Address */}
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Address</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{profile.address}</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <button
                                className="btn btn-primary"
                                onClick={() => openModal("interest")}
                            >
                                Add Interest
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <ReactModal
                isOpen={modalOpen}
                onRequestClose={closeModal}
                style={modalStyle}
            >
                <div className="container-xxl ">
                    <div className="container">
                        <div className="text-center">

                            {/* TITLE */}
                            <h6 className="section-title bg-white text-center text-primary px-3">
                                {modalType === "edit" ? "Update Profile" : modalType === "password" ? "Change Password" : "Add Interest"}
                            </h6>
                        </div>
                    </div>

                    {/* ================= UPDATE PROFILE ================= */}
                    {modalType === "edit" && (
                        <form onSubmit={updateProfile}>
                            <div className="row g-3">

                                <div className="col-md-6">
                                    <input className="form-control" value={name}
                                        onChange={(e) => setName(e.target.value)} placeholder="Name" />
                                </div>

                                <div className="col-md-6">
                                    <input className="form-control" value={phone}
                                        onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
                                </div>

                                <div className="col-md-6">
                                    <select className="form-control" value={gender}
                                        onChange={(e) => setGender(e.target.value)}>
                                        <option value="">Select Gender</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <select className="form-control" value={educationLevel}
                                        onChange={(e) => setEducationLevel(e.target.value)}>
                                        <option value="">Select Education</option>
                                        <option>High School</option>
                                        <option>Diploma</option>
                                        <option>Bachelor's</option>
                                        <option>Master's</option>
                                        <option>PhD</option>
                                    </select>
                                </div>

                                <div className="col-md-12">
                                    <textarea className="form-control" value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Address" />
                                </div>

                                <div className="col-md-12">
                                    <textarea className="form-control" value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Bio" />
                                </div>

                                <div className="col-md-12">
                                    <input type="file" className="form-control"
                                        onChange={(e) => setProfileImage(e.target.files[0])} />
                                </div>

                            </div>

                            <div className="d-flex justify-content-end mt-3 gap-2">
                                <button type="button" className="btn btn-danger" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary">Update</button>
                            </div>
                        </form>
                    )}

                    {/* ================= CHANGE PASSWORD ================= */}
                    {modalType === "password" && (
                        <form onSubmit={async (e) => {
                            e.preventDefault();

                            if (newPassword !== confirmPassword) {
                                return toast.error("Passwords do not match");
                            }

                            try {
                                setLoading(true);

                                const payload = {
                                    _id: localStorage.getItem("_id"),
                                    oldPassword,
                                    newPassword
                                };

                                //  CALL YOUR API
                                const res = await StudentChangePassword(payload);

                                if (res.data.success) {
                                    toast.success(res.data.message);

                                    setOldPassword("");
                                    setNewPassword("");
                                    setConfirmPassword("");

                                    closeModal();
                                } else {
                                    toast.error(res.data.message);
                                }

                            } catch (err) {
                                toast.error(err.response?.data?.message || "Password change failed");
                            } finally {
                                setLoading(false);
                            }
                        }}>

                            <div className="row g-3">

                                <div className="col-md-12">
                                    <input type="password" className="form-control"
                                        placeholder="Old Password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)} />
                                </div>

                                <div className="col-md-12">
                                    <input type="password" className="form-control"
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)} />
                                </div>

                                <div className="col-md-12">
                                    <input type="password" className="form-control"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)} />
                                </div>

                            </div>

                            <div className="d-flex justify-content-end mt-3 gap-2">
                                <button type="button" className="btn btn-danger" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary">Change Password</button>
                            </div>

                        </form>
                    )}

                    {/* ================= ADD INTEREST ================= */}
                    {modalType === "interest" && (
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                setLoading(true);

                                const payload = {
                                    // userId: localStorage.getItem("_id"),
                                    userId: localStorage.getItem("_id"),
                                    topics: selectedTopics.map(t => t.value)
                                };

                                //  CALL YOUR API
                                const res = await userTopicAdd(payload);

                                if (res.data.success) {
                                    toast.success(res.data.message);

                                    setInterest("")

                                    closeModal();
                                } else {
                                    toast.error(res.data.message);
                                }

                            } catch (err) {
                                toast.error(err.response?.data?.message || "Failed to Add Interest ");
                            } finally {
                                setLoading(false);
                            }
                        }}>

                            <div className="row g-3">

                                <div className="col-md-12">
                                    <Select
                                        options={topicOptions}
                                        isMulti
                                        value={selectedTopics}
                                        onChange={(selected) => setSelectedTopics(selected)}
                                        placeholder="Select interests..."
                                    />
                                </div>

                            </div>

                            <div className="d-flex justify-content-end mt-3 gap-2">
                                <button type="button" className="btn btn-danger" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary">Add Interest</button>
                            </div>

                        </form>
                    )}
                </div>
            </ReactModal>

        </>
    )
}


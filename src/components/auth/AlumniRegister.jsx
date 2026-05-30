import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import { alumniRegister } from "../../services/userService";
import { PuffLoader } from "react-spinners";

export default function AlumniRegister() {

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [gender, setGender] = useState('')
    const [graduationYear, setGraduationYear] = useState("");
    const [currentJob, setCurrentJob] = useState('')
    const [company, setCompany] = useState('')
    const [experience, setExperience] = useState('')
    const [expertise, setExpertise] = useState([''])
    const [bio, setBio] = useState("");
    const [image, setImage] = useState(null);

    const [submitted, setSubmitted] = useState(false);

    const [touched, setTouched] = useState({
        name: false,
        email: false,
        phone: false,
        gender: false,
        graduationYear: false,
        password: false,
        currentJob: false,
        company: false,
        experience: false,
        expertise: false,
    });

    const addExpertise = () => setExpertise([...expertise, '']);
    const removeExpertise = (index) => setExpertise(expertise.filter((_, i) => i !== index));
    const handleExpertiseChange = (index, value) => {
        const newExpertise = [...expertise];
        newExpertise[index] = value;
        setExpertise(newExpertise);
    };

    const nav = useNavigate()
    const submit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setLoading(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("password", password);
        formData.append("gender", gender);
        formData.append("bio", bio);
        formData.append("graduationYear", graduationYear);
        formData.append("currentJob", currentJob);
        formData.append("company", company);
        formData.append("experience", experience);
        expertise.forEach(item => {
            if (item.trim() !== "") {
                formData.append("expertise[]", item);
            }
        });
        if (image) {
            formData.append("image", image);
        }
        alumniRegister(formData)
            .then((res) => {
                if (res.data.success) {
                    setLoading(false);
                    toast.success(res.data.message);
                    nav("/login");
                } else {
                    setLoading(false);
                    toast.error(res.data.message);
                }
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
                toast.error("Something went wrong");
            });
    };
    return (
        <>
            {/* Header Start */}
            <div className="container-fluid bg-primary  page-header">
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 text-center">
                            <h1 className="display-3 text-white animated slideInDown">Register</h1>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb justify-content-center">
                                    <li className="breadcrumb-item">
                                        <a className="text-white" href="#">
                                            Home
                                        </a>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <a className="text-white" href="#">
                                            Register
                                        </a>
                                    </li>

                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            {/* Header End */}
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                        <h6 className="section-title bg-white text-center text-primary px-3">
                            Register as Alumni
                        </h6>

                    </div>

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

                    <div>
                        <div className="row g-4 justify-content-center">
                            <div className="col-lg-10">
                                <form onSubmit={submit}>
                                    <div className="row g-3 mb-3">
                                        <div className="col-md-4">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={name}
                                                    placeholder="Enter full name"
                                                    onChange={(e) => setName(e.target.value)}
                                                    onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                                                />
                                                <label>Full Name</label>
                                                {(submitted || touched.name) && name === '' ? <small className="text-danger">Name is required</small> : null}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-floating">
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={email}
                                                    placeholder="Enter email"
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                                                />
                                                <label>Email</label>
                                                {(submitted || touched.email) && email === '' ? <small className="text-danger">Email is required</small> : null}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-floating">
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    value={phone}
                                                    placeholder="Enter phone"
                                                    maxLength={10}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
                                                />
                                                <label>Phone</label>
                                                {(submitted || touched.phone) && phone.length !== 10 ? <small className="text-danger">Phone must be 10 digits</small> : null}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-4">
                                            <div className="form-floating">
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    value={password}
                                                    placeholder="Create password"
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                                                />
                                                <label>Password</label>
                                                {(submitted || touched.password) && password === '' ? <small className="text-danger">Password is required</small> : null}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-floating">
                                                <select
                                                    className="form-control"
                                                    value={gender}
                                                    onChange={(e) => setGender(e.target.value)}
                                                    onBlur={() => setTouched(prev => ({ ...prev, gender: true }))}
                                                >
                                                    <option value="">Select gender</option>
                                                    <option>Male</option>
                                                    <option>Female</option>
                                                    <option>Other</option>
                                                </select>
                                                <label>Gender</label>
                                                {(submitted || touched.gender) && gender === '' ? <small className="text-danger">Gender is required</small> : null}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-floating">
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={graduationYear}
                                                    placeholder="Graduation Year"
                                                    onChange={(e) => setGraduationYear(e.target.value)}
                                                    onBlur={() => setTouched(prev => ({ ...prev, graduationYear: true }))}
                                                />
                                                <label>Graduation Year</label>
                                                {(submitted || touched.graduationYear) && graduationYear === '' ? <small className="text-danger">Graduation year is required</small> : null}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-4">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={currentJob}
                                                    placeholder="Current Job Title"
                                                    onChange={(e) => setCurrentJob(e.target.value)}
                                                    onBlur={() => setTouched(prev => ({ ...prev, currentJob: true }))}
                                                />
                                                <label>Current Job Title</label>
                                                {(submitted || touched.currentJob) && currentJob === '' ? <small className="text-danger">Job title is required</small> : null}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={company}
                                                    placeholder="Company Name"
                                                    onChange={(e) => setCompany(e.target.value)}
                                                    onBlur={() => setTouched(prev => ({ ...prev, company: true }))}
                                                />
                                                <label>Company/Organization</label>
                                                {(submitted || touched.company) && company === '' ? <small className="text-danger">Company is required</small> : null}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={experience}
                                                    placeholder="Experience"
                                                    onChange={(e) => setExperience(e.target.value)}
                                                    onBlur={() => setTouched(prev => ({ ...prev, experience: true }))}
                                                />
                                                <label>Experience</label>
                                                {(submitted || touched.experience) && experience === '' ? <small className="text-danger">Experience is required</small> : null}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-12">
                                            <label className="form-label fw-bold">Profile Image</label>
                                            <input
                                                type="file"
                                                className="form-control py-2"
                                                onChange={(e) => setImage(e.target.files[0])}
                                                onBlur={() => setTouched(prev => ({ ...prev, image: true }))}
                                            />
                                            {(submitted || touched.image) && image === null ? <small className="text-danger">Profile image is required</small> : null}
                                        </div>
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <div className="form-floating h-100">
                                                <textarea
                                                    className="form-control h-100"
                                                    style={{ minHeight: "100px" }}
                                                    placeholder="Write bio"
                                                    value={bio}
                                                    onChange={(e) => setBio(e.target.value)}
                                                ></textarea>
                                                <label>Bio (Optional)</label>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className=" p-3 rounded border">
                                                <label className="form-label fw-bold mb-2">Field of Expertise</label>
                                                {expertise.map((item, index) => (
                                                    <div key={index} className="expert-input-group mb-2">
                                                        <div className="form-floating position-relative">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={item}
                                                                placeholder={`Expertise ${index + 1}`}
                                                                onChange={(e) => handleExpertiseChange(index, e.target.value)}
                                                                onBlur={() => setTouched(prev => ({ ...prev, expertise: true }))}
                                                            />
                                                            <label>Expertise {index + 1}</label>
                                                            {index > 0 && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-danger position-absolute top-50 end-0 translate-middle-y me-2"
                                                                    style={{ zIndex: 5 }}
                                                                    onClick={() => removeExpertise(index)}
                                                                >
                                                                    <i className="fa fa-times" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="text-start mt-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={addExpertise}
                                                    >
                                                        <i className="fa fa-plus me-1" /> Add More
                                                    </button>
                                                </div>
                                                {(submitted || touched.expertise) && expertise.every(e => e.trim() === '') ? (
                                                    <small className="text-danger d-block mt-2">At least one expertise is required</small>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Submit */}
                                    <div className="row mt-4">
                                        <div className="col-12">
                                            <button className="btn btn-primary w-100 py-3">
                                                Register
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>


            </div>


        </>
    )
}
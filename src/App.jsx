import "./assets/style.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import AdminLayout from "./components/layout/adminLayout/AdminLayout"
import Home from "./components/customer/Home"
import About from "./components/customer/About"
import Dashboard from "./components/admin/Dashboard"
import ManageUsers from "./components/admin/users/ManageUsers"
import Login from "./components/auth/Login"
import AddUser from "./components/admin/users/AddUser"
import { ToastContainer } from "react-toastify"
import StudentLayout from "./components/layout/studentLayout/StudentLayout"
import AlumniRegister from "./components/auth/AlumniRegister"
import StudentRegister from "./components/auth/StudentRegister"
import ManageTopics from "./components/admin/topic/ManageTopics"
import AlumniDashboard from "./components/alumni/AlumniDashboard"
import AlumniLayout from "./components/layout/alumiLayout/AlumniLayout"
import ViewAlumniTopics from "./components/alumni/topic/ViewAlumniTopics"
import ManageMentorShip from "./components/alumni/mentorship/ManageMentorShip"
import AlumniManageDiscussions from "./components/alumni/discussion/AlumniManageDiscussions"
import ManageLiveSessions from "./components/alumni/liveSession/ManageLiveSessions"
import AlumniProfile from "./components/alumni/AlumniProfile"
import AdminManageMentorShip from "./components/admin/mentorship/AdminManageMentorShip"
import AdminManageDiscussions from "./components/admin/discussion/AdminManageDiscussions"
import AdminManageLiveSessions from "./components/admin/liveSession/AdminManageLiveSessions"
import ManageAlumins from "./components/admin/alumni/ManageAlumins"
import ManageStudents from "./components/admin/student/ManageStudents"
import ViewAlumnis from "./components/student/alumni/ViewAlumnis"
import ViewMentorShip from "./components/student/mentorship/ViewMentorShip"
import ViewDiscussions from "./components/student/discussion/ViewDiscussions"
import ViewLiveSessions from "./components/student/liveSession/ViewLiveSessions"
import StudentProfile from "./components/student/StudentProfile"
import Contact from "./components/student/pages/Contact"
import ViewEnrollmentHistory from "./components/student/enrollment/ViewEnrollmentHistory"
import AlumniManageEnrollments from "./components/alumni/enrollments/ManageEnrollments"
import ViewStudentTopics from "./components/student/topics/ViewStudentTopics"
import AdminAllEnrollments from "./components/admin/enrollments/AdminViewEnrollments"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* .........Customer Routes .........................*/}
          <Route path="/" element={<StudentLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/alumni/register" element={<AlumniRegister />} />
            <Route path="/student/register" element={<StudentRegister />} />
            <Route path="/alumnis" element={<ViewAlumnis />} />
            <Route path="/mentorships/:alumniId" element={<ViewMentorShip />} />
            <Route path="/discussions" element={<ViewDiscussions />} />
            <Route path="/liveSessions" element={<ViewLiveSessions />} />
            <Route path="/profile" element={<StudentProfile />} />
            <Route path="/enrollment/history" element={<ViewEnrollmentHistory />} />
            <Route path="/topics" element={<ViewStudentTopics />} />
          </Route>

          {/* ...........Alumni Routes............................. */}
          <Route path="/alumni" element={<AlumniLayout />}>
            <Route path="/alumni/dashboard" element={<AlumniDashboard />} />
            <Route path="/alumni/topics" element={<ViewAlumniTopics />} />
            <Route path="/alumni/mentorship" element={<ManageMentorShip />} />
            <Route path="/alumni/discussions" element={<AlumniManageDiscussions />} />
            <Route path="/alumni/liveSessions" element={<ManageLiveSessions />} />
            <Route path="/alumni/profile" element={<AlumniProfile />} />
            <Route path="/alumni/enrollments" element={<AlumniManageEnrollments />} />
          </Route>

          {/* ...........Admin Routes............................. */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/users/manage" element={<ManageUsers />} />
            <Route path="/admin/user/add" element={<AddUser />} />
            <Route path="/admin/topics/manage" element={<ManageTopics />} />
            <Route path="/admin/alumni/manage" element={<ManageAlumins />} />
            <Route path="/admin/students/manage" element={<ManageStudents />} />
            <Route path="/admin/mentorship" element={<AdminManageMentorShip />} />
            <Route path="/admin/discussions" element={<AdminManageDiscussions />} />
            <Route path="/admin/sessions" element={<AdminManageLiveSessions />} />
            <Route path="/admin/enrollments" element={<AdminAllEnrollments />} />
          </Route>

        </Routes>
      </BrowserRouter>
      <ToastContainer style={{ zIndex: 999999 }} />
    </>
  )
}

export default App


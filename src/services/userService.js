import axios from "axios";
import { ADD_FEEDBACK, ADMIN_ALL_FEEDBACK, ADMIN_DASHBOARD, AI_CHAT, AI_SUGGEST, ALL_ALUMNIS, ALL_FEEDBACK, ALL_STUDENTS, ALUMNI_DASHBOARD, ALUMNI_PROFILE, ALUMNI_REGISTER, BASE_URL, BLOCK_UNBLOCK_ALUMNI, BLOCK_UNBLOCK_STUDENT, CHANGE_PASSWORD, LOGIN, STUDENT_CHANGE_PASSWORD, STUDENT_PROFILE, STUDENT_REGISTER, STUDENT_UPDATE_PROFILE, UPDATE_PROFILE } from "../endPoints";

function token() {
   const token = localStorage.getItem("token");
   return {
      headers: {
         Authorization: token
      }
   };
}

export function studentRegister(data) {
   return axios.post(BASE_URL + STUDENT_REGISTER, data)
}

export function alumniRegister(data) {
   return axios.post(BASE_URL + ALUMNI_REGISTER, data)
}



export function login(data) {
   return axios.post(BASE_URL + LOGIN, data)
}


export function alumniProfile(data) {
   return axios.post(BASE_URL + ALUMNI_PROFILE, data, token())
}

export function UpdateAlumniProfile(data) {
   return axios.post(BASE_URL + UPDATE_PROFILE, data, token())
}

export function UpdateStudentProfile(data) {
   return axios.post(BASE_URL + STUDENT_UPDATE_PROFILE, data, token())
}

export function AlumniChangePassword(data) {
   return axios.post(BASE_URL + CHANGE_PASSWORD, data, token())
}

export function StudentChangePassword(data){
   return axios.post(BASE_URL + STUDENT_CHANGE_PASSWORD, data, token())
}

export function alumniDashboard(userId){
   return axios.post(BASE_URL + ALUMNI_DASHBOARD, {_id:userId}, token())
}

export function adminDashboard(){
   return axios.post(BASE_URL + ADMIN_DASHBOARD,null, token())
}

export function studentProfile(data) {
   return axios.post(BASE_URL + STUDENT_PROFILE, data, token())
}

export function addFeedback(data){
   return axios.post(BASE_URL + ADD_FEEDBACK, data, token())
}

export function allFeedback(data){
   return axios.post(BASE_URL + ALL_FEEDBACK, data, token())
}

export function adminAllFeedback(data){
   return axios.post(BASE_URL + ADMIN_ALL_FEEDBACK, data, token())
}

export function allAlumnis(data) {
   return axios.post(BASE_URL + ALL_ALUMNIS, data, token())
}

export function allStudents(data) {
   return axios.post(BASE_URL + ALL_STUDENTS, data, token())
}
export function blockUnblockStudent(data) {
   return axios.post(BASE_URL + BLOCK_UNBLOCK_STUDENT, data, token())
}

export function blockUnblockAlumni(data) {
   return axios.post(BASE_URL + BLOCK_UNBLOCK_ALUMNI, data, token())
}

export function aiSuggest(data) {
   return axios.post(BASE_URL + AI_SUGGEST, data, token())
}

export function aiChat(data) {
   return axios.post(BASE_URL + AI_CHAT, data, token())
}






import axios from "axios";
import { ALL_ENROLLMENTS, ALL_ENROLLMENTS_ADMIN, BASE_URL, BLOCK_UNBLOCK_ALUMNI, ENROLLMENT, MANAGE_ENROLLMENTS, STATUS_ENROLLMENTS } from "../endPoints";

function token() {
   const token = localStorage.getItem("token");
   return {
      headers: {
         Authorization: token
      }
   };
}

export function addEnrollment(data) {
   return axios.post(BASE_URL + ENROLLMENT, data, token())
}
export function allEnrollments(data) {
   return axios.post(BASE_URL + ALL_ENROLLMENTS, data, token())
}

export function allEnrollmentsAdmin(data) {
   return axios.post(BASE_URL + ALL_ENROLLMENTS_ADMIN, data, token())
}

export function manageEnrollments(data) {
   return axios.post(BASE_URL + MANAGE_ENROLLMENTS, data, token())
}

export function changeEnrollmentStatus(data) {
   return axios.post(BASE_URL + STATUS_ENROLLMENTS, data, token())
}



import axios from "axios";
import { ADD_MENTORSHIP, ALL_MENTORSHIPS, BASE_URL, BLOCK_UNBLOCK_MENTORSHIP, SINGLE_MENTORSHIP, UPDATE_MENTORSHIP } from "../endPoints";

function token() {
   const token = localStorage.getItem("token");
   return {
      headers: {
         Authorization: token
      }
   };
}


export function addMentorship(data) {
   return axios.post(BASE_URL + ADD_MENTORSHIP, data, token())
}

export function updateMentorship(data) {
   return axios.post(BASE_URL + UPDATE_MENTORSHIP, data, token())
}

export function allMentorships(data) {
   return axios.post(BASE_URL + ALL_MENTORSHIPS, data)
}

export function singleMentorship(data) {
   return axios.post(BASE_URL + SINGLE_MENTORSHIP, data, token())
}

export function blockUnblockMentorship(data) {
   return axios.post(BASE_URL + BLOCK_UNBLOCK_MENTORSHIP, data, token())
}





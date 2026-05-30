import axios from "axios";
import { ADD_LIVE_SESSION, ALL_LIVE_SESSIONS, BASE_URL, BLOCK_UNBLOCK_LIVE_SESSION, SINGLE_LIVE_SESSION, UPDATE_LIVE_SESSION } from "../endPoints";

function token() {
   const token = localStorage.getItem("token");
   return {
      headers: {
         Authorization: token
      }
   };
}


export function addLiveSession(data) {
   return axios.post(BASE_URL + ADD_LIVE_SESSION, data, token())
}

export function updateLiveSession(data) {
   return axios.post(BASE_URL + UPDATE_LIVE_SESSION, data, token())
}

export function allLiveSessions(data) {
   return axios.post(BASE_URL + ALL_LIVE_SESSIONS, data, token())
}

export function singleLiveSession(data) {
   return axios.post(BASE_URL + SINGLE_LIVE_SESSION, data, token())
}

export function blockUnblockLiveSession(data) {
   return axios.post(BASE_URL + BLOCK_UNBLOCK_LIVE_SESSION, data, token())
}





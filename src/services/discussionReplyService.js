import axios from "axios";
import { ADD_DISCUSSION_REPLY, ALL_DISCUSSION_REPLIES, BASE_URL, BLOCK_UNBLOCK_DISCUSSION_REPLY, UPDATE_DISCUSSION_REPLY } from "../endPoints";

function token() {
   const token = localStorage.getItem("token");
   return {
      headers: {
         Authorization: token
      }
   };
}

export function addDiscussionReply(data) {
   return axios.post(BASE_URL + ADD_DISCUSSION_REPLY, data, token())
}

export function allDiscussionReplies(data) {
   return axios.post(BASE_URL + ALL_DISCUSSION_REPLIES, data, token())
}

export function updateDiscussionReply(data) {
   return axios.post(BASE_URL + UPDATE_DISCUSSION_REPLY, data, token())
}

export function blockUnblockDiscussionReply(data) {
   return axios.post(BASE_URL + BLOCK_UNBLOCK_DISCUSSION_REPLY, data, token())
}






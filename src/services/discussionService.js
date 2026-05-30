import axios from "axios";
import { ADD_DISCUSSION, ALL_DISCUSSIONS, BASE_URL, BLOCK_UNBLOCK_DISCUSSION, DISCUSSION_BY_TOPIC, SINGLE_DISCUSSION, UPDATE_DISCUSSION } from "../endPoints";


function token() {
   const token = localStorage.getItem("token");
   return {
      headers: {
         Authorization: token
      }
   };
}


export function addDiscussion(data) {
   return axios.post(BASE_URL + ADD_DISCUSSION, data, token())
}
export function allDiscussions(data) {
   return axios.post(BASE_URL + ALL_DISCUSSIONS, data, token())
}

export function singleDiscussion(data) {
   return axios.post(BASE_URL + SINGLE_DISCUSSION, data, token())
}

export function getDiscussionByTopic(data){
   return axios.post(BASE_URL + DISCUSSION_BY_TOPIC, data, token() )
}

export function updateDiscussion(data) {
   return axios.post(BASE_URL + UPDATE_DISCUSSION, data, token())
}

export function blockUnblockDiscussion(data) {
   return axios.post(BASE_URL + BLOCK_UNBLOCK_DISCUSSION, data, token())
}





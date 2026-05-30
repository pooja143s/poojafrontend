import axios from "axios";
import { ADD_INTEREST, ADD_TOPIC, ALL_TOPICS, BASE_URL, BLOCK_UNBLOCK_TOPIC, SINGLE_TOPIC, UPDATE_TOPIC } from "../endPoints";

function token() {
   const token = localStorage.getItem("token");
   return {
      headers: {
         Authorization: token
      }
   };
}


export function addTopic(data) {
   return axios.post(BASE_URL + ADD_TOPIC, data, token())
}
export function updateTopic(data) {
   return axios.post(BASE_URL + UPDATE_TOPIC, data, token())
}

export function allTopics(data) {
   return axios.post(BASE_URL + ALL_TOPICS, data, token())
}

export function singleTopic(data) {
   return axios.post(BASE_URL + SINGLE_TOPIC, data, token())
}

export function blockUnblockTopic(data) {
   return axios.post(BASE_URL + BLOCK_UNBLOCK_TOPIC, data, token())
}

export function userTopicAdd(data) {
   return axios.post(BASE_URL + ADD_INTEREST, data, token())
}





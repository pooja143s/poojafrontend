// chatbot/ActionProvider.js

import { aiChat } from "../../services/userService"

class ActionProvider {

  constructor(createChatBotMessage, setStateFunc) {

    this.createChatBotMessage = createChatBotMessage
    this.setState = setStateFunc
  }

  // =========================================
  // ADD MESSAGE TO STATE
  // =========================================

  addMessage = (message) => {

    this.setState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }))
  }

  // =========================================
  // HANDLE USER MESSAGE
  // =========================================

  handleUserMessage = async (message) => {

    try {

      // =====================================
      // SHOW TYPING MESSAGE
      // =====================================

      const typingMessage =
        this.createChatBotMessage("Typing...")

      this.addMessage(typingMessage)

      // =====================================
      // CHAT HISTORY
      // =====================================

      let history = []

      this.setState(prev => {

        history = prev.messages.map(msg => ({
          type: msg.type,
          text: msg.message
        }))

        return prev
      })

      // =====================================
      // API CALL
      // =====================================

      const res = await aiChat({
        message,
        history
      })

      console.log("AI RESPONSE:", res.data)

      // =====================================
      // REMOVE TYPING MESSAGE
      // =====================================

      this.setState(prev => ({
        ...prev,
        messages: prev.messages.filter(
          msg => msg.message !== "Typing..."
        )
      }))

      // =====================================
      // BOT RESPONSE
      // =====================================

      let reply = "Something went wrong"

if (res?.data?.success) {

    reply = res.data.reply

} else if (
    res?.data?.message?.toLowerCase().includes("token")
) {

    reply = "Please login to continue chatting."

} else {

    reply = res?.data?.message || "Something went wrong"
}

const botMessage =
    this.createChatBotMessage(reply)
      this.addMessage(botMessage)

    } catch (err) {

      console.log(err)

      // =====================================
      // REMOVE TYPING MESSAGE
      // =====================================

      this.setState(prev => ({
        ...prev,
        messages: prev.messages.filter(
          msg => msg.message !== "Typing..."
        )
      }))

      // =====================================
      // ERROR MESSAGE
      // =====================================

      const errorMessage =
        this.createChatBotMessage(
          "Server error. Please try again."
        )

      this.addMessage(errorMessage)
    }
  }
}

export default ActionProvider
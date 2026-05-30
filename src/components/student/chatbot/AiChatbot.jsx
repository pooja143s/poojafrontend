import React, { useState } from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import config from "../../chatbot/Config";
import MessageParser from "../../chatbot/messageParser";
import ActionProvider from "../../chatbot/ActionProvider";


export default function AiChatbot() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* FLOAT BUTTON */}
            <div
                onClick={() => setOpen(!open)}
                style={{
                    position: "fixed",
                    bottom: "100px",
                    right: "45px",
                    background: "#0d6efd",
                    color: "#fff",
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 9999,
                }}
            >
                🤖
            </div>

            {/* CHAT WINDOW */}
            {open && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "90px",
                        right: "20px",
                        zIndex: 9999,
                        background: "#fff",
                        borderRadius: "10px",
                        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                        overflow: "hidden",
                    }}
                >
                    {/* HEADER WITH CLOSE BUTTON */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px",
                            background: "#0d6efd",
                            color: "#fff",
                        }}
                    >
                        <span>AI Assistant</span>
                        <button
                            onClick={() => setOpen(false)}
                            style={{
                                background: "transparent",
                                border: "none",
                                color: "#fff",
                                fontSize: "18px",
                                cursor: "pointer",
                            }}
                        >
                            ✖
                        </button>
                    </div>

                    {/* CHATBOT */}
                    <Chatbot
                        config={config}
                        messageParser={MessageParser}
                        actionProvider={ActionProvider}
                    />
                </div>
            )}
        </>
    );
}
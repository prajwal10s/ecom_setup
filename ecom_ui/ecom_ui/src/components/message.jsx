import React from "react";

export const Message = ({ message }) => {
  if (!message.text) return null;
  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${
        message.type === "success" ? "bg-green-500" : "bg-red-500"
      } z-50`}
    >
      {message.text}
    </div>
  );
};

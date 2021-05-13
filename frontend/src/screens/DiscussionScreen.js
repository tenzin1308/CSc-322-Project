import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const chat = [
  {
    sender: {
      _id: 2,
      name: "Smith Lee",
    },
    message: "Hey! How are you",
    time: "11:01",
  },
  {
    sender: {
      _id: 1,
      name: "John Doe",
    },
    message: "Hey! I'm fine. Thanks for asking!",
    time: "11:01",
  },
];
export default function DiscussionScreen(props) {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  return (
    <div>
      <h2>
        <center>Discussion Forum</center>
      </h2>
      {userInfo && (
        <form
          className="container"
          style={{ display: "flex", justifyContent: "space-evenly" }}
          onSubmit={() => {}}
        >
          <textarea
            type="text"
            // onChange={(e) => setTabooWord(e.target.value)}
            style={{ width: "85%", maxWidth: "85%" }}
          ></textarea>
          <button type="submit" className="add">
            Send
          </button>{" "}
        </form>
      )}
      <hr />
      {chat.map((msg) => {
        return (
          <div class={`container ${msg.sender._id === 1 && "darker"}`}>
            <strong>{msg.sender.name}</strong>
            <p>{msg.message}</p>
            <span class="time-left">{msg.time}</span>
          </div>
        );
      })}
    </div>
  );
}

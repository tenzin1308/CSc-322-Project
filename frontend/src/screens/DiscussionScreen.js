import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, getDiscussion } from "../actions/tabooActions";
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
  const { discussion } = useSelector((state) => state.getDiscussion);
  const dispatch = useDispatch();
  const { userInfo } = userSignin;
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(getDiscussion());
  }, []);

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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: "85%", maxWidth: "85%" }}
          ></textarea>
          <button
            type="submit"
            className="add"
            onClick={(e) => {
              e.preventDefault();
              if (message) {
                dispatch(sendMessage(message));
                setMessage("")
              } else {
                alert("message can not be empty");
              }
            }}
          >
            Send
          </button>{" "}
        </form>
      )}
      <hr />
      {discussion?.map((msg) => {
        return (
          <div class={`container ${msg.sender._id === 1 && "darker"}`}>
            <strong>{msg.sender.name}</strong>
            <p>{msg.message}</p>
            <span class="time-left">{msg.createdAt}</span>
          </div>
        );
      })}
    </div>
  );
}

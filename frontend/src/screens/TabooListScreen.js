import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTabooWords, addTaboo, deleteTabooWord } from "../actions/tabooActions";

export default function TabooListScreen(props) {
  const { tabooWords } = useSelector((state) => state.getTabooWords);

  // Filter
  var Filter = require("bad-words"),
    filter = new Filter();

  const state = {
    button: 1,
  };
  const [tabooWord, setTabooWord] = useState("");
  const dispatch = useDispatch();
  // const eventHandler = (e) => {
  //   e.preventDefault();

  //   if (state.button === 1) {
  //     console.log("Add Button clicked!");
  //     filter.addWords(tabooWord);
  //     console.log(filter.clean(tabooWord));
  //   }
  //   if (state.button === 2) {
  //     console.log("Remove Button clicked!");
  //     filter.removeWords(tabooWord);
  //     console.log(filter.clean(tabooWord));
  //   }
  // };

  useEffect(() => {
    dispatch(getTabooWords());
  }, []);

  return (
    <div>
      <h2>
        <center>Add/Remove Taboo word to Black List</center>
      </h2>
      <form className="form">
        <input
          type="text"
          value={tabooWord}
          onChange={(e) => setTabooWord(e.target.value)}
        ></input>
        <button
          type="submit"
          className="add"
          onClick={(e) => {
            e.preventDefault();
            if (tabooWord) {
              setTabooWord("");
              dispatch(addTaboo(tabooWord));
            } else {
              alert("please write a taboo word");
            }
          }}
        >
          Add
        </button>
        <ul>
          {tabooWords?.map((word) => {
            return (
              <><li>
                {word.word}{" "}
                <button
                  type="button"
                  className="remove"
                  onClick={() => dispatch(deleteTabooWord(word._id))}
                >
                  Remove
                </button>
              </li><hr/></>
            );
          })}
        </ul>
      </form>
    </div>
  );
}

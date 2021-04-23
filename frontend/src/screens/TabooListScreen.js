import React, {useState} from 'react';
import { useDispatch } from 'react-redux';

export default function ProductScreen(props) {

    // Filter
    var Filter = require('bad-words'),
    filter = new Filter();
    
    
    const state = {
        button: 1
    };
    const [tabooWord, setTabooWord] = useState('');
    const dispatch = useDispatch(); 
    const eventHandler = (e) => {
        e.preventDefault();

        
        if (state.button === 1) {
            console.log("Add Button clicked!");
            filter.addWords(tabooWord);
            console.log(filter.clean(tabooWord));    
                   
        }
        if (state.button === 2) {
            console.log("Remove Button clicked!");
            filter.removeWords(tabooWord);
            console.log(filter.clean(tabooWord));   
        }  
    };
    return (
    <div>
        <h2><center>Add/Remove Taboo word to Black List</center></h2>
        <form className="form" onSubmit={eventHandler}>
            <input type="text" onChange={(e) => setTabooWord(e.target.value)}></input>
            <button type="submit" className="add" onClick={() => (state.button = 1)}>Add</button> <button type="submit" className="remove" onClick={() => (state.button = 2)}>Remove</button>
        </form>
    </div>
    )
}

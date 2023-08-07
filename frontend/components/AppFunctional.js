import React, { useState, useEffect } from 'react'
import axios from 'axios';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [email, setEmail] = useState(initialMessage);
  const [xCoordinate, setXCoordinate] = useState(currentIndex % 3);
  const [yCoordinate, setYCoordinate] = useState(Math.floor(currentIndex / 3));
  const [message, setMessage] = useState(initialMessage);
  const [steps, setSteps] = useState(0);
  const [firstMove, setFirstMove] = useState(true)
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  useEffect(() => {
    coordinateTracker();
  }, [currentIndex]);

  function coordinateTracker() {
    let x, y;
    if (currentIndex === 0) {
      x = 1;
      y = 1;
    } else if (currentIndex === 1) {
      x = 2;
      y = 1;
    } else if (currentIndex === 2) {
      x = 3;
      y = 1;
    } else if (currentIndex === 3) {
      x = 1;
      y = 2;
    } else if (currentIndex === 4) {
      x = 2;
      y = 2;
    } else if (currentIndex === 5) {
      x = 3;
      y = 2;
    } else if (currentIndex === 6) {
      x = 1;
      y = 3;
    } else if (currentIndex === 7) {
      x = 2;
      y = 3;
    } else if (currentIndex === 8) {
      x = 3;
      y = 3;
    }

    setXCoordinate(x);
    setYCoordinate(y);
  }


  function reset() {
    setCurrentIndex(initialIndex);
    setMessage(initialMessage);
    setSteps(0);
  }

  function getNextIndex(direction) {
    const numRows = 3;
    const numCols = 3;

    const currentRow = Math.floor(currentIndex / numCols);
    const currentCol = currentIndex % numCols;

    let newRow = currentRow;
    let newCol = currentCol;

    switch (direction) {
      case 'left':
        if (currentCol - 1 < 0) {
          setMessage("You can't go left");
          return currentIndex;
        }
        newCol = (currentCol - 1 + numCols) % numCols;
        setMessage(initialMessage);
        setSteps(steps + 1);
        break;
      case 'up':
        console.log(currentRow)
        if (currentRow - 1 < 0) {
          setMessage("You can't go up");
          return currentIndex;
        }
        newRow = (currentRow - 1 + numRows) % numRows;
        setMessage(initialMessage);
        setSteps(steps + 1);
        break;
      case 'right':
        if (currentCol + 1 > 2) {
          setMessage("You can't go right");
          return currentIndex;
        }
        newCol = (currentCol + 1) % numCols;
        setMessage(initialMessage);
        setSteps(steps + 1);
        break;
      case 'down':
        if (currentRow + 1 > 2) {
          setMessage("You can't go down");
          return currentIndex;
        }
        newRow = (currentRow + 1) % numRows;
        setMessage(initialMessage);
        setSteps(steps + 1);
        break;
      default:
        break;
    }

    const nextIndex = newRow * numCols + newCol;
    return nextIndex;
  }


  function move(evt) {
    const direction = evt.target.id;
    const nextIndex = getNextIndex(direction);

    setCurrentIndex(nextIndex);
  }

  function onChange(evt) {
    setEmail(evt.target.value)
    // You will need this to update the value of the input.
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    axios.post(`http://localhost:9000/api/result`, {
      "x": xCoordinate,
      "y": yCoordinate,
      "steps": steps,
      "email": email
    })
      .then(res => {
        setMessage(res.data.message)
        console.log(res);
      })
      .catch(err => console.error(err))
  }


  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates" >Coordinates ({xCoordinate} , {yCoordinate})</h3>
        <h3 id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>  
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${currentIndex === idx ? ' active' : ''}`}>
              {idx === currentIndex ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={move} id="left">LEFT</button>
        <button onClick={move} id="up">UP</button>
        <button onClick={move} id="right">RIGHT</button>
        <button onClick={move} id="down">DOWN</button>
        <button onClick={reset} id="reset">reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}

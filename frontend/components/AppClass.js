import React from 'react';
import { useState, useEffect } from 'react';
// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  constructor() {
    super();
    this.state = {
      ...initialState,
      xCoordinate: initialIndex % 3,
      yCoordinate: Math.floor(initialIndex / 3),
    };
  }

  coordinateTracker() {
    let x, y;
    const { currentIndex } = this.state;
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

    this.setState({
      xCoordinate: x,
      yCoordinate: y,
    });
  }

  componentDidMount() {
    this.coordinateTracker();
  }

  reset = () => {
    this.setState({
      ...initialState,
      xCoordinate: initialIndex % 3,
      yCoordinate: Math.floor(initialIndex / 3),
    });
  };

  getNextIndex = (direction) => {
    const numRows = 3;
    const numCols = 3;

    const { currentIndex, steps } = this.state;

    const currentRow = Math.floor(currentIndex / numCols);
    const currentCol = currentIndex % numCols;

    let newRow = currentRow;
    let newCol = currentCol;

    switch (direction) {
      case 'left':
        if (currentCol - 1 < 0) {
          this.setState({ message: "You can't go left" });
          return currentIndex;
        }
        newCol = (currentCol - 1 + numCols) % numCols;
        this.setState({ message: initialMessage, steps: steps + 1 });
        break;
      case 'up':
        if (currentRow - 1 < 0) {
          this.setState({ message: "You can't go up" });
          return currentIndex;
        }
        newRow = (currentRow - 1 + numRows) % numRows;
        this.setState({ message: initialMessage, steps: steps + 1 });
        break;
      case 'right':
        if (currentCol + 1 > 2) {
          this.setState({ message: "You can't go right" });
          return currentIndex;
        }
        newCol = (currentCol + 1) % numCols;
        this.setState({ message: initialMessage, steps: steps + 1 });
        break;
      case 'down':
        if (currentRow + 1 > 2) {
          this.setState({ message: "You can't go down" });
          return currentIndex;
        }
        newRow = (currentRow + 1) % numRows;
        this.setState({ message: initialMessage, steps: steps + 1 });
        break;
      default:
        break;
    }

    const nextIndex = newRow * numCols + newCol;
    return nextIndex;
  };

  move = (evt) => {
    const direction = evt.target.id;
    const nextIndex = this.getNextIndex(direction);
    this.setState({ currentIndex: nextIndex });
  };

  onChange = (evt) => {
    this.setState({ email: evt.target.value });
  };


  onSubmit = (evt) => {
    evt.preventDefault();
    const { xCoordinate, yCoordinate, steps, email } = this.state;
    axios.post(`http://localhost:9000/api/result`, {
      x: xCoordinate,
      y: yCoordinate,
      steps: steps,
      email: email,
    })
      .then((res) => {
        this.setState({ message: res.data.message });
        console.log(res);
      })
      .catch((err) => console.error(err));
  };

  render() {
    const { className } = this.props;
    const { currentIndex, xCoordinate, yCoordinate, message, email } = this.state;
    
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates ({xCoordinate},{yCoordinate})</h3>
          <h3 id="steps">You moved {this.state.steps} times</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
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
          <button onClick={this.move} id="left">LEFT</button>
          <button onClick={this.move} id="up">UP</button>
          <button onClick={this.move} id="right">RIGHT</button>
          <button onClick={this.move} id="down">DOWN</button>
          <button onClick={this.reset} id="reset">reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" value={email} onChange={this.onChange}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}

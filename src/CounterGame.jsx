import { useReducer, useRef, useCallback, useEffect, useState } from "react";

import "./styles/styles.css";

const initialState = { count: 0, history: [] };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return {
        count: state.count + action.amount,
        history: [
          ...state.history,
          `+${action.amount} → ${state.count + action.amount}`,
        ],
      };
    case "decrement":
      return {
        count: state.count - action.amount,
        history: [
          ...state.history,
          `-${action.amount} → ${state.count - action.amount}`,
        ],
      };
    case "reset":
      return initialState;
    case "undo":
      if (state.history.length === 0) return state;
      const newHistory = state.history.slice(0, -1);
      const lastCount = newHistory.length
        ? parseInt(newHistory[newHistory.length - 1].split("→ ")[1])
        : 0;
      return { count: lastCount, history: newHistory };
    default:
      return state;
  }
}

export default function CounterGame() {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const saved = localStorage.getItem("contador-history");
    if (saved) return JSON.parse(saved);
    return init;
  });

  const [inputValue, setInputValue] = useState(1);
  const incrementBtnRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    incrementBtnRef.current.focus();
  }, []);

  useEffect(() => {
    localStorage.setItem("contador-history", JSON.stringify(state));
  }, [state]);

  // Funciones con useCallback
  const handleIncrement = useCallback(() => {
    dispatch({ type: "increment", amount: Number(inputValue) || 1 });
    inputRef.current.focus();
  }, [inputValue]);

  const handleDecrement = useCallback(() => {
    dispatch({ type: "decrement", amount: Number(inputValue) || 1 });
    inputRef.current.focus();
  }, [inputValue]);

  const handleReset = useCallback(() => dispatch({ type: "reset" }), []);
  const handleUndo = useCallback(() => dispatch({ type: "undo" }), []);

  return (
    <div className="counter-container">
      <h2>Contador: {state.count}</h2>

      <div className="controls">
        <input
          ref={inputRef}
          type="number"
          min="1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="number-input"
        />
        <button
          ref={incrementBtnRef}
          onClick={handleIncrement}
          className="btn increment"
        >
          +
        </button>
        <button onClick={handleDecrement} className="btn decrement">
          -
        </button>
        <button onClick={handleReset} className="btn reset">
          Reset
        </button>
        <button onClick={handleUndo} className="btn undo">
          Deshacer
        </button>
      </div>

      <h3>Historial de cambios:</h3>
      <ul className="history-list">
        {state.history.map((entry, index) => (
          <li key={index}>{entry}</li>
        ))}
      </ul>
    </div>
  );
}

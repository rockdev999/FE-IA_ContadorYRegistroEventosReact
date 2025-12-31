import { useReducer, useRef, useCallback, useEffect, useState } from "react";

// Estado inicial
const initialState = { products: [] };

// Reducer
function reducer(state, action) {
  switch (action.type) {
    case "add":
      return {
        products: [
          ...state.products,
          { id: Date.now(), name: action.name, quantity: 1 },
        ],
      };
    case "increment":
      return {
        products: state.products.map((p) =>
          p.id === action.id ? { ...p, quantity: p.quantity + 1 } : p
        ),
      };
    case "decrement":
      return {
        products: state.products.map((p) =>
          p.id === action.id && p.quantity > 1
            ? { ...p, quantity: p.quantity - 1 }
            : p
        ),
      };
    case "remove":
      return {
        products: state.products.filter((p) => p.id !== action.id),
      };
    case "clear":
      return initialState;
    default:
      return state;
  }
}

export default function InventoryManager() {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const saved = localStorage.getItem("inventory-products");
    if (saved) return JSON.parse(saved);
    return init;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem("inventory-products", JSON.stringify(state));
  }, [state]);

  // Funciones con useCallback
  const handleAddProduct = useCallback(() => {
    const value = inputRef.current.value.trim();
    if (value) {
      dispatch({ type: "add", name: value });
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  }, []);

  const handleIncrement = useCallback((id) => {
    dispatch({ type: "increment", id });
  }, []);

  const handleDecrement = useCallback((id) => {
    dispatch({ type: "decrement", id });
  }, []);

  const handleRemove = useCallback((id) => {
    dispatch({ type: "remove", id });
  }, []);

  const handleClear = useCallback(() => dispatch({ type: "clear" }), []);

  const filteredProducts = state.products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="inventory-container">
      <div className="add-product">
        <input
          ref={inputRef}
          type="text"
          placeholder="Nombre del producto"
        />
        <button onClick={handleAddProduct}>Agregar Producto</button>
        <button onClick={handleClear} className="btn-clear">
          Vaciar Inventario
        </button>
      </div>

      <div className="search">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ul className="product-list">
        {filteredProducts.map((product) => (
          <li key={product.id}>
            <span>{product.name}</span> - <strong>{product.quantity}</strong>
            <button onClick={() => handleIncrement(product.id)}>+</button>
            <button onClick={() => handleDecrement(product.id)}>-</button>
            <button onClick={() => handleRemove(product.id)}>Eliminar</button>
          </li>
        ))}
        {filteredProducts.length === 0 && <li>No hay productos.</li>}
      </ul>
    </div>
  );
}

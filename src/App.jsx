import CounterGame from "./CounterGame";
import './App.css';
import InventoryManager from "./InventoryManager";
export default function App() {
  return (
    <>
    <div className="app-container">
      <h1>Contador Interactivo</h1>
      <CounterGame />
    </div>
     <div className="app-container">
      <h1>Gestor de Inventario</h1>
      <InventoryManager />
    </div>
    </>
  );
}

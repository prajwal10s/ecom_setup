import { useState } from "react";
import "./App.css";
import EcomPage from "./components/ecomPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <EcomPage />
      </div>
    </>
  );
}

export default App;

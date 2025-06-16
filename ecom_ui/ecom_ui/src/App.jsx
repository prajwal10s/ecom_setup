import { useState } from "react";
import "./App.css";
import { EcomPage } from "./ecomPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <EcomPage />
      </div>
    </>
  );
}

export default App;

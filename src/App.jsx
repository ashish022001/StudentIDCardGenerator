import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentIDCardGenerator from "./Components/StudentIDCardGenerator";
import IDCardGenerator from "./Components/StudentIDCardGenerator";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IDCardGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;

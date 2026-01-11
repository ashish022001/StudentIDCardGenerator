import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentIDCardGenerator from "./Components/StudentIDCardGenerator";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentIDCardGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;

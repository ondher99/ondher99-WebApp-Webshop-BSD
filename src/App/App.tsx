import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegistrationForm from "../Registration/Registration";
import CategoryPage from "../views/Product/CategoryPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/products" element={<CategoryPage />} />


        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

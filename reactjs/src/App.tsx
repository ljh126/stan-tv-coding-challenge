import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Error from './pages/Error';
import Program from './pages/Program';
import Header from "./components/Header";

import './App.css';
import { CarouselProvider } from "./carousel/providers/CarouselProvider";

function App() {
  return (
    <div className="App">
      <div className="app-container">
        <CarouselProvider>
          <Header />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} errorElement={<Error />} />
              <Route path="/program/:id" element={<Program />} errorElement={<Error />} />
            </Routes>
          </BrowserRouter>
        </CarouselProvider>
      </div>
    </div>
  );
}

export default App;

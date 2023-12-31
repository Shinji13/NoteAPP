import Intail from "./intial";
import { Routes, Route, useNavigate } from "react-router";
import HomeProxy from "./pages/home/HomeProxy";
import ShowNote from "./pages/ShowNote/ShowNote";
import SecureRoute from "./secureRoute";
import NewOrEdit from "./pages/NewOrEdit/modify";
import ErrorHandler from "./pages/Error/error";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Intail />} />
      <Route element={<SecureRoute />}>
        <Route path="/home" element={<HomeProxy />} />
        <Route path="/new" element={<NewOrEdit isEdit={false} />} />
        <Route path="/note/:id">
          <Route index element={<ShowNote />} />
          <Route path="edit" element={<NewOrEdit isEdit={true} />} />
        </Route>
      </Route>
      <Route path="*" element={<ErrorHandler />} />
    </Routes>
  );
}

export default App;

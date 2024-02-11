import { Route, Routes } from "react-router-dom";
import SignIn from "./lehed/Login";
import SignUp from "./lehed/Registreeri";
import IndexPage from "./lehed/IndexLeht";
import VaataPileteid from "./lehed/VaataPileteid";
import ValideeriPilet from "./lehed/ValideeriPilet";
import AdminLeht from "./lehed/AdminLeht";
import OstaPilet from "./lehed/OstaPilet";
import Tehing from "./lehed/Tehing";
import AdminRedigeeri from "./lehed/AdminRedigeeri";

function App() {
  return (
    <Routes>
      <Route path="/" Component={IndexPage} />
      <Route path="/login" Component={SignIn} />
      <Route path="/registreeri" Component={SignUp} />
      <Route path="/piletid" Component={VaataPileteid} />
      <Route path="/piletid/:piletId" Component={OstaPilet} />
      <Route path="/osta/:id" Component={Tehing} />
      <Route path="/valideeri" Component={ValideeriPilet} />
      <Route path="/admin" Component={AdminLeht} />
      <Route path="/admin/:id" Component={AdminRedigeeri} />
    </Routes>
  );
}

export default App;

import { useRoutes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import CardTransfer from "./pages/CardTransfer.jsx";
import MyQrCode from "./pages/MyQrCode.jsx";
import Header from "./components/Header.jsx";
import Transactions from "./pages/Transactions.jsx";
import Installments from "./pages/Installments.jsx";
import Stores from "./pages/Stores.jsx";
import Services from "./pages/Services.jsx";
import UserData from "./pages/UserData.jsx"; // New import for UserData page

export default function App() {
  /* All routes in one place */
  const routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/signup", element: <SignUp /> },
    { path: "/login", element: <Login /> },
    { path: "/profile", element: <Profile /> },
    { path: "/card-transfer", element: <CardTransfer /> },
    { path: "/my-qr-code", element: <MyQrCode /> },
    { path: "/transactions", element: <Transactions /> },
    { path: "/installments", element: <Installments /> },
    { path: "/stores", element: <Stores /> },
    { path: "/services", element: <Services /> },
    { path: "/user-data", element: <UserData /> }, // New route for UserData
  ]);

  return (
    <>
      <Header />
      {routes}
    </>
  );
}
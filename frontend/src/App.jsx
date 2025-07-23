import { useRoutes } from "react-router-dom";
import Home        from "./pages/Home.jsx";
import SignUp      from "./pages/SignUp.jsx";
import Login       from "./pages/Login.jsx";
import Profile     from "./pages/Profile.jsx";
import CardTransfer from "./pages/CardTransfer.jsx";
import MyQrCode    from "./pages/MyQrCode.jsx";
import Header      from "./components/Header.jsx";

export default function App() {
  /* All routes in one place */
  const routes = useRoutes([
    { path: "/",               element: <Home /> },
    { path: "/signup",         element: <SignUp /> },
    { path: "/login",          element: <Login /> },
    { path: "/profile",        element: <Profile /> },
    { path: "/cardtransfer",   element: <CardTransfer /> },
    /* Dynamic :token param — must match the navigate() in CardTransfer */
    { path: "/myqrcode/:token", element: <MyQrCode /> },
    /* fallback */
    { path: "*",               element: <Home /> },
  ]);

  return (
    <>
      <Header />
      {routes}
    </>
  );
}

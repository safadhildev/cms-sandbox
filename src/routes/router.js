import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from "react-router-dom";
import UserProvider from "../context/userContext";
import Dashboard from "../screens/dashboard";
import ForgotPassword from "../screens/forgotPassword";
import Login from "../screens/login";
import Users from "../screens/users";
import Root from "./Root";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/laman-utama",
        exact: true,
        element: <Dashboard />,
      },
      {
        path: "/senarai-ahli",
        exact: true,
        element: <Users />,
      },
    ],
  },
  {
    path: "/login",
    exact: true,
    element: (
      <UserProvider>
        <Login />
      </UserProvider>
    ),
  },
  {
    path: "/terlupa-kata-laluan",
    exact: true,
    element: <ForgotPassword />,
  },
]);

// export const router = createBrowserRouter(
//   createRoutesFromElements(
//     <BrowserRouter>
//       <Route path="/" exact element={<Root />}>
//         <Route path="dashboard" exact element={<Dashboard />} />
//         <Route path="senarai-ahli" exact element={<Users />} />
//       </Route>
//       <Route path="login" exact element={<Login />} />
//     </BrowserRouter>
//   )
// );

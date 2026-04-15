import { createRoot } from "react-dom/client";
import "./app/index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { Provider } from "react-redux";
import { store } from "./app/store";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />,
  </Provider>,
);

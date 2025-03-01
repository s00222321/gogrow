import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { AuthProvider } from "./components/AuthContext.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
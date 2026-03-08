import { Navigate } from "react-router-dom";

function WymaganeLogowanie({ kto, children }) {
  if (!kto) {
    return <Navigate to="/logowanie" replace />;
  }

  return children;
}

export default WymaganeLogowanie;

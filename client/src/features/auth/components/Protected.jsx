import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "../../../Loading";

const Protected = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return  <Loading/>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
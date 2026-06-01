import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


const Authentication = ({children}) => {

 const { isAuthenticated, loading } = useAuth();
 const location = useLocation();


  if (loading) {
    return null; 
  }

  if(!isAuthenticated ) {
   return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}



export default Authentication;
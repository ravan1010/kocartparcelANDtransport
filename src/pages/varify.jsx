
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function Verify() {
  const navigate = useNavigate();

  useEffect(() => {

    console.log("delivery");
    
    api
      .get("/auth/parcelANDtransport/cookie") // cookie auto sent
      .then((res) => {
        console.log("User:", res.data);
        navigate("/details"); // or wherever
      })
      .catch(() => {
        navigate("/login");
      })
  }, []);

  return <h2>Logging you in...</h2>;
}

export default Verify;

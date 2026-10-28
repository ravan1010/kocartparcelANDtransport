import { useEffect, useState } from "react";
import api from "../../api";

const ADMINMainauth = () => {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    api
      .get("/api/adminmain", { withCredentials: true })
      .then((res) => {
        if (active) {
          setAdmin(res.data.user || null);
        }
      })
      .catch(() => {
        if (active) setAdmin(null);
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { admin, checking };
};

export default ADMINMainauth;
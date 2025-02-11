import { checkSession } from "@/sessions/sessions";
import { useEffect, useState } from "react";

export default function SessionComponent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      const session = await checkSession();
      if (session) {
        setUser(session);
      }
      setLoading(false);
    };

    fetchSession();
  }, []);

  if (loading) return <p>Loading...</p>;

  return user ? <p>Logged in as {user.email}</p> : <p>No active session</p>;
}

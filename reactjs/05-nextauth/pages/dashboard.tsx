import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useCan } from "../hooks/useCan";
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const userCanSeeMetrics = useCan({ permissions: ["metrics.list"] });

  useEffect(() => {
    api
      .get("/me")
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  });

  return (
    <>
      <h1>Dashboard</h1>
      <h1>{user?.email}</h1>
      {userCanSeeMetrics && <div>Métricas</div>}
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("/me");
  console.log(response);

  return {
    props: {},
  };
});
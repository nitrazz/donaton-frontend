import { useMsal } from "@azure/msal-react";
import { useState } from "react";
import { tokenRequest } from "../authConfig";

export const useAdminAuth = () => {
  const { instance } = useMsal();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const authenticateAdmin = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const loginResponse = await instance.loginPopup(tokenRequest);
      const claims = loginResponse.idTokenClaims as { roles?: string[] };
      const roles = claims?.roles || [];

      if (!roles.includes("Admin")) {
        setError("El usuario autenticado no posee el rol de Administrador.");
        return false;
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido al autenticar.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { authenticateAdmin, loading, error };
};
import { createContext, useEffect, useState } from "react";

import { setCookie, parseCookies } from "nookies";

import Router from "next/router";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [sToken, setSToken] = useState("");
  const isAuthenticated = !!user;

  useEffect(() => {
    const { "JMC.Auth.token": token } = parseCookies();
    reloadToken(token);
  }, []);

  async function reloadToken(token) {
    axios
      .post("/api/recoverUserInformation", { token_jwt: token })
      .then((response) => {
        const res = response.data;
        setSToken(res.token_jwt);
        setCookie(undefined, "JMC.Auth.token", res.token_jwt, {
          maxAge: 60 * 30, // 30 minutes
          path: "/",
        });
        setUser(res.userData);
      })
      .catch((erro) => {
        const res = erro.response?.data;
        setSToken(res.token_jwt);
        setCookie(undefined, "JMC.Auth.token", res.token_jwt, {
          maxAge: 60 * 30, // 30 minutes
          path: "/",
        });
        setUser(null);
        Router.push("/");
      });
  }

  async function signIn(data) {
    setUser(data.userData);

    setSToken(data.token_jwt);

    setCookie(undefined, "JMC.Auth.token", data.token_jwt, {
      maxAge: 60 * 30, // 30 minutes
      path: "/",
    });

    if (data.token_jwt === "NOT_AUTH") {
      Router.reload();
    } else {
      Router.push("/Home");
    }
  }

  async function logout() {
    setSToken(undefined);
    setUser(null);
    setCookie(undefined, "JMC.Auth.token", "NOT_AUTH", {
      maxAge: 60 * 30, // 30 minutes
      path: "/",
    });
    Router.push("/");
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signIn, sToken, logout, reloadToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

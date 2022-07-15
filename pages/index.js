import { useForm } from "react-hook-form";
import Head from "next/head";
import Image from "next/image";
import logoImage from "../public/logo.png";
import styles from "../styles/Login.module.css";
import axios from "axios";

import { useContext } from "react";
import { AuthContext } from "../src/contexts/AuthContext";
import { parseCookies } from "nookies";

export const getServerSideProps = async (ctx) => {
  const { "JMC.Auth.token": token } = ctx.req.cookies;

  if (token && token !== "NOT_AUTH") {
    const result = await axios.post(
      `http://${ctx.req.headers.host}/api/checkToken`,
      {
        token_jwt: token,
      }
    );
    if (result.data.error === "null" && result.data.status === true) {
      return {
        redirect: {
          destination: "/Home",
          permanent: false,
        },
        props: {},
      };
    } else if (result.data.error !== "null" && result.data.status === false) {
      return {
        props: {},
      };
    }
  }

  return {
    props: {},
  };
};

export default function Login() {
  const { register, handleSubmit } = useForm();
  const { signIn } = useContext(AuthContext);
  async function handleLogin(data) {
    console.log(data);
    const res = await axios.post("/api/login", data);
    if (res.status === 200) {
      signIn(res.data);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>JMC PAINEL</title>
        <link rel="shortcut icon" href="./favicon.png" />
      </Head>

      <div className={styles.info}>
        <div className={styles.logo}>
          <Image src={logoImage} alt="LOGO jmc" layout="responsive" />
        </div>
        <h1>Painel Administrativo</h1>
        <p>Painel de Gerenciamento interno de clientes e serviços JMC.</p>
      </div>

      <div className={styles.login}>
        <div className={styles.loginCard}>
          <h1>Faça Login Para Acessar</h1>

          <form
            className={styles.loginFrom}
            onSubmit={handleSubmit(handleLogin)}
          >
            <div className={styles.loginInput}>
              <label>Usuario: </label>
              <input
                {...register("username")}
                name="username"
                type="text"
                placeholder="Digite O Seu Usuario"
                required
                tabIndex={1}
              />
            </div>

            <div className={styles.loginInput}>
              <label>Senha: </label>
              <input
                {...register("password")}
                name="password"
                type="password"
                placeholder="Digite A Sua Senha"
                required
                tabIndex={2}
              />
            </div>

            <button
              type="submit"
              className={styles.loginFormSubmit}
              // onClick={() => {}}
              tabIndex={3}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

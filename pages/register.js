import { useForm } from "react-hook-form";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import logoImage from "../public/logo.png";
import axios from "axios";
import { useRouter } from "next/router";

export const getServerSideProps = async (ctx) => {
  const { "JMC.Auth.token": token } = ctx.req.cookies;

  if (token && token !== "NOT_AUTH") {
    const result = await axios.post(
      `https://${ctx.req.headers.host}/api/checkToken`,
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
  const router = useRouter();
  async function handleLogin(data) {
    const user = await axios.post(`/api/userCheck/${data.username}`);

    if (user.data.error === "null") {
      const res = await axios.post("/api/register", data);
      if (res.status === 200) {
        router.push("/");
      } else {
        router.reload();
      }
    } else {
      alert(user.data.error);
      router.push("/");
    }
  }

  return (
    <div className={`flex w-full h-full flex-row`}>
      <Head>
        <title>JMC PAINEL</title>
        <link rel="shortcut icon" href="./favicon.png" />
      </Head>

      <div
        className={`hidden xl:flex flex-col flex-1 justify-center bg-info h-screen max-w-[50%] px-6 pt-6`}
      >
        <div className={`max-w-[50%]`}>
          <Image src={logoImage} alt="LOGO jmc" layout="responsive" />
        </div>
        <h1 className="text-white border-b-2 border-white max-w-[50%] text-2xl">
          Painel Administrativo
        </h1>
        <p className="text-white">
          Painel de Gerenciamento interno de clientes e serviços JMC.
        </p>
      </div>

      <div
        className={`flex flex-col h-screen flex-1 items-center justify-center bg-login animate-[fade_1s] `}
      >
        <div
          className={`flex flex-col bg-loginCard w-96 h-fit p-5 items-center justify-center border-4 border-jmc-blue shadow-2xl rounded-2xl min-h-[20rem]`}
        >
          <h1 className={`text-white text-2xl m-2`}>
            Faça Registro Para Acessar
          </h1>

          <form
            className={`flex flex-1 w-full flex-col items-center justify-center`}
            onSubmit={handleSubmit(handleLogin)}
          >
            <div className={`flex flex-col w-4/5`}>
              <label className={`text-login text-2xl mb-1`}>Usuario: </label>
              <input
                className={`h-11 rounded-xl pl-2 bg-info outline-none border-jmc-blue border-2 mb-5 text-white hover:opacity-75`}
                {...register("username")}
                name="username"
                type="text"
                placeholder="Digite O Seu Usuario"
                required
                tabIndex={1}
              />
            </div>

            <div className={`flex flex-col w-4/5`}>
              <label className={`text-login text-2xl mb-1`}>Nome Real: </label>
              <input
                className={`h-11 rounded-xl pl-2 bg-info outline-none border-jmc-blue border-2 mb-5 text-white hover:opacity-75`}
                {...register("name")}
                name="name"
                type="text"
                placeholder="Digite Seu Nome"
                required
                tabIndex={2}
              />
            </div>
            <div className={`flex flex-col w-4/5`}>
              <label className={`text-login text-2xl mb-1`}>Email: </label>
              <input
                className={`h-11 rounded-xl pl-2 bg-info outline-none border-jmc-blue border-2 mb-5 text-white hover:opacity-75`}
                {...register("email")}
                name="email"
                type="text"
                placeholder="Digite Seu email"
                required
                tabIndex={3}
              />
            </div>

            <div className={`flex flex-col w-4/5`}>
              <label className={`text-login text-2xl mb-1`}>Senha: </label>
              <input
                className={`h-11 rounded-xl pl-2 bg-info outline-none border-jmc-blue border-2 mb-5 text-white hover:opacity-75`}
                {...register("password")}
                name="password"
                type="password"
                placeholder="Digite A Sua Senha"
                required
                tabIndex={4}
              />
            </div>

            <button
              type="submit"
              className={`h-11 w-9/12 rounded-full pl-2 bg-info outline-none border-jmc-blue border-2 mb-5 text-white hover:opacity-75`}
              tabIndex={3}
            >
              Login
            </button>

            <p className="text-white">
              Já tem uma conta?{" "}
              <strong>
                <Link href={"/"}>Faça Login Aqui</Link>
              </strong>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

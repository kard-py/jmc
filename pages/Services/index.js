import Head from "next/head";
import Header from "../../src/components/Header";
import Card from "../../src/components/Card";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import axios from "axios";
import { AuthContext } from "../../src/contexts/AuthContext";

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
        props: {},
      };
    } else if (result.data.error !== "null" && result.data.status === false) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
        props: {},
      };
    }
  }

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
    props: {},
  };
};

const Assistance = () => {
  const { reloadToken, sToken } = useContext(AuthContext);

  useEffect(() => {
    reloadToken(sToken);
  }, []);

  const router = useRouter();
  return (
    <div className={"flex-1 flex-col"}>
      <Head>
        <title>JMC PAINEL</title>
        <link rel="shortcut icon" href="./favicon.png" />
      </Head>
      <Header />
      <div
        className={
          "flex flex-col items-center justify-center w-full h-full animate-[fade_1s]"
        }
      >
        <Card
          className={`flex-col text-center`}
          onClick={() => {
            router.push("/Services/Create");
          }}
        >
          <h1 className={`font-bold text-lg`}>Nova Requisição</h1>
          <p>Criar Requisição De Serviço</p>
        </Card>
        <Card
          className={`flex-col text-center`}
          onClick={() => {
            router.push("/Services/List");
          }}
        >
          <h1 className={`font-bold text-lg`}>Lista De Requisições</h1>
          <p>Lista Todas as Requisições de Serviços</p>
        </Card>
      </div>
    </div>
  );
};
export default Assistance;

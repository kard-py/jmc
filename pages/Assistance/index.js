import Head from "next/head";
import Header from "../../components/Header";
import Card from "../../components/Card";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";

const Assistance = () => {
  const router = useRouter();
  const { reloadToken, sToken } = useContext(AuthContext);

  useEffect(() => {
    reloadToken(sToken);
  }, []);
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
          className={`flex-col text-center cursor-pointer animate-[fade_1s]`}
          onClick={() => {
            router.push("/Assistance/Create");
          }}
        >
          <h1 className={`font-bold text-lg`}>Nova Requisição</h1>
          <p>Criar Requisição De Assitencia</p>
        </Card>
        <Card
          className={`flex-col text-center cursor-pointer animate-[fade_1s]`}
          onClick={() => {
            router.push("/Assistance/List");
          }}
        >
          <h1 className={`font-bold text-lg`}>Lista De Requisições</h1>
          <p>Lista Todas as Requisições de Assitencia</p>
        </Card>
      </div>
    </div>
  );
};
export default Assistance;

import Head from "next/head";
import Header from "../../../components/Header";
import Card from "../../../components/Card";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import Link from "next/link";
import axios from "axios";

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
      const response = await axios.post(
        `http://${ctx.req.headers.host}/api/Assistance/list/`,
        { token_jwt: token }
      );
      const data = response.data;
      return {
        props: {
          data: data,
        },
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

const List = ({ data }) => {
  const router = useRouter();

  const { reloadToken, sToken } = useContext(AuthContext);

  const [status, setStatus] = useState("EM BETA");

  useEffect(() => {
    reloadToken(sToken);
  }, []);

  const Item = (item, index) => {
    const data = item.dataPrev.split("-");
    let realDate = new Date();
    let ano = realDate.getFullYear();
    let mes = realDate.getMonth() + 1;
    let dia = realDate.getDate();

    realDate = `${dia}/${mes}/${ano}`;

    return (
      <>
        <li
          key={index}
          className="z-0  cursor-pointer flex justify-center items-center"
        >
          <Link href={`/Assistance/List/${item.id}`}>
            <Card className="flex flex-col m-0 mb-5 cursor-pointer items-center w-11/12 h-fit">
              <div className="flex flex-col items-center p-3">
                <p className="text-center cursor-pointer">
                  <strong>{item.id}</strong>
                </p>
                <p className="text-center cursor-pointer m-3">
                  <strong>Cliente: </strong>
                  {item.cliente.cliente.Apelido}
                </p>
                <p className="text-center cursor-pointer m-3">
                  <strong>Serviço: </strong>
                  {item.serviços[0].name}
                </p>
                <p className="text-center cursor-pointer">
                  <strong>Status: </strong>
                  {status}
                </p>
                <p className="text-center cursor-pointer m-3">
                  <strong>Observação: </strong>
                  {item.observacao}
                </p>
                <p className="text-center cursor-pointer">
                  <strong className=" cursor-pointer">Prev. Conclusão: </strong>
                  {`${data[2]}/${data[1]}/${data[0]}`}
                </p>
              </div>
            </Card>
          </Link>
        </li>
      </>
    );
  };
  return (
    <div className={"flex-1 flex-col"}>
      <Head>
        <title>JMC PAINEL</title>
        <link rel="shortcut icon" href="./favicon.png" />
      </Head>
      <Header />
      <div className="flex w-full h-full flex-col items-center justify-center cursor-pointer animate-[fade_1s]">
        <Card
          onClick={() => {
            router.push("/Assistance");
          }}
        >
          <h1 className="select-none">Voltar A Seleção</h1>
        </Card>

        <div className={"flex flex-col items-center justify-center w-full"}>
          <Card className={`flex items-center w-11/12 h-20`}>
            <h1 className={`text-2xl text-stone-800`}>
              <strong>Lista de Solicitações:</strong>
            </h1>
          </Card>

          {/* PC */}
          <Card className=" flex-col w-11/12 flex-1 hidden lg:flex">
            <table>
              <thead className="w-full border-b border-b-gray-300 mb-5 h-10">
                <tr className="flex flex-row h-5">
                  <td className="flex flex-1 justify-center">Id</td>
                  <td className="flex flex-row w-full flex-[7] justify-start">
                    Nome Do Cliente
                  </td>
                  <td className="flex flex-row w-full flex-[3] justify-start">
                    Serviço
                  </td>
                  <td className="flex flex-row w-full flex-[4] justify-center">
                    Status
                  </td>
                  <td className="flex flex-row w-full flex-[25] justify-start">
                    Observação
                  </td>
                  <td className="flex flex-row w-full flex-[4] justify-center">
                    Previsão De Conclusão
                  </td>
                </tr>
              </thead>

              <tbody>
                {data.map((item, i) => {
                  var d2 = item.dataPrev.split("-");
                  let d1 = new Date();
                  let ano = d1.getFullYear();
                  let mes = d1.getMonth() + 1;
                  let dia = d1.getDate();
                  let prazo = `${d2[2]}/${d2[1]}/${d2[0]}`;

                  d1 = new Date(ano, mes, dia);
                  d2 = new Date(d2[0], d2[1], d2[2]);

                  var diff = d2.getTime() - d1.getTime();
                  diff = diff / (1000 * 60 * 60 * 24);

                  return (
                    <>
                      <Link href={`/Assistance/List/${item.id}`}>
                        <tr
                          key={i}
                          className="border-b mb-1 h-10 cursor-pointer flex-row flex items-center"
                        >
                          <td className="flex flex-1 justify-center">
                            {item.id}
                          </td>
                          <td className="flex flex-row w-full flex-[7] justify-center line-clamp-1">
                            {item.cliente.cliente.Apelido}
                          </td>
                          <td className="flex flex-row w-full flex-[3] justify-center line-clamp-1">
                            {item.serviços[0].name}
                          </td>
                          <td className="flex flex-row w-full flex-[4] justify-center">
                            {diff < 0 && "Prazo Finalizado"}
                            {diff == 0 && "Prazo Finaliza Hoje"}
                            {diff == 1 && `Prazo Finaliza amanhã`}
                            {diff > 1 && `Prazo Finaliza em ${diff} dias`}
                          </td>
                          <td className="flex flex-row w-full flex-[25] justify-center line-clamp-1">
                            {item.observacao}
                          </td>
                          <td className="flex flex-row w-full flex-[4] justify-center">
                            {prazo}
                          </td>
                        </tr>
                      </Link>
                    </>
                  );
                })}
              </tbody>
            </table>
          </Card>

          {/* Mobile */}
          <div className="lg:hidden flex flex-1 flex-col w-full justify-center items-center">
            <ul>{data.map((item, index) => Item(item, index))}</ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;

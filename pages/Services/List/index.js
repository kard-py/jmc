import Head from "next/head";
import Header from "../../../components/Header";
import Card from "../../../components/Card";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
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
        `http://${ctx.req.headers.host}/api/Service/list/`,
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

  useEffect(() => {
    reloadToken(sToken);
  }, []);

  const Item = (item, index) => {
    let status = "";
    const data = item.dataPrev.split("-");
    let realDate = new Date();
    let ano = realDate.getFullYear();
    let mes = realDate.getMonth() + 1;
    let dia = realDate.getDate();

    realDate = `${dia}/${mes}/${ano}`;

    if (
      ano > parseInt(data[0]) &&
      mes > parseInt(data[1]) &&
      dia > parseInt(data[2])
    ) {
      status = "Prazo Concluido";
    } else if (
      ano < parseInt(data[0]) &&
      mes < parseInt(data[1]) &&
      dia < parseInt(data[2])
    ) {
      status = "Dentro Prazo";
    } else if (
      ano == parseInt(data[0]) &&
      mes == parseInt(data[1]) &&
      dia == parseInt(data[2])
    ) {
      status = "Prazo Finaliza Hoje";
    }

    return (
      <>
        <li key={index} className="z-0">
          <Link href={`/Services/List/${item.id}`}>
            <Card className="flex flex-col items-center w-11/12 h-fit">
              <div className="flex flex-col items-center p-3">
                <p className="text-center">
                  <strong>{item.id}</strong>
                </p>
                <p className="text-center m-3">
                  <strong>Cliente: </strong>
                  {item.cliente.cliente.Apelido}
                </p>
                <p className="text-center m-3">
                  <strong>Serviço: </strong>
                  {item.serviços[0].name}
                </p>
                <p className="text-center">
                  <strong>Status: </strong>
                  {status}
                </p>
                <p className="text-center m-3">
                  <strong>Observação: </strong>
                  {item.observacao}
                </p>
                <p className="text-center">
                  <strong>Prev. Conclusão: </strong>
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
      <div className="flex w-full h-full flex-col items-center animate-[fade_1s]">
        <Card
          className="cursor-pointer"
          onClick={() => {
            router.push("/Services");
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
                <tr>
                  <td>Id</td>
                  <td>Nome Do Cliente</td>
                  <td>Serviço</td>
                  <td>Status</td>
                  <td>Observação</td>
                  <td>Previsão De Conclusão</td>
                </tr>
              </thead>

              <tbody>
                {data.map((item, i) => {
                  let status = "";
                  const data = item.dataPrev.split("-");
                  let realDate = new Date();
                  let ano = realDate.getFullYear();
                  let mes = realDate.getMonth() + 1;
                  let dia = realDate.getDate();

                  realDate = `${dia}/${mes}/${ano}`;

                  if (
                    ano > parseInt(data[0]) &&
                    mes > parseInt(data[1]) &&
                    dia > parseInt(data[2])
                  ) {
                    status = "Prazo Concluido";
                  } else if (
                    ano < parseInt(data[0]) &&
                    mes < parseInt(data[1]) &&
                    dia < parseInt(data[2])
                  ) {
                    status = "Dentro Prazo";
                  } else if (
                    ano == parseInt(data[0]) &&
                    mes == parseInt(data[1]) &&
                    dia == parseInt(data[2])
                  ) {
                    status = "Prazo Finaliza Hoje";
                  }

                  return (
                    <>
                      <Link href={`/Services/List/${item.id}`}>
                        <tr key={i} className="border-b mb-5 h-10">
                          <td>{item.id}</td>
                          <td>{item.cliente.cliente.Apelido}</td>
                          <td>{item.serviços[0].name}</td>
                          <td>{status}</td>
                          <td>{item.observacao}</td>
                          <td>{`${data[2]}/${data[1]}/${data[0]}`}</td>
                        </tr>
                      </Link>
                    </>
                  );
                })}
              </tbody>
            </table>
          </Card>

          {/* Mobile */}
          <div className="lg:hidden">
            <ul>{data.map((item, index) => Item(item, index))}</ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;

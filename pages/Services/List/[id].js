import Head from "next/head";
import Header from "../../../components/Header";
import Card from "../../../components/Card";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import axios from "axios";

import { CgChevronLeft, CgChevronRight } from "react-icons/cg";

import pdfMake from "pdfmake/build/pdfmake";
import pdfvsf from "pdfmake/build/vfs_fonts";

export const getServerSideProps = async (ctx) => {
  const { "JMC.Auth.token": token } = ctx.req.cookies;
  const id = ctx.query.id;
  if (token && token !== "NOT_AUTH") {
    const result = await axios.post(
      `http://${ctx.req.headers.host}/api/checkToken`,
      {
        token_jwt: token,
      }
    );
    if (result.data.error === "null" && result.data.status === true) {
      const response = await axios.post(
        `http://${ctx.req.headers.host}/api/Service/list/${id}`,
        { token_jwt: token }
      );
      const data = response.data;
      return {
        props: {
          data: data,
          id: id,
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

const List = ({ id, data }) => {
  const router = useRouter();
  const [formatData, setFormatData] = useState(null);

  const { reloadToken, sToken } = useContext(AuthContext);

  useEffect(() => {
    reloadToken(sToken);
    let a = data?.dataPrev.split("-");
    setFormatData(`${a[2]}/${a[1]}/${a[0]}`);
  }, []);

  function genPDF(e) {
    e.preventDefault();
    pdfMake.vfs = pdfvsf.pdfMake.vfs;

    let realDate = new Date();
    let ano = realDate.getFullYear();
    let mes = realDate.getMonth() + 1;
    if (mes < 10) {
      mes = `0${mes}`;
    }

    let dia = realDate.getDate();

    realDate = `${dia}/${mes}/${ano}`;

    let dataPrev = data.dataPrev.split("-");

    dataPrev = `${dataPrev[2]}/${dataPrev[1]}/${dataPrev[0]}`;

    const servs = data.serviços.map((serv, i) => {
      return serv.name;
    });

    const header = [];
    // margin: [left, top, right, bottom]
    const body = [
      {
        text: "Relatorio de Assistencia Tecnica",
        fontSize: 24,
        alignment: "center",
      },
      {
        text: "Informações do Cliente:",
        fontSize: 16,
        alignment: "left",
        margin: [0, 15, 0, 0],
        bold: true,
      },

      {
        table: {
          widths: ["*"],
          body: [
            [`Cliente: ${data.cliente.cliente.Apelido}`],
            [`CNPJ/CPF: ${data.cliente.cliente["CNPJ/CPF"]}`],
            [`Endereço: ${data.cliente.cliente.Endereço}`],
            [`Realizado Em: ${dataPrev}`],
          ],
        },
      },

      {
        text: `Observações:`,
        fontSize: 16,
        margin: [0, 10, 0, 0],
        bold: true,
      },
      {
        table: {
          widths: ["*"],
          body: [[`${data.observacao}`]],
        },
      },

      {
        text: `Serviços realizados:`,
        margin: [0, 10, 0, 0],
        fontSize: 16,
      },
      {
        margin: [0, 5, 0, 0],
        ul: servs,
      },
    ];

    const footer = [];

    const dd = {
      pageSize: "A4",
      pageMargins: [10, 10, 10, 10],
      header: [header],
      content: [body],
      footer: [footer],
    };

    pdfMake.createPdf(dd).open();
  }

  async function handleDelete(e) {
    const res = await axios.post(`/api/Service/delete/${id}`, {
      token_jwt: sToken,
    });

    if (res.data.acknowledged === true && res.data.deletedCount !== 0) {
      alert("Deletado Com Sucesso");

      router.back();
    }
  }

  async function handleEdit(e) {
    e.preventDefault();
    router.push(`/Services/Edit/${id}`);
  }

  const SlideLeft = () => {
    var slider = document.querySelector("#slider");
    slider.scrollLeft = slider.scrollLeft - 500;
  };
  const SlideRight = () => {
    var slider = document.querySelector("#slider");
    slider.scrollLeft = slider.scrollLeft + 500;
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
            router.push("/Services/List");
          }}
        >
          <h1 className="select-none">Voltar A Seleção</h1>
        </Card>

        <Card className="flex-col w-11/12 h-fit hidden lg:flex">
          <div className="w-full mb-5 h-fit flex flex-row flex-wrap content-['']">
            <div className="flex flex-col flex-1 pl-2 h-fit min-h-[320px] border border-gray-300 m-1 content-['']">
              <h1 className="text-2xl m-5">Informações do Cliente:</h1>
              {data?.cliente.cliente["Apelido"] !== "" && (
                <>
                  <div>
                    <h2 className="text-lg text-jmc-blue font-bold">Nome:</h2>
                    <p className="text-sm">
                      {data?.cliente.cliente["Apelido"]}
                    </p>
                  </div>
                  <hr />
                </>
              )}
              {data?.cliente.cliente["CNPJ/CPF"] !== "" && (
                <>
                  <div>
                    <h2 className="text-mg text-jmc-blue font-bold">
                      CNPJ/CPF:
                    </h2>
                    <p className="text-sm">
                      {data?.cliente.cliente["CNPJ/CPF"]}
                    </p>
                  </div>
                  <hr />
                </>
              )}
              {data?.cliente.cliente["Endereço"] !== "" && (
                <>
                  <div>
                    <h2 className="text-mg text-jmc-blue font-bold">
                      Endereço:
                    </h2>
                    <p className="text-sm">
                      {data?.cliente.cliente["Endereço"]}
                    </p>
                  </div>
                  <hr />
                </>
              )}
              {data?.cliente.cliente["Email"] !== "" && (
                <>
                  <div>
                    <h2 className="text-mg text-jmc-blue font-bold">Email:</h2>
                    <p className="text-sm">{data?.cliente.cliente["Email"]}</p>
                  </div>
                  <hr />
                </>
              )}
              {data?.cliente.cliente["Telefone"] !== "" && (
                <>
                  <div>
                    <h2 className="text-mg text-jmc-blue font-bold">
                      Telefone:
                    </h2>
                    <p className="text-sm">
                      {data?.cliente.cliente["Telefone"]}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col flex-[2] min-h-[320px] pl-2 h-fit border border-gray-300 m-1 content-['']">
              <h1 className="text-2xl m-5">Informações da Assistencia:</h1>
              <div>
                <span className="text-lg text-jmc-blue font-bold">
                  Requisção numero:
                </span>
                <p>{id}</p>
              </div>

              <div>
                <span className="text-lg text-jmc-blue font-bold">
                  Previsão De Conclusão:
                </span>
                <p>{formatData}</p>
              </div>

              <div className="w-full flex flex-col items-center">
                <span className="w-full text-lg text-jmc-blue font-bold">
                  Observação:
                </span>
                <textarea
                  className="w-full h-20 resize-none mr-1 mb-5 focus:outline-none"
                  value={data?.observacao}
                  readOnly
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col min-h-[320px] h-fit border border-gray-300 m-1 content-['']">
              <h1 className="text-2xl my-5 ml-7 mr-5">Opções:</h1>
              <div className="w-full h-full items-center mb-5 flex flex-1 flex-col">
                <button
                  className="bg-jmc-blue p-1 w-3/5 h-10 mb-2 rounded-lg text-white font-semibold min-w-[120px]"
                  onClick={(e) => {
                    handleEdit(e);
                  }}
                >
                  Editar
                </button>
                <button
                  className="bg-jmc-blue w-3/5 h-fit min-h-[40px] mb-2 rounded-lg text-white font-semibold min-w-[120px]"
                  onClick={(e) => {
                    genPDF(e);
                  }}
                >
                  Baixar PDF
                </button>

                <button
                  className="bg-jmc-blue w-3/5 h-fit min-h-[40px] rounded-lg text-white font-semibold min-w-[120px]"
                  onClick={(e) => {
                    handleDelete(e);
                  }}
                >
                  EXCLUIR
                </button>
              </div>
            </div>
          </div>

          <div className="relative flex items-center">
            <div
              className="w-16 h-16 opacity-50 hover:opacity-100 duration-300 ease-in-out"
              onClick={() => {
                SlideLeft();
              }}
            >
              <CgChevronLeft className="w-full h-full cursor-pointer" />
            </div>

            <div
              id="slider"
              className="w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth overflow-y-hidden"
            >
              {data !== null &&
                data["serviços"].map((serv, i) => (
                  <div
                    key={i}
                    className="inline-block w-64 m-2 hover:scale-110 ease-in-out duration-300"
                  >
                    <Card className="bg-slate-50 flex flex-col items-center w-64 h-80 mr-5 whitespace-normal">
                      <h1 className="w-full text-center h-11 mb-5 font-bold opacity-70">
                        {serv.name}
                      </h1>
                      {serv.descricao !== "" ? (
                        <div className="w-full h-72 overflow-hidden text-ellipsis">
                          <span className="text-jmc-blue">Descrição:</span>
                          <textarea
                            className="opacity-50 w-full h-36 bg-slate-50 resize-none focus:outline-none"
                            value={serv.descricao}
                            readOnly
                          />
                        </div>
                      ) : (
                        <div className="w-full h-72 overflow-hidden text-ellipsis"></div>
                      )}
                      <div className="w-full">
                        <span className="text-jmc-blue">Valor:</span>
                        <p className="text-green-400">{serv.total}</p>
                      </div>
                    </Card>
                  </div>
                ))}
            </div>

            <div
              className="w-16 h-16 opacity-50 hover:opacity-100 duration-300 ease-in-out"
              onClick={() => {
                SlideRight();
              }}
            >
              <CgChevronRight className="w-full h-full cursor-pointer" />
            </div>
          </div>
        </Card>

        <Card className="flex-col w-11/12 h-fit flex lg:hidden">
          <div className="w-full mb-5 h-fit flex flex-row flex-wrap content-['']">
            <div className="flex flex-col flex-1 pl-2 h-fit border border-gray-300 m-1 content-['']">
              <h1 className="text-2xl m-5">Informações do Cliente:</h1>
              {data?.cliente.cliente["Apelido"] !== "" && (
                <>
                  <div>
                    <h2 className="text-lg text-jmc-blue font-bold">Nome:</h2>
                    <p className="text-sm">
                      {data?.cliente.cliente["Apelido"]}
                    </p>
                  </div>
                  <hr />
                </>
              )}
              {data?.cliente.cliente["CNPJ/CPF"] !== "" && (
                <>
                  <div>
                    <h2 className="text-mg text-jmc-blue font-bold">
                      CNPJ/CPF:
                    </h2>
                    <p className="text-sm">
                      {data?.cliente.cliente["CNPJ/CPF"]}
                    </p>
                  </div>
                  <hr />
                </>
              )}
              {data?.cliente.cliente["Endereço"] !== "" && (
                <>
                  <div>
                    <h2 className="text-mg text-jmc-blue font-bold">
                      Endereço:
                    </h2>
                    <p className="text-sm">
                      {data?.cliente.cliente["Endereço"]}
                    </p>
                  </div>
                  <hr />
                </>
              )}
              {data?.cliente.cliente["Email"] !== "" && (
                <>
                  <div>
                    <h2 className="text-mg text-jmc-blue font-bold">Email:</h2>
                    <p className="text-sm">{data?.cliente.cliente["Email"]}</p>
                  </div>
                  <hr />
                </>
              )}
              {data?.cliente.cliente["Telefone"] !== "" && (
                <>
                  <div>
                    <h2 className="text-mg text-jmc-blue font-bold">
                      Telefone:
                    </h2>
                    <p className="text-sm">
                      {data?.cliente.cliente["Telefone"]}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col flex-[2] pl-2 h-fit border border-gray-300 m-1 content-['']">
              <h1 className="text-2xl m-5">Informações da Assistencia:</h1>
              <div>
                <span className="text-lg text-jmc-blue font-bold">
                  Requisção numero:
                </span>
                <p>{id}</p>
              </div>

              <div>
                <span className="text-lg text-jmc-blue font-bold">
                  Previsão De Conclusão:
                </span>
                <p>{formatData}</p>
              </div>

              <div className="w-full flex flex-col items-center">
                <span className="w-full text-lg text-jmc-blue font-bold">
                  Observação:
                </span>
                <textarea
                  className="w-full h-20 resize-none mr-1 mb-5 focus:outline-none"
                  value={data?.observacao}
                  readOnly
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col h-fit border border-gray-300 m-1 content-['']">
              <h1 className="text-2xl my-5 ml-7 mr-5">Opções:</h1>
              <div className="w-full h-full items-center mb-5 flex flex-1 flex-col ">
                <button
                  className="bg-jmc-blue p-1 w-3/5 h-10 mb-2 rounded-lg text-white font-semibold min-w-[120px]"
                  onClick={(e) => {
                    handleEdit(e);
                  }}
                >
                  Editar
                </button>
                <button
                  className="bg-jmc-blue w-3/5 h-fit min-h-[40px] mb-2 rounded-lg text-white font-semibold min-w-[120px]"
                  onClick={(e) => {
                    genPDF(e);
                  }}
                >
                  Baixar PDF
                </button>

                <button
                  className="bg-jmc-blue w-3/5 h-fit min-h-[40px] rounded-lg text-white font-semibold min-w-[120px]"
                  onClick={(e) => {
                    handleDelete(e);
                  }}
                >
                  EXCLUIR
                </button>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center w-full">
            <div
              id="slider"
              className="w-full h-full items-center flex flex-col justify-center z-10 scroll-smooth"
            >
              {data !== null &&
                data["serviços"].map((serv, i) => (
                  <div
                    key={i}
                    className="w-64 hover:scale-110 ease-in-out duration-300"
                  >
                    <Card className="bg-slate-50 m-0 mb-5 -z-50 flex flex-col items-center w-64 h-80 whitespace-normal">
                      <h1 className="w-full text-center h-11 mb-5 font-bold opacity-70">
                        {serv.name}
                      </h1>
                      {serv.descricao !== "" ? (
                        <div className="w-full h-72 overflow-hidden text-ellipsis">
                          <span className="text-jmc-blue">Descrição:</span>
                          <textarea
                            className="opacity-50 w-full h-36 bg-slate-50 resize-none focus:outline-none"
                            value={serv.descricao}
                            readOnly
                          />
                        </div>
                      ) : (
                        <div className="w-full h-72 overflow-hidden text-ellipsis"></div>
                      )}
                      <div className="w-full">
                        <span className="text-jmc-blue">Valor:</span>
                        <p className="text-green-400">{serv.total}</p>
                      </div>
                    </Card>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default List;

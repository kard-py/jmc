import Head from "next/head";
import Header from "../../../components/Header";
import Card from "../../../components/Card";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import axios from "axios";

import { CgChevronLeft, CgChevronRight } from "react-icons/cg";

import jsPDF from "jspdf";

import { logo } from "../../../services/image";

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
        `http://${ctx.req.headers.host}/api/Assistance/list/${id}`,
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
  const categorias = [
    "ASSISTÊNCIA TÉCNICA",
    "PAINÉIS ELÉTRICOS",
    "INSTALAÇÕES DE BAIXA TENSÃO",
    "PROJETOS ELÉTRICOS",
    "AUTOMAÇÃO",
    "CONSULTORIA NA FATURA DE ENERGIA",
    "DESCONTO",
    "INSTALAÇÕES DE MÉDIA TENSÃO",
    "ESTUDO DE PROTEÇÃO",
    "SERVIÇOS DE ENGENHARIA",
    "CONSULTORIA",
    "OBRA",
    "PARAMETRIZAÇÃO DE RELE",
    "REVISÃO DE PAINÉIS ELÉTRICOS",
  ];

  useEffect(() => {
    reloadToken(sToken);
    let a = data?.dataPrev.split("-");
    setFormatData(`${a[2]}/${a[1]}/${a[0]}`);
  }, []);

  async function genPDF(e) {
    e.preventDefault();

    var addrs = data?.cliente.cliente["Endereço"].split(",");
    var doc = new jsPDF("p", "px", "a4", false);
    var width = doc.internal.pageSize.getWidth();
    var height = doc.internal.pageSize.getHeight();

    doc.setFontSize(20);

    doc.addImage(logo, "PNG", 10, 5, 40, 25, "");

    doc.text(
      "JMC Automações",
      doc.internal.pageSize.width / 2,
      22,
      null,
      null,
      "center"
    );
    // doc.line(10, 25, width - 10, 25);
    doc.setFontSize(14);
    doc.text("Informações do Cliente:", 20, 43);
    doc.setFontSize(11);
    doc.text(`• Nome: ${data?.cliente.cliente["Apelido"]}`, 25, 58);
    doc.text(`• CPF/CNPJ: ${data?.cliente.cliente["CNPJ/CPF"]}`, 25, 73);
    doc.text(`• Endereço: ${addrs[0]}`, 25, 88);
    doc.text(`• Email: ${data?.cliente.cliente["Email"]}`, 25, 103);
    doc.text(`• Telefone: ${data?.cliente.cliente["Telefone"]}`, 25, 118);
    // doc.line(10, 120, width - 10, 120);

    doc.setFontSize(14);
    doc.text(
      "Tipo de Serviço:",
      doc.internal.pageSize.width / 2,
      140,
      null,
      null,
      "center"
    );
    doc.setFontSize(11);

    for (let i = 0; i < categorias.length; i++) {
      const cat = categorias[i];

      if (cat === data["serviços"][0].categoria) {
        console.log(cat);
        if (cat === categorias[0]) {
          const option =
            "[X] - Assistência Técnica            [  ] - Instalação            [  ] - Painel            [  ] - Automação";

          doc.text(
            option,
            doc.internal.pageSize.width / 2,
            155,
            null,
            null,
            "center"
          );

          break;
        } else if (cat === categorias[1]) {
          const option =
            "[  ] - Alta Tensão            [  ] - Instalação            [X] - Painel            [  ] - Automação";
          doc.text(
            option,
            doc.internal.pageSize.width / 2,
            155,
            null,
            null,
            "center"
          );

          break;
        } else if (cat === categorias[2]) {
          const option =
            "[  ] - Alta Tensão            [X] - Instalação            [  ] - Painel            [  ] - Automação";
          doc.text(
            option,
            doc.internal.pageSize.width / 2,
            155,
            null,
            null,
            "center"
          );

          break;
        } else if (cat === categorias[3]) {
          const option =
            "[  ] - Alta Tensão            [  ] - Instalação            [  ] - Painel            [X] - Automação";
          doc.text(
            option,
            doc.internal.pageSize.width / 2,
            155,
            null,
            null,
            "center"
          );

          break;
        } else if (cat === categorias[4]) {
          const option =
            "[  ] - Alta Tensão            [  ] - Instalação            [  ] - Painel            [X] - Automação";
          doc.text(
            option,
            doc.internal.pageSize.width / 2,
            155,
            null,
            null,
            "center"
          );

          break;
        } else if (cat === categorias[5]) {
          const option =
            "[  ] - Alta Tensão            [  ] - Instalação            [  ] - Painel            [  ] - Automação";
          doc.text(
            option,
            doc.internal.pageSize.width / 2,
            155,
            null,
            null,
            "center"
          );

          break;
        } else if (cat === categorias[6]) {
          const option =
            "[  ] - Alta Tensão            [  ] - Instalação            [  ] - Painel            [  ] - Automação";
          doc.text(
            option,
            doc.internal.pageSize.width / 2,
            155,
            null,
            null,
            "center"
          );

          break;
        } else if (cat === categorias[7]) {
          const option =
            "[  ] - Alta Tensão            [X] - Instalação            [  ] - Painel            [  ] - Automação";
          doc.text(
            option,
            doc.internal.pageSize.width / 2,
            155,
            null,
            null,
            "center"
          );

          break;
        } else if (cat === categorias[8]) {
          const option =
            "[  ] - Alta Tensão            [  ] - Instalação            [  ] - Painel            [  ] - Automação";
          doc.text(
            option,
            doc.internal.pageSize.width / 2,
            155,
            null,
            null,
            "center"
          );

          break;
        } else if (cat === categorias[9]) {
          const option =
            "[  ] - Alta Tensão            [  ] - Instalação            [  ] - Painel            [X] - Automação";
          doc.text(
            option,
            doc.internal.pageSize.width / 2,
            155,
            null,
            null,
            "center"
          );

          break;
        } else if (cat === categorias[10]) {
          const option =
            "[  ] - Alta Tensão            [  ] - Instalação            [  ] - Painel            [  ] - Automação";
          doc.text(
            option,
            doc.internal.pageSize.width / 2,
            155,
            null,
            null,
            "center"
          );

          break;
        } else if (cat === categorias[11]) {
          const option =
            "[  ] - Alta Tensão            [X] - Instalação            [  ] - Painel            [  ] - Automação";
          doc.text(
            option,
            doc.internal.pageSize.width / 2,
            155,
            null,
            null,
            "center"
          );

          break;
        } else if (cat === categorias[12]) {
          const option =
            "[  ] - Alta Tensão            [X] - Instalação            [  ] - Painel            [  ] - Automação";
          break;
        } else if (cat === categorias[13]) {
          const option =
            "[  ] - Alta Tensão            [  ] - Instalação            [X] - Painel            [  ] - Automação";
          doc.text(
            option,
            doc.internal.pageSize.width / 2,
            155,
            null,
            null,
            "center"
          );

          break;
        }
      }
    }

    doc.setFontSize(14);
    doc.text("Observações:", 20, 170);

    let obs = data.observacao;
    doc.setFontSize(11);
    doc.text(obs, 20, 180, { maxWidth: width - 25 });

    doc.setFontSize(14);
    doc.text("Serviços Realizados:", 20, 300);

    data["serviços"].map((ser, i) => {
      let line = i * 10;
      doc.setFontSize(11);
      doc.text(`${i + 1} - ${ser.name}`, 25, 315 + line);
    });

    let end_list = data["serviços"].length * 10;
    end_list = end_list + 315;
    end_list = end_list + 100;

    if (end_list < height - 70) {
      end_list = height - 70;
    }

    doc.setFontSize(14);
    doc.text("Assinaturas:", 20, end_list);

    doc.setFontSize(11);
    doc.text("Cargo: Encarregado", 20, end_list + 40);

    doc.line(20, end_list + 30, width - 20, end_list + 30);

    doc.text(`Nome: ${data?.encaregado.nome}`, 20, end_list + 25);

    doc.text(`CPF: ${data?.encaregado.cpf}`, 20, end_list + 15);

    doc.output("dataurlnewwindow");
  }

  async function handleDelete(e) {
    const res = await axios.post(`/api/Assistance/delete/${id}`, {
      token_jwt: sToken,
    });

    if (res.data.acknowledged === true && res.data.deletedCount !== 0) {
      alert("Deletado Com Sucesso");

      router.back();
    }
  }

  async function handleEdit(e) {
    e.preventDefault();
    router.push(`/Assistance/Edit/${id}`);
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
          onClick={() => {
            router.push("/Assistance/List");
          }}
        >
          <h1 className="select-none">Voltar A Seleção</h1>
        </Card>

        <Card className="flex-col w-11/12 h-fit hidden lg:flex">
          <div className="w-full mb-5 h-fit flex xl:flex-row flex-col flex-wrap content-['']">
            <div
              id="cliente"
              className="flex flex-col flex-1 pl-2 min-h-[320px] h-fit border border-gray-300 m-1 content-['']"
            >
              <h1 className="text-2xl m-5">Informações do Cliente:</h1>
              {data?.cliente.cliente["Apelido"] !== "" && (
                <>
                  <div>
                    <h2 className="text-lg text-jmc-blue font-bold">Nome:</h2>
                    <p className="text-sm">
                      {data?.cliente.cliente["Apelido"]}
                    </p>
                  </div>
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
                </>
              )}
              {data?.cliente.cliente["Email"] !== "" && (
                <>
                  <div>
                    <h2 className="text-mg text-jmc-blue font-bold">Email:</h2>
                    <p className="text-sm">{data?.cliente.cliente["Email"]}</p>
                  </div>
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
              <div className="flex flex-row">
                <div className="flex-col flex flex-1">
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
                </div>
                <div className="flex-col flex flex-1">
                  <div>
                    <span className="text-lg text-jmc-blue font-bold">
                      Nome Do Encaregado:
                    </span>
                    <p>{data?.encaregado.nome}</p>
                  </div>

                  <div>
                    <span className="text-lg text-jmc-blue font-bold">
                      CPF:
                    </span>
                    <p>{data?.encaregado.cpf}</p>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col items-center">
                <span className="w-full text-lg text-jmc-blue font-bold">
                  Observação:
                </span>
                <textarea
                  className="w-full h-20 resize-none mr-1 mb-5 focus:outline-none"
                  value={data?.observacao.replace(",", ",\n")}
                  readOnly
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col min-h-[320px] h-fit border border-gray-300 m-1 content-['']">
              <h1 className="text-2xl my-5 ml-7 mr-5">Opções:</h1>
              <div className="w-full h-full items-center justify-center flex flex-1 flex-col ">
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
                data["serviços"].map((serv, i) => {
                  if (serv.service !== "0") {
                    return (
                      <div className="inline-block w-64 m-2 hover:scale-110 ease-in-out duration-300">
                        <Card
                          key={i}
                          className="bg-slate-50 flex flex-col items-center w-64 h-80 mr-5 whitespace-normal"
                        >
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
                    );
                  }
                })}
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

        <Card id="content" className="flex-col w-11/12 h-fit flex lg:hidden">
          <div className="w-full mb-5 h-fit flex flex-col flex-wrap content-['']">
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

              <div>
                <span className="text-lg text-jmc-blue font-bold">
                  Nome Do Encaregado:
                </span>
                <p>{data?.encaregado.nome}</p>
              </div>

              <div>
                <span className="text-lg text-jmc-blue font-bold">CPF:</span>
                <p>{data?.encaregado.cpf}</p>
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
              <div className="w-full h-full items-center mb-5 flex flex-col ">
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
                data["serviços"].map((serv, i) => {
                  if (serv.service !== "0") {
                    return (
                      <div className="w-64 hover:scale-110 ease-in-out duration-300">
                        <Card
                          key={i}
                          className="bg-slate-50 m-0 mb-5 -z-50 flex flex-col items-center w-64 h-80 whitespace-normal"
                        >
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
                    );
                  }
                })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default List;

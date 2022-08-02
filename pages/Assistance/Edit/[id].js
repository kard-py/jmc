import Head from "next/head";
import Header from "../../../components/Header";
import Card from "../../../components/Card";
import { useContext, useEffect, useState } from "react";
import { MdOutlineAdd } from "react-icons/md";
import { useRouter } from "next/router";
import { AuthContext } from "../../../contexts/AuthContext";
import { useForm } from "react-hook-form";

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
        `http://${ctx.req.headers.host}/api/Assistance/list/${ctx.query.id}`,
        { token_jwt: token }
      );
      const clientes = await axios.post(
        `http://${ctx.req.headers.host}/api/data/clientes`
      );
      const servicos = await axios.post(
        `http://${ctx.req.headers.host}/api/data/servicos`
      );

      return {
        props: {
          clientes: clientes.data,
          servicos: servicos.data,
          dataObj: response.data,
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

const Create = ({ dataObj, clientes, servicos }) => {
  const { register, handleSubmit } = useForm();
  const [assistance, setAssistance] = useState(servicos);
  const [id, setId] = useState();
  const [data, setData] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [encaregado, setEncaregado] = useState("");
  const [encaregadoCPF, setEncaregadoCPF] = useState("");
  const [cliente, setCliente] = useState({
    cliente: {},
    index: "",
  });
  const [obs, setObs] = useState("");
  const [services, setServices] = useState([
    {
      id: "",
      service: "0",
      name: "",
      inicio: "",
      desconto_Porcentagem: "",
      desconto: "",
      final: "",
      descricao: "",
      total: "",
      valor: "",
    },
  ]);

  const { reloadToken, sToken } = useContext(AuthContext);

  useEffect(() => {
    console.log();
    setId(dataObj.id);
    setCliente(dataObj.cliente);
    setData(dataObj.dataPrev);
    setEmpresa(dataObj.empresa);
    setObs(dataObj.observacao);
    setServices(dataObj.serviços);
    console.log(services);
  }, []);

  useEffect(() => {
    reloadToken(sToken);
  }, []);

  const handleChangeService = (e, index) => {
    e.preventDefault();
    services[index].service = e.currentTarget.value;
    services[index].name = assistance[e.currentTarget.value].Nome;
    services[index].descricao =
      assistance[parseInt(e.currentTarget.value)].Descrição;
    services[index].id = "";
    services[index].inicio = "";
    services[index].final = "";
    services[index].desconto = "";
    services[index].desconto_Porcentagem = "";
    services[index].total = "";
    services[index].valor = "";
    services[index].categoria =
      assistance[parseInt(e.currentTarget.value)].Categoria;
    setServices([...services]);
  };

  const handleAddService = (e) => {
    e.preventDefault();
    setServices([
      ...services,
      {
        id: "",
        service: "0",
        name: "",
        inicio: "",
        desconto: "",
        desconto_Porcentagem: "",
        final: "",
        descricao: "",
        valor: "",
        total: "",
        categoria: "",
      },
    ]);
  };

  const subTotal = (index, desconto_type) => {
    if (services[index].name.includes("HH")) {
      var inicio = services[index].inicio;
      var final = services[index].final;

      inicio = inicio.split(":");
      final = final.split(":");

      const horas = final[0] - inicio[0];
      const minutos = final[1] - inicio[1];
      const time = `${horas < 10 ? "0" + horas : horas}:${
        minutos < 10 ? "0" + minutos : minutos
      }`;

      let hminute = minutos / 60;
      let time_total = horas + hminute;

      if (services[index].service !== "") {
        const service_id = services[index].service;
        const service_preco = assistance[parseInt(service_id)].Preço;
        let subTotal = service_preco * time_total;
        if (services[index].desconto !== "") {
          subTotal = subTotal - parseFloat(services[index].desconto);
        } else if (services[index].desconto_Porcentagem !== "") {
          let porcent = parseInt(services[index].desconto_Porcentagem);
          porcent = porcent / 100;
          let desconto = subTotal * porcent;
          subTotal = subTotal - desconto;
        }
        services[index].total = subTotal.toFixed(2).toString();
      }
    } else {
      let subTotal = parseInt(services[index].valor);
      if (services[index].desconto !== "") {
        subTotal = subTotal - parseFloat(services[index].desconto);
      } else if (services[index].desconto_Porcentagem !== "") {
        let porcent = parseInt(services[index].desconto_Porcentagem);
        porcent = porcent / 100;
        let desconto = subTotal * porcent;
        subTotal = subTotal - desconto;
      }
      services[index].total = subTotal.toFixed(2).toString();
    }

    setServices([...services]);
  };

  const handleRemoveService = (e, item, index) => {
    services.splice(index, 1);
    setServices([...services]);
  };

  async function handleSubmitForm(e) {
    e.preventDefault();
    const payload = {
      id: id,
      dataPrev: data,
      empresa: empresa,
      cliente: cliente,
      observacao: obs,
      serviços: services,
      encaregado: { nome: encaregado, cpf: encaregadoCPF },
    };

    const response = await axios.post("/api/Assistance/edit", {
      token_jwt: sToken,
      payload,
    });
    if (response.status === 200) {
      router.back();
    }
  }

  const router = useRouter();

  return (
    <div className={"flex-1 flex-col"}>
      <Head>
        <title>JMC PAINEL</title>
        <link rel="shortcut icon" href="./favicon.png" />
      </Head>
      <Header />
      <div className="flex w-full h-screen flex-col items-center animate-[fade_1s]">
        <Card
          onClick={() => {
            router.back();
          }}
        >
          <h1
            className="select
          required={true}-none"
          >
            Voltar A Seleção
          </h1>
        </Card>
        <Card className={"w-11/12 h-fit flex-col items-center"}>
          <h1 className={`font-bold text-lg text-center mb-5`}>
            Nova Requisição:
          </h1>
          <hr className=" bg-zinc-500 w-full h-0.5 mb-3" />
          <form
            className="flex-row flex w-full h-full flex-wrap"
            onSubmit={handleSubmitForm}
          >
            <div className="flex-row flex justify-center items-center w-full h-fit flex-wrap">
              {/* ID */}
              <div className="flex flex-col w-72 px-3">
                <span
                  className={`text-lg ${
                    id !== "" ? "text-green-500" : "text-neutral-500"
                  }`}
                >
                  Numero da Requisição:
                </span>
                <input
                  required={true}
                  name="id"
                  type="number"
                  value={id}
                  disabled
                  onChange={(e) => {
                    setId(e.currentTarget.value);
                  }}
                  className={`w-full border-2 p-2 rounded-md h-8 ${
                    id !== "" ? "border-green-500" : "border-neutral-500"
                  } focus:shadow-none focus:outline-none focus:border-blue-400 `}
                />
              </div>
              {/* Data */}
              <div className="flex flex-col w-72 px-3">
                <span
                  className={`text-lg ${
                    data !== "" ? "text-green-500" : "text-neutral-500"
                  }`}
                >
                  Previsão Para Concluir:
                </span>
                <input
                  required={true}
                  name="data"
                  type="date"
                  value={data}
                  onChange={(e) => {
                    setData(e.currentTarget.value);
                  }}
                  className={`w-full border-2 p-2 rounded-md h-8 ${
                    data !== "" ? "border-green-500" : "border-neutral-500"
                  } focus:shadow-none focus:outline-none focus:border-blue-400 `}
                />
              </div>
              {/* Empresa */}
              <div className="flex flex-col w-96 px-3">
                <span
                  className={`text-lg ${
                    empresa !== "" ? "text-green-500" : "text-neutral-500"
                  }`}
                >
                  Empresa:
                </span>
                <select
                  required={true}
                  name="empresa"
                  value={empresa}
                  onChange={(e) => {
                    setEmpresa(e.currentTarget.value);
                  }}
                  id="empresa"
                  className={`w-full h-8 rounded-md border-2 ${
                    empresa !== "" ? "border-green-500" : "border-neutral-500"
                  } focus:shadow-none focus:outline-none focus:border-blue-400`}
                >
                  <option></option>
                  <option value="1">JMC Automação Industrial</option>
                  <option value="2">JMC Automação Eletronica</option>
                </select>
              </div>
              {/* Cliente */}
              <div className="flex flex-col w-96 px-3">
                <span
                  className={`text-lg ${
                    cliente.index !== "" ? "text-green-500" : "text-neutral-500"
                  }`}
                >
                  Cliente:
                </span>
                <select
                  required={true}
                  name="cliente"
                  value={cliente.index}
                  onChange={(e) => {
                    setCliente({
                      cliente: clientes[parseInt(e.currentTarget.value)],
                      index: e.currentTarget.value,
                    });
                  }}
                  id="cliente"
                  className={`w-full h-8 rounded-md border-2 ${
                    cliente.index !== ""
                      ? "border-green-500"
                      : "border-neutral-500"
                  } focus:shadow-none focus:outline-none focus:border-blue-400`}
                >
                  <option></option>
                  {clientes.map((cliente, index) => (
                    <option key={index} value={index}>
                      {cliente.Apelido}
                    </option>
                  ))}
                </select>
              </div>

              {/* Observação */}
              <div className="flex basis-10/12 flex-col px-3">
                <span
                  className={`text-lg ${
                    obs !== "" ? "text-green-500" : "text-neutral-500"
                  }`}
                >
                  Observação:
                </span>
                <textarea
                  name="Obs"
                  id="obs"
                  cols={30}
                  rows={10}
                  className={`p-2 rounded-md border-2 ${
                    obs !== "" ? "border-green-500" : "border-neutral-500"
                  } focus:shadow-none focus:outline-none focus:border-blue-400`}
                  onChange={(e) => {
                    setObs(e.currentTarget.value);
                  }}
                  value={obs}
                />
              </div>
            </div>

            <hr className="my-5 bg-zinc-500 w-full h-0.5" />

            <div className="flex-col flex justify-start w-full h-fit flex-wrap">
              <div className="flex flex-row justify-between items-center">
                <h1 className="font-bold text-2xl mb-5">Serviços:</h1>
                <div
                  className="flex flex-row items-center bg-neutral-800 p-2 hover:opacity-40 duration-150"
                  onClick={(e) => {
                    handleAddService(e);
                  }}
                >
                  <label
                    className="text-white mr-1 select
                  required={true}-none cursor-pointer"
                  >
                    {" "}
                    Adicionar Novo Serviço
                  </label>
                  <MdOutlineAdd size={25} color="white" />
                </div>
              </div>

              <div className="flex flex-wrap w-full flex-col px-3 items-center justify-center ">
                <div className="flex flex-row flex-wrap w-full">
                  <div className="flex w-full items-center mb-5 p-5 h-fit flex-wrap">
                    <hr className="my-5 bg-zinc-500 w-full h-0.5" />
                    {services?.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col w-full max-w-lg p-2 h-fit items-center border-2 border-neutral-500 rounded-md m-2"
                      >
                        {/* Serviço */}
                        <div className="flex flex-row w-full justify-center min-w-fit m-5">
                          <div className={`flex mr-2 w-full flex-col`}>
                            <span
                              className={`text-xl font-bold text-center mb-5 ${
                                item.service !== "0"
                                  ? "text-green-500"
                                  : "text-neutral-500"
                              } ${
                                item.service !== ""
                                  ? "text-green-500"
                                  : "text-neutral-500"
                              }`}
                            >{`Serviço - ${index + 1}`}</span>

                            <select
                              name="servico"
                              id="servico"
                              value={item.service}
                              required={true}
                              onChange={(e) => {
                                handleChangeService(e, index);
                              }}
                              className={`${
                                item.service !== "0"
                                  ? "text-green-500"
                                  : "text-neutral-500"
                              } ${
                                item.service !== ""
                                  ? "text-green-500"
                                  : "text-neutral-500"
                              } w-full h-10 rounded-md border-2 ${
                                item.service !== "0"
                                  ? "border-green-500"
                                  : "border-neutral-500"
                              } ${
                                item.service !== ""
                                  ? "border-green-500"
                                  : "border-neutral-500"
                              } focus:shadow-none focus:outline-none focus:border-blue-400`}
                            >
                              {assistance.map((serv, i) => (
                                <option key={i} value={i}>
                                  {`${serv.Nome}`}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        {services[index].service !== "0" ? (
                          <>
                            {services[index].descricao !== "" && (
                              <>
                                <div className="flex flex-col h-fit p-5 w-full items-center">
                                  <span
                                    className={`text-lg ${
                                      item.descricao !== ""
                                        ? "text-green-500"
                                        : "text-neutral-500"
                                    } text-center`}
                                  >
                                    Descrição
                                  </span>

                                  <textarea
                                    required={true}
                                    disabled={true}
                                    className={`flex p-2  w-full justify-center items-center border-2 ${
                                      item.descricao !== ""
                                        ? "border-green-500"
                                        : "border-neutral-500"
                                    } rounded-md hover:border-blue-400 focus:outline-none focus:shadow-none `}
                                    name="descricao"
                                    cols={50}
                                    rows={4}
                                    value={item.descricao}
                                    onChange={(e) => {
                                      e.preventDefault();
                                      services[index].descricao =
                                        e.currentTarget.value;
                                      setServices([...services]);
                                    }}
                                  ></textarea>
                                </div>
                              </>
                            )}

                            {services[index].name.includes("HH") ? (
                              <>
                                {/* Horas */}
                                <div className="flex flex-col items-center h-fit w-full px-3 m-5">
                                  <span
                                    className={`${
                                      item.inicio !== "" && item.final !== ""
                                        ? "text-green-500"
                                        : "text-neutral-500"
                                    } text-lg`}
                                  >
                                    Horrario
                                  </span>
                                  <div className="flex flex-row w-full justify-around">
                                    <div className="flex flex-col">
                                      <span
                                        className={`${
                                          item.inicio !== ""
                                            ? "text-green-500"
                                            : "text-neutral-500"
                                        } mr-2 text-lg`}
                                      >
                                        Inicio
                                      </span>
                                      <input
                                        required={true}
                                        name="inicio"
                                        type="time"
                                        value={item.inicio}
                                        onChange={(e) => {
                                          e.preventDefault();
                                          services[index].inicio =
                                            e.currentTarget.value;
                                          setServices([...services]);
                                        }}
                                        className={`w-24 border-2 p-2 rounded-md mb-2 ${
                                          item.inicio !== ""
                                            ? "border-green-500"
                                            : "border-neutral-500"
                                        } ${
                                          item.inicio !== ""
                                            ? "text-green-500"
                                            : "text-neutral-500"
                                        } focus:shadow-none focus:outline-none focus:border-blue-400 `}
                                      />
                                    </div>
                                    <div className="flex flex-col">
                                      <span
                                        className={`${
                                          item.final !== ""
                                            ? "text-green-500"
                                            : "text-neutral-500"
                                        } mr-2 text-lg`}
                                      >
                                        Final
                                      </span>
                                      <input
                                        required={true}
                                        name="final"
                                        type="time"
                                        value={item.final}
                                        onChange={(e) => {
                                          e.preventDefault();
                                          services[index].final =
                                            e.currentTarget.value;
                                          setServices([...services]);
                                          subTotal(index);
                                        }}
                                        className={`w-24 border-2 p-2 rounded-md ${
                                          item.final !== ""
                                            ? "border-green-500"
                                            : "border-neutral-500"
                                        } ${
                                          item.final !== ""
                                            ? "text-green-500"
                                            : "text-neutral-500"
                                        } focus:shadow-none focus:outline-none focus:border-blue-400 `}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex flex-col h-10 w-full px-3 m-5">
                                  <span
                                    className={`${
                                      item.valor !== ""
                                        ? "text-green-500"
                                        : "text-neutral-500"
                                    } text-lg`}
                                  >
                                    Valor:
                                  </span>
                                  <input
                                    required={true}
                                    type="number"
                                    name="preco"
                                    onChange={(e) => {
                                      e.preventDefault();
                                      services[index].valor =
                                        e.currentTarget.value;
                                      subTotal(index);
                                      setServices([...services]);
                                    }}
                                    value={item.valor}
                                    className={`w-full flex border-2 p-2 rounded-md h-10 ${
                                      item.valor !== ""
                                        ? "border-green-500"
                                        : "border-neutral-500"
                                    } focus:shadow-none focus:outline-none focus:border-blue-400 `}
                                  />
                                </div>
                              </>
                            )}

                            {/* Desconto */}
                            <div className="flex flex-row">
                              {/* Desconto */}
                              <div className="flex flex-col h-10 w-full px-3 m-5">
                                <span
                                  className={`${
                                    item.desconto !== ""
                                      ? "text-green-500"
                                      : "text-neutral-500"
                                  } text-lg`}
                                >
                                  Desconto em R$
                                </span>
                                <input
                                  type="number"
                                  name="descontoReais"
                                  onChange={(e) => {
                                    e.preventDefault();
                                    services[index].desconto =
                                      e.currentTarget.value;
                                    subTotal(index);
                                    setServices([...services]);
                                  }}
                                  value={item.desconto}
                                  className={`w-full flex border-2 p-2 rounded-md h-10 ${
                                    item.desconto !== ""
                                      ? "border-green-500"
                                      : "border-neutral-500"
                                  } focus:shadow-none focus:outline-none focus:border-blue-400 `}
                                />
                              </div>
                              {/* Desconto */}
                              <div className="flex flex-col h-10 w-full px-3 m-5">
                                <span
                                  className={`${
                                    item.desconto !== ""
                                      ? "text-green-500"
                                      : "text-neutral-500"
                                  } text-lg`}
                                >
                                  Desconto em %
                                </span>
                                <input
                                  name="preco"
                                  type="descontoPorcentagem"
                                  onChange={(e) => {
                                    e.preventDefault();
                                    services[index].desconto_Porcentagem =
                                      e.currentTarget.value;
                                    subTotal(index);
                                    setServices([...services]);
                                  }}
                                  value={item.desconto_Porcentagem}
                                  className={`w-full flex border-2 p-2 rounded-md h-10 ${
                                    item.desconto_Porcentagem !== ""
                                      ? "border-green-500"
                                      : "border-neutral-500"
                                  } focus:shadow-none focus:outline-none focus:border-blue-400 `}
                                />
                              </div>
                            </div>

                            {/* Total */}
                            <div className="flex flex-row flex-1 w-full flex-wrap items-center">
                              <div className="flex flex-col w-fit px-3 m-5 justify-center">
                                <span className="text-lg text-neutral-500">
                                  Total
                                </span>
                                <span className="text-2xl text-center text-red-700 whitespace-nowrap">
                                  R$ {services[index].total}
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {index > 0 && (
                              <div className="flex w-full">
                                <div className="flex flex-1 flex-col justify-center items-center">
                                  <div
                                    className="flex items-center justify-center h-10 w-full p-2 bg-neutral-800 cursor-pointer hover:opacity-40 duration-150"
                                    onClick={(e) => {
                                      handleRemoveService(e, item, index);
                                    }}
                                  >
                                    <span className="text-lg text-white">
                                      Remover
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <hr className="my-5 bg-zinc-500 w-full h-0.5" />

            <div className="w-full flex flex-col items-center justify-center h-32">
              <div className="flex flex-col w-1/2 px-3">
                <span
                  className={`text-lg ${
                    encaregado !== "" ? "text-green-500" : "text-neutral-500"
                  } w-full text-center`}
                >
                  Nome Do Encaregado:
                </span>
                <input
                  required={true}
                  name="encaregado"
                  type="text"
                  value={encaregado}
                  onChange={(e) => {
                    setEncaregado(e.currentTarget.value);
                  }}
                  className={`w-full border-2 p-2 rounded-md h-8 ${
                    encaregado !== ""
                      ? "border-green-500"
                      : "border-neutral-500"
                  } focus:shadow-none focus:outline-none focus:border-blue-400 `}
                />
              </div>
              <div className="flex flex-col w-1/2 px-3">
                <span
                  className={`text-lg ${
                    encaregadoCPF !== "" ? "text-green-500" : "text-neutral-500"
                  } w-full text-center`}
                >
                  CPF Do Encaregado:
                </span>
                <input
                  required={true}
                  name="encaregadoCPF"
                  type="text"
                  value={encaregadoCPF}
                  onChange={(e) => {
                    setEncaregadoCPF(e.currentTarget.value);
                  }}
                  className={`w-full border-2 p-2 rounded-md h-8 ${
                    encaregadoCPF !== ""
                      ? "border-green-500"
                      : "border-neutral-500"
                  } focus:shadow-none focus:outline-none focus:border-blue-400 `}
                />
              </div>
            </div>

            <div className="flex-col flex justify-start w-full h-fit flex-wrap">
              <hr className="my-5 bg-zinc-500 w-full h-0.5" />
              <div className="h-20 flex items-center justify-center">
                <div className="w-64 h-20">
                  <button
                    type="submit"
                    className="bg-neutral-700 p-2 w-full h-full rounded-xl items-center text-center text-white font-bold hover:opacity-70 duration-150"
                  >
                    Registrar
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Create;

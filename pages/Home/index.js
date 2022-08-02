import Header from "../../components/Header";
import Card from "../../components/Card";
import { useContext, useEffect, useState } from "react";
import LineChart from "../../components/LineChart";
import { DoughnutChart } from "../../components/DoughnutChart";
import { AuthContext } from "../../contexts/AuthContext";
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

const Home = () => {
  const [data, setData] = useState({
    labels: ["Concluido", "Progresso"],
    values: ["2500", "1000"],
  });
  const { user, logout, reloadToken, sToken } = useContext(AuthContext);
  const [totalProjetos, seTotalProjetos] = useState();

  useEffect(() => {
    reloadToken(sToken);
  }, []);

  useEffect(() => {
    const values = data.values.map((n) => parseInt(n));
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
      sum += values[i];
    }
    seTotalProjetos(sum);
  }, []);

  return (
    <div className={"flex-1 flex-col"}>
      <Header />
      <div
        className={
          "flex flex-col items-center justify-center w-full h-full animate-[fadeInSlide_1s]"
        }
      >
        <Card className={`flex items-center justify-between w-11/12 h-20`}>
          <div className="flex flex-1 items-center h-20 justify-between">
            <h1 className={`text-2xl text-stone-800`}>
              <strong>Seja Bem Vindo: </strong>
              {user?.name}
            </h1>

            <img
              src={user?.avatar_url}
              className={`w-12 border-neutral-700 border-2 rounded-full hidden sm:flex`}
              alt=""
              onClick={() => {
                console.log("teste");
              }}
            />
          </div>

          <button
            className="flex items-center justify-center w-fit p-2 h-10 text-white bg-red-500 rounded-lg mx-2"
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
          >
            SAIR
          </button>
        </Card>
        {/* infos */}
        <div className="flex flex-wrap w-11/12 items-center justify-center flex-row">
          <Card className="flex flex-row items-center justify-center">
            <label className="font-bold mx-1">Seus Serviços:</label>
            <span>300</span>
          </Card>
          <Card className="flex flex-row items-center justify-center">
            <label className="font-bold mx-1">Suas Assistencias:</label>
            <span>100</span>
          </Card>
          <Card className="flex flex-row items-center justify-center">
            <label className="font-bold mx-1">Serviços Pendentes:</label>
            <span>20</span>
          </Card>
        </div>
        {/* dashBoard */}
        <div className="flex flex-wrap flex-row justify-center items-center h-fit w-8/12">
          <div className="flex flex-col xl:flex-row h-fit items-center justify-center w-full">
            <div className="flex flex-row xl:flex-col flex-wrap items-center justify-center">
              <div className="bg-white shadow-2xl rounded-xl p-5 m-3 w-96 h-80">
                <div className="flex flex-1 flex-col items-center justify-center h-full">
                  <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold">Tarefas Concluidas</h1>
                    <span className="text-lg">2500</span>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow-2xl rounded-xl p-5 m-3 w-96 h-80">
                <div className="flex flex-1 flex-col items-center justify-center">
                  <div className="flex w-9/12 h-fit">
                    <DoughnutChart dataChart={data} />
                  </div>
                  <p className="text-sm text-cinza font-normal">
                    Numero de Projetos: {totalProjetos}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col min-h-full w-fit justify-center flex-1">
              <div className="bg-white shadow-2xl rounded-xl p-5 m-3 h-fit">
                <div className="flex flex-col">
                  <div className="flex-1 flex items-center w-96 xl:w-full">
                    <LineChart />
                    {/* Informações */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

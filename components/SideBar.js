import { useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { FaTools } from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi";

const SideBar = ({ openedSideBar, setOpenedSidebar }) => {
  const [ferramentas, setFerramentas] = useState(false);
  const [dashborad, setDashborad] = useState(false);
  const [financas, setFinancas] = useState(false);
  const router = useRouter();
  const toggleSideBar = () => {
    setOpenedSidebar(!openedSideBar);
  };

  const Option = (props) => {
    return (
      <div className={"flex-col bg-neutral-600 items-center px-2 py-2 w-full"}>
        <div
          className={`flex justify-between w-full items-center hover:opacity-50 cursor-pointer duration-200`}
          onClick={() => {
            openedSideBar ? props.onPress() : setOpenedSidebar(true);
          }}
        >
          {props.icon ? props.icon : <></>}
          <label
            className={`px-12 text-white font-semibold font-sans select-none ${
              openedSideBar ? "scale-100" : "scale-0"
            } duration-300`}
          >
            {props.label || "Titulo"}
          </label>
          <HiChevronDown
            className={`${props.opened ? "rotate-180" : "rotate-0"}`}
            size={20}
            color="white"
          />
        </div>
        <ul
          className={`${
            props.opened ? "h-full" : "h-0"
          } flex-col duration-100 w-full ${
            props.opened ? "py-2" : "py-0"
          } items-center `}
        >
          {props.items?.map((item, index) => (
            <div key={index} className={"w-full px-12 flex justify-start"}>
              <li
                onClick={(e) => {
                  e.defaultPrevented;
                  router.push(item.route);
                }}
                className={`${
                  props.opened ? "visible opacity-100" : "hidden opacity-0"
                } duration-200 whitespace-nowrap font-sans font-medium text-white text-xm hover:opacity-50 cursor-pointer mb-2 select-none`}
                key={index}
              >
                {item.text}
              </li>
            </div>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="relative z-40">
      <aside
        className={`fixed left-0 top-0 ${
          openedSideBar ? "w-64" : "w-0"
        } duration-300 h-screen bg-neutral-700`}
      >
        <div
          className={"flex h-10 w-full mb-10 items-center"}
          onClick={toggleSideBar}
        ></div>

        {openedSideBar ? (
          <>
            <Option
              label="Ferramentas"
              icon={
                <FaTools
                  className={"fixed h-5 w-5 mx-5"}
                  size={20}
                  color="white"
                />
              }
              opened={ferramentas}
              onPress={() => setFerramentas(!ferramentas)}
              items={[
                { text: "Relatorio Assitencia", route: "/Assistance" },
                { text: "Serviços", route: "/Services" },
              ]}
              router={router}
            />
          </>
        ) : (
          <></>
        )}
      </aside>
    </div>
  );
};

export default SideBar;

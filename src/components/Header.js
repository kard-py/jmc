import React, { useContext, useState } from "react";
import { FaBars } from "react-icons/fa";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo.png";
import SideBar from "./SideBar";
import Card from "./Card";
import { AuthContext } from "../contexts/AuthContext";

export default function Header() {
  const router = useRouter();
  const [openedSideBar, setOpenedSidebar] = useState(false);
  const [otionsProfileView, setOtionsProfileView] = useState(false);

  const { logout, user } = useContext(AuthContext);
  return (
    <aside
      className={
        "relative top-0 animate-[slideDown_1s] duration-300 h-20 flex items-center justify-between drop-shadow-2xl w-full bg-neutral-700 mb-10"
      }
    >
      <div className="z-50">
        <FaBars
          className={
            "fixed z-50 w-10 h-10 content-[''] scale-105 cursor-pointer mx-5 hover:opacity-80 duration-200"
          }
          color={"white"}
          onClick={() => {
            setOpenedSidebar(!openedSideBar);
          }}
        />
        <div className="px-20">
          <span
            onClick={(e) => {
              e.preventDefault;

              router.push("/Home");
            }}
            className={`text-3xl text-white flex items-center font-sans font-bold h-full w-full duration-300 cursor-pointer whitespace-nowrap select-none z-50`}
          >
            JMC Painel
          </span>
        </div>
      </div>

      {router.pathname === "/Home" ? (
        <></>
      ) : (
        <div className="fixed right-0 flex items-center">
          <div className="relative">
            <img
              src={user?.avatar_url}
              className={`w-12 mr-5 border-neutral-700 bg-white border-2 rounded-full hidden sm:flex`}
              alt=""
              onClick={() => {
                setOtionsProfileView(!otionsProfileView);
              }}
            />

            <Card
              className={`${
                otionsProfileView ? "visible" : "hidden"
              } animate-[fadeInSlide_0.5s] absolute border-2 bg-jmc-blue w-32 h-fit overflow-hidden right-full p-0 top-full m-0 items-center flex flex-col rounded-lg rounded-tr-none `}
            >
              <span className="cursor-default select-none text-white border-b-white border-b-2 w-full text-center rounded-tl-lg">
                User: {user?.name}
              </span>
              <ul className="w-full">
                <li
                  className=" select-none cursor-pointer text-white border-b-white border-b-2 w-full text-center"
                  onClick={() => {
                    router.push("/Home");
                  }}
                >
                  Home
                </li>
                <li
                  className=" select-none cursor-pointer bg-red-500 text-white border-b w-full text-center"
                  onClick={() => {
                    logout();
                  }}
                >
                  Sair
                </li>
              </ul>
            </Card>
          </div>

          <div className="block w-20 mr-5 z-50">
            <Link href={"https://jmcautomacaoindustrial.com.br/"}>
              <Image src={logo} layout="responsive" />
            </Link>
          </div>
        </div>
      )}

      <SideBar
        openedSideBar={openedSideBar}
        setOpenedSidebar={setOpenedSidebar}
      />
    </aside>
  );
}

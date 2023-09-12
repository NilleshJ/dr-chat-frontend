"use client";

import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";
import Sidebar from "./drawer";

const Header = ({ handleNewChat, setList, list, setAdd }: any) => {
  const [sticky, setSticky] = useState(false);
  const [open, setOpen] = useState(false);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const handleStickyNavbar = () => {
    if (typeof window !== 'undefined' && window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  useEffect(() => {
    typeof window !== 'undefined' && window.addEventListener("scroll", handleStickyNavbar);
  });

  const handleBack = () => {
    typeof window !== 'undefined' && window.history.go(-1);
  }

  return (
    <>
      <header
        className={`header top-0 left-0 z-40 flex w-full items-center bg-transparent py-3 lg:py-0 md:py-0 ${sticky
          ? "!fixed !z-[9999] !bg-white !bg-opacity-80 shadow-sticky backdrop-blur-sm !transition dark:!bg-primary dark:!bg-opacity-20"
          : "absolute"
          }`}
      >
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex items-center px-1">
              <div onClick={() => handleBack()} className="ml-[-50px] cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <g id="evaArrowBackOutline0"><g id="evaArrowBackOutline1"><path id="evaArrowBackOutline2" fill="currentColor" d="M19 11H7.14l3.63-4.36a1 1 0 1 0-1.54-1.28l-5 6a1.19 1.19 0 0 0-.09.15c0 .05 0 .08-.07.13A1 1 0 0 0 4 12a1 1 0 0 0 .07.36c0 .05 0 .08.07.13a1.19 1.19 0 0 0 .09.15l5 6A1 1 0 0 0 10 19a1 1 0 0 0 .64-.23a1 1 0 0 0 .13-1.41L7.14 13H19a1 1 0 0 0 0-2Z" /></g></g>
                </svg>
              </div>
              <div onClick={() => handleBack()} className="cursor-pointer">
                <img src={'/Logo.png'} alt='img' className="h-16 rounded-lg dark:bg-black" />
              </div>
            </div>
            <div className="flex px-4">
              <ThemeToggler />
              <div className="flex lg:hidden ml-2">
                <button
                  type="button"
                  className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                  onClick={() => openDrawer()}
                >
                  <span className="sr-only">Open main menu</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      {open && <Sidebar open={open} closeDrawer={closeDrawer} handleNewChat={handleNewChat} setList={setList} list={list} setAdd={setAdd} />}
    </>
  );
};

export default Header;
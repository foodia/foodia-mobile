import { useEffect, useState } from "react";
import { IconSearch, IconChevronCompactLeft, IconBell } from '@tabler/icons-react';
import Link from "next/link";
import { useRouter } from 'next/router';

const Header = (props) => {
  const router = useRouter();

  // Handle the back button click
  const handleBackButtonClick = () => {
    // Navigate back to the previous page
    router.back();
  };

  const [test, setTest] = useState("");

  useEffect(() => {
    const checkScroll = () => {
      setTest(window.scrollY === 0);
      // console.log(window.scrollY);
    };
    window.addEventListener("scroll", checkScroll);
  }, [test]);


  return (

    <nav className={
      test
        ? "  bg-green-600 fixed w-full z-20 top-0 left-0 border-b border-gray-200  border-gray-600"
        : " bg-transparent fixed w-full z-20 top-0 left-0 "
    }>
      <div className={
        test
          ? "mobile-w flex flex-wrap items-center justify-between mx-auto py-4 rounded-lg "
          : "mobile-w flex flex-wrap items-center justify-between mx-auto py-4 bg-white rounded-lg "
      }>


        <div className="flex relative">
          <button className="p-4 text-sm rounded-full  bg-gray-200 text-gray-600 " onClick={handleBackButtonClick}><IconChevronCompactLeft /></button>
        </div>

        {router.asPath === "/login/detonator" || router.asPath === "/login/merchant" ? null : (
          <>
            <div className="flex relative " style={{ width: `65%` }}>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 text-gray-500 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-200 focus:ring-blue-500 focus:border-blue-500 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search..."
                required
              />
            </div>
            <div className="flex relative">
              <button className={`p-4 text-sm rounded-full  text-gray-600 ${test ? 'bg-gray-200' : ''}`} onClick={handleBackButtonClick}><IconBell /></button>
            </div>
          </>
        )}




      </div >
    </nav >

  );
};

export default Header;

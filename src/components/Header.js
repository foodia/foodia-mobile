import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Header = ({ title = "", backto = "" }) => {
  const router = useRouter();

  // Handle the back button click
  const handleBackButtonClick = () => {
    // Navigate back to the previous page
    localStorage.removeItem("prevPath");
    if (backto) {
      router.push(backto);
    } else {
      router.back();
    }
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
    <nav className="bg-transparent fixed w-full z-20 top-0 left-0">
      <div className="mobile-w flex flex-wrap items-center justify-between mx-auto py-2 bg-white rounded-lg">
        {/* {title ? ( */}
        <div className="flex">
          <div className="flex relative">
            <button
              className="px-3 py-1 text-sm rounded-full text-primary "
              onClick={handleBackButtonClick}
            >
              <IconArrowLeft />
            </button>
          </div>
          <p className="text-lg font-semibold text-black">{title}</p>
        </div>
        {/* ) : (
          <div className="flex relative w-full mx-2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 text-emerald-500 text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
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
        )} */}

        {/* {router.asPath === "/login/detonator" || router.asPath === "/login/merchant" ? null : (
          
        )} */}
      </div>
    </nav>
  );
};

export default Header;

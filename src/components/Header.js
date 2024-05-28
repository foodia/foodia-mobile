import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Header = ({ title = "", backto = "" }) => {
  const router = useRouter();

  // Handle the back button click
  const handleBackButtonClick = () => {
    // Navigate back to the previous page
    if (backto) {
      if (localStorage.getItem("prevPath") !== "payment_reciept") {
        localStorage.removeItem("prevPath");
      }
      localStorage.removeItem("phone");
      localStorage.removeItem("merchantName");
      localStorage.removeItem("updatedAddress");
      localStorage.removeItem("uploadedFile");
      localStorage.removeItem("phone");
      localStorage.removeItem("merchantName");
      localStorage.removeItem("updatedAddress");
      localStorage.removeItem("uploadedFile");
      localStorage.removeItem("fileName");
      router.push(backto);
    } else {
      router.back();
    }
  };

  const [test, setTest] = useState("");

  useEffect(() => {
    const checkScroll = () => {
      setTest(window.scrollY === 0);
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
      </div>
    </nav>
  );
};

export default Header;

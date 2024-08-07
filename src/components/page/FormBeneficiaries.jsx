import { useRouter } from "next/router";
import { React, useEffect, useState } from "react";
import { StepOne, StepTwo } from "../FormCampaing/StepBeneficiaries";
import Header from "../Header";
import Loading from "../Loading";

const FormBeneficiaries = () => {
  const router = useRouter();
  const { step } = router.query;
  const [cart, setCart] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [registrasibeneficiaries, setRegistrasibeneficiaries] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  // Retrieve form data from local storage on component mount
  useEffect(() => {
    const storedFormData = localStorage.getItem("formData");
    if (storedFormData) {
    }
  }, []);

  useEffect(() => {
    // Membaca nilai dari localStorage setelah rendering pada sisi klien
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartData);
  }, []); // Empty dependency array ensures that this effect runs only once after the initial render

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    // Menyimpan data keranjang ke localStorage setelah diperbarui
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  let stepComponent;
  let setTitle;

  if (step === "1") {
    stepComponent = (
      <StepOne
        registrasibeneficiaries={registrasibeneficiaries}
        setRegistrasibeneficiaries={setRegistrasibeneficiaries}
      />
    );
    setTitle = "Informasi Data Diri";
  } else if (step === "2") {
    stepComponent = (
      <StepTwo
        registrasibeneficiaries={registrasibeneficiaries}
        setRegistrasibeneficiaries={setRegistrasibeneficiaries}
      />
    );
    setTitle = "Informasi Tempat Tinggal";
  } else {
    stepComponent = <div>Invalid step value</div>;
    setTitle = "Default Title";
  }
  // else if (step === "3") {
  //   stepComponent = (
  //     <OTPbeneficiaries
  //       registrasibeneficiaries={registrasibeneficiaries}
  //       setRegistrasibeneficiaries={setRegistrasibeneficiaries}
  //     />
  //   );
  // } else if (step === "4") {
  //   stepComponent = (
  //     <Stepfour
  //       registrasibeneficiaries={registrasibeneficiaries}
  //       setRegistrasibeneficiaries={setRegistrasibeneficiaries}
  //     />
  //   );
  //   setTitle = "Tambah Menu Makan";
  // }

  // Update local storage when formData changes
  const updateLocalStorage = (data) => {
    localStorage.setItem("formData", JSON.stringify(data));
  };

  return (
    <main className="my-0 mx-auto min-h-full mobile-w">
      <div className="my-0 mx-auto pt-16 min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
        <Header title={`Formulir Pendaftaran ${step}/2`} />
        {/* <div className="flex justify-center">
          <h1 className="text-3xl font-bold">FOODIA </h1>
        </div> */}
        <div className="flex justify-center">
          <h1 className="text-[18px] text-primary w-64 text-center font-bold">
            {setTitle}
          </h1>
        </div>
        <div className="grid justify-items-center w-full">
          {/* Pass the updateLocalStorage function to each step component */}
          {stepComponent}
        </div>
        {loading && <Loading />}
      </div>
    </main>
  );
};

export default FormBeneficiaries;

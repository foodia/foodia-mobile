// src/components/FormCampaing.jsx

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  StepOne,
  StepTwo,
  StepThree,
  Stepfour,
  Stepfive,
} from "../FormCampaing/Step";
import AddFood from "./AddFoodCamp";
import Loading from "../Loading";
// import StepThree from '../FormCampaing/CreateCamp';

const FormCampaing = () => {
  const router = useRouter();
  const { step } = router.query;
  const [cart, setCart] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //     const role = sessionStorage.getItem('role');
  //     const token = sessionStorage.getItem('token');
  //     const status = sessionStorage.getItem('status');
  //     const idDetonator = sessionStorage.getItem('id');

  //     if (!role || !token || role !== 'detonator' || status !== 'approved' || !idDetonator) {
  //         // Redirect to login if either role or token is missing or role is not 'detonator' or status is not 'approved'
  //         sessionStorage.clear();
  //         localStorage.removeItem('cart');
  //         localStorage.removeItem('formData');
  //         router.push('/login/detonator');
  //     } else {
  //         // Role is 'detonator' and token is present
  //         setLoading(false); // Set loading to false once the check is complete
  //     }
  // }, [router]);

  // Retrieve form data from local storage on component mount
  useEffect(() => {
    const storedFormData = localStorage.getItem("formData");
    if (storedFormData) {
      console.log(JSON.parse(storedFormData));
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
        setUploadedFile={setUploadedFile}
        uploadedFile={uploadedFile}
        loading={loading}
        setLoading={setLoading}
      />
    );
    setTitle = "Tanggal Pelaksanaan";
  } else if (step === "2") {
    stepComponent = <StepTwo />;
    setTitle = "Lokasi Pelaksanaan";
  } else if (step === "3") {
    stepComponent = (
      <StepThree
        cart={cart}
        updateCart={updateCart}
        setUploadedFile={setUploadedFile}
        uploadedFile={uploadedFile}
        loading={loading}
        setLoading={setLoading}
      />
    );
    setTitle = "Tambah Menu Makan";
  } else if (step === "4") {
    stepComponent = (
      <Stepfour
        cart={cart}
        setCart={setCart}
        setUploadedFile={setUploadedFile}
        uploadedFile={uploadedFile}
        loading={loading}
        setLoading={setLoading}
      />
    );
    setTitle = "Tambah Menu Makan";
  } else if (step === "5") {
    stepComponent = (
      <Stepfive
        cart={cart}
        setCart={setCart}
        setUploadedFile={setUploadedFile}
        uploadedFile={uploadedFile}
        loading={loading}
        setLoading={setLoading}
      />
    );
    setTitle = "";
  } else {
    stepComponent = <div>Invalid step value</div>;
    setTitle = "Default Title";
  }

  // Update local storage when formData changes
  const updateLocalStorage = (data) => {
    localStorage.setItem("formData", JSON.stringify(data));
  };

  return (
    <div className="container mx-auto mt-16 bg-white h-full text-primary">
      {/* <div className="flex justify-center">
        <h1 className="text-3xl font-bold">FOODIA </h1>
      </div> */}
      <div className="flex justify-center mb-2">
        <h1 className="text-xl font-bold">{setTitle}</h1>
      </div>
      {/* <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" /> */}
      <div className="grid justify-items-center w-full h-full">
        {/* Pass the updateLocalStorage function to each step component */}
        {React.cloneElement(stepComponent, { updateLocalStorage })}
      </div>
      {loading && <Loading />}
    </div>
  );
};

export default FormCampaing;

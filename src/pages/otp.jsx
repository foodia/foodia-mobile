// otp.js

import Header from "@/components/Header";
import SweetAlert from "@/components/SweetAlert";
import { useAppState } from "@/components/page/UserContext";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const OTP = () => {
  const router = useRouter();
  const [codes, setCodes] = useState(["", "", "", "", "", ""]);
  const { state } = useAppState();
  const registrasi = state.registrasi;
  // useEffect(() => {
  //     if (!registrasi || Object.keys(registrasi).length === 0) {
  //         Swal.fire({
  //             icon: 'error',
  //             title: 'Data tidak ditemukan',
  //             text: 'Silahkan isi data registrasi terlebih dahulu',
  //             showConfirmButton: false,
  //             timer: 2000,
  //         });
  //         router.push('/registrasi');
  //     }
  // })

  const handleChange = (index, value) => {
    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);

    if (value.length === 0 && index > 0) {
      document.getElementById(`code-${index}`).focus();
    } else if (index < 5) {
      document.getElementById(`code-${index + 2}`).focus();
    }

    const otp = {
      email: registrasi.email,
      // email: 'suryaharis22@gmail.com',
      code: newCodes.join(""),
    };

    if (newCodes.join("").length === 6) {
      // Perform any action you want when the OTP is complete
      // console.log('OTP is complete! Handling submit...');
      console.log("otp data", otp);
      // Example: Handle submit here
      handleSubmit(otp);
    }
  };

  const handleSubmit = async (otp) => {
    console.log("OTP:", otp);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/verify-otp`,
        otp,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer YOUR_ACCESS_TOKEN", // Replace with your actual access token
          },
        }
      );
      console.log("API Response:", response.data);
      const imageUrl = "/img/illustration/checklist.png";
      SweetAlert({
        title: "",
        text: "Akun Berhasil Di Buat",
        imageUrl,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "Custom image",
        width: 350,
      });
      router.push("/home");
    } catch (error) {
      console.error("Error handling submit:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Membuat Akun",
        text: "Kode OTP Tidak Sesuai",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  return (
    <div className="container mx-auto bg-white h-screen ">
      <div className="grid justify-items-center w-full">
        <Header />
        <form className="justify-center pt-24 p-2 mt-5 w-full h-full">
          <h5 className="flex justify-center text-4xl text-primary font-bold ">
            Verifikasi
          </h5>

          <h5 className="mt-4 flex justify-center text-center text-sm font-normal">
            Ketikan Kode Verifikasi Yang Telah Dikirimkan Ke Email Anda:{" "}
          </h5>
          <h5 className="flex justify-center text-sm font-normal">
            {registrasi.email}
          </h5>

          <div className="flex justify-center mb-2 mt-16">
            {codes.map((code, index) => (
              <div key={index} className="mr-2">
                <label
                  htmlFor={`code-${index + 1}`}
                  className="sr-only"
                >{`Code ${index + 1}`}</label>
                <input
                  type="number"
                  maxLength="1"
                  onChange={(e) => handleChange(index, e.target.value)}
                  value={code}
                  id={`code-${index + 1}`}
                  className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-gray-100 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                  onWheel={(e) => e.target.blur()}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center flex-col justify-center pt-10">
            <p className="text-sm text-center text-black font-light">
              Tidak menerima OTP?
            </p>
            <button className="text-sm text-cyan-500 hover:underline">
              Kirim Ulang Kode OTP
            </button>
          </div>

          <div className=" grid place-items-center mt-40">
            {/* Hidden submit button */}
            <button
              type="submit"
              id="submit-button"
              style={{ display: "none" }}
            ></button>

            {/* Visible button that triggers the auto-submit */}
            <button
              onClick={handleSubmit}
              className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTP;

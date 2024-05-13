// src/components/formCampaing/StepDetonator.jsx

import { useState, useEffect } from "react";
import InputForm from "../Imput";
import RoutStep from "../RoutStep";

import {
  IconCamera,
  IconCards,
  IconFile,
  IconGiftCard,
  IconUser,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import axios from "axios";
import SweetAlert from "../SweetAlert";
import Swal from "sweetalert2";
import Loading from "../Loading";
import Error401 from "../error401";

function StepOne({ registrasiDetonator, setRegistrasiDetonator, }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fotoSelfi, setFotoSelfi] = useState(
    registrasiDetonator?.fotoSelfi || null
  );
  const [fotoKTP, setFotoKTP] = useState(registrasiDetonator?.fotoKTP || null);
  const [noKTP, setNoKTP] = useState(registrasiDetonator?.noKTP || "");


  useEffect(() => {
    // Ensure the user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const Toast = Swal.mixin({
    toast: true,
    position: 'center',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  })

  const handleFotoSelfiChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/heif", "image/heic"];
      const maxSize = 5 * 1024 * 1024; // 2.5MB

      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Hanya file PNG, JPG, dan JPEG yang diizinkan!",
        });
        event.target.value = "";
      } else if (file.size > maxSize) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ukuran gambar melebihi 5MB!",
        });
        event.target.value = "";
      } else {
        setFotoSelfi(file);
      }
    }
  };

  const handleFotoKTPChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/heif", "image/heic"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Hanya file PNG, JPG, dan JPEG yang diizinkan!",
        });
        event.target.value = "";
      } else if (file.size > maxSize) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ukuran gambar melebihi 5MB!",
        });
        event.target.value = "";
      } else {
        setFotoKTP(file);
      }
    }
  };

  const handleNoKTPChange = async (event) => {
    const value = event.target.value;
    if (value.length > 16) {
      await Toast.fire({
        icon: 'error',
        title: 'Nomer KTP maksimal 16 angka',
        iconColor: 'bg-black',
      })
    } else {
      setNoKTP(value);
    }
  };

  const handleStepTwoSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Ensure all required fields are filled
    if (!fotoSelfi || !fotoKTP || !noKTP) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // Ensure the token is valid
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const formData = new FormData();
      formData.append("ktp_number", noKTP);
      formData.append("self_photo", fotoSelfi);
      formData.append("ktp_photo", fotoKTP);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}detonator/registration`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);
      Swal.fire({
        icon: "success",
        title: "Registration successful",
        text: ` Mohon tunggu konfirmasi dari admin kami.`,
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        router.push("/home");
      }, 2000);

      // Handle the response accordingly, e.g., redirect to the next step
      // router.push('/registrasi/detonator?step=3');
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 401) {
        Error401(error, router);
      }
      if (error.response && error.response.status === 500) {
        // Handle 500 Internal Server Error
        const imageUrl = "/img/illustration/checklist.png";
        SweetAlert({
          title: "",
          text: "Akun sudah terdaftar",
          imageUrl,
          imageWidth: 200,
          imageHeight: 200,
          imageAlt: "Custom image",
          width: 350,
        });
      } else {
        // Handle other errors
        Swal.fire({
          icon: "error",
          title: "Gagal Membuat Akun",
          text: "Mohon Coba Lagi",
          showConfirmButton: false,
          timer: 2000,
        });
        // Handle error appropriately, e.g., show a user-friendly message
      }
    }
  };

  return (
    <>
      {/* <ol className="flex justify-center mb-4 sm:mb-5 w-full p-2">
        <RoutStep
            liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block  after:border-b after:border-4 after:border-primary`}
            divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-primary`}
            iconCss={`w-4 h-4 text-white lg:w-6 lg:h-6 `}
            iconName={"User"}
        />
        <RoutStep
            liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block   after:border-b after:border-4 after:border-primary`}
            divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-primary`}
            iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
            iconName={"Scan"}
        />
        <RoutStep
            liCss={`flex items-center`}
            divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-gray-700`}
            iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
            iconName={"Password"}
        />
    </ol> */}
      <form className="p-2 mt-2 w-full" onSubmit={handleStepTwoSubmit}>
        <div className="mb-2 px-4">
          <label
            htmlFor="fotoSelfi"
            className="text-sm font-medium text-gray-900"
          >
            Foto Selfi
          </label>
          <div className="flex items-center justify-center w-full ">
            <label
              htmlFor="fotoSelfi"
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-gray-800 hover:bg-gray-100 px-4"
            >
              {fotoSelfi ? (
                <img
                  src={URL.createObjectURL(fotoSelfi)}
                  alt="Foto Selfi"
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex flex-col items-center justify-center pt-5 bg-gray-50 rounded-lg w-28">
                    <IconUser className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="flex flex-col items-center justify-center bg-primary rounded-lg w-28">
                    <IconCamera className="w-8 h-8 text-white dark:text-white" />
                  </div>
                </div>
              )}
              <input
                id="fotoSelfi"
                type="file"
                className="hidden"
                onChange={handleFotoSelfiChange}
              />
            </label>
          </div>
          <p className="text-xs text-primary font-semibold">*file yang diperbolehkan jpg, jpeg, png dan max 5mb</p>
        </div>
        <div className="mb-2 px-4">
          <label
            htmlFor="fotoKTP"
            className="text-sm font-medium text-gray-900"
          >
            Foto KTP
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="fotoKTP"
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-gray-800 hover:bg-gray-100 px-4"
            >
              {fotoKTP ? (
                <img
                  src={URL.createObjectURL(fotoKTP)}
                  alt="Foto KTP"
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex flex-col items-center justify-center pt-5 bg-gray-50 rounded-lg w-28">
                    <IconUser className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="flex flex-col items-center justify-center bg-primary rounded-lg w-28">
                    <IconCamera className="w-8 h-8 text-white dark:text-white" />
                  </div>
                </div>
              )}
              <input
                id="fotoKTP"
                type="file"
                className="hidden"
                onChange={handleFotoKTPChange}
              />
            </label>
          </div>

          <p className="text-xs text-primary font-semibold">*file yang diperbolehkan jpg, jpeg, png dan max 5mb</p>
        </div>
        <div className="grid gap-4 content-center px-4 h-14 pt-14">
          <div className="flex flex-row items-center px-4 p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-none">
            <IconFile />
            <input
              value={noKTP}
              onChange={handleNoKTPChange}
              type="number"
              // id="email"
              className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
              placeholder="No KTP"
              required
            />
          </div>
          {/* <div className="grid gap-4 content-center px-8 mt-44 h-14"> */}
          <button
            type="submit"
            className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Kirim
          </button>
        </div>
      </form>
      {loading && <Loading />}
    </>
  );
}

function StepTwo({ registrasiDetonator, setRegistrasiDetonator }) {
  const router = useRouter();
  const [fotoSelfi, setFotoSelfi] = useState(
    registrasiDetonator?.fotoSelfi ?? null
  );
  const [fotoKTP, setFotoKTP] = useState(registrasiDetonator?.fotoKTP ?? null);
  const [noKTP, setNoKTP] = useState(registrasiDetonator?.noKTP ?? "");


  useEffect(() => {
    if (!registrasiDetonator || Object.keys(registrasiDetonator).length === 0) {
      router.push("/registrasi/detonator?step=1");
    }
  }, [registrasiDetonator]);

  // Handle input file change Foto Selfi
  const handleFotoSelfiChange = (event) => {
    setFotoSelfi(event.target.files[0]);
  };

  // Handle input file change Foto KTP
  const handleFotoKTPChange = (event) => {
    setFotoKTP(event.target.files[0]);
  };

  // Handle input number change Foto Selfi
  const handleNoKTPChange = (event) => {
    setNoKTP(event.target.value);
  };

  const handleStepTwoSubmit = async (event) => {
    event.preventDefault();

    // setRegistrasiDetonator((prevData) => ({
    //     ...prevData,
    //     fotoSelfi,
    //     fotoKTP,
    //     noKTP,
    // }));

    if (!fotoSelfi || !fotoKTP || !noKTP) {
      alert("Please fill in all fields.");
      return;
    }

    setRegistrasiDetonator((prevData) => ({
      ...prevData,
      fotoSelfi,
      fotoKTP,
      noKTP,
    }));
    // router.push('/registrasi/detonator?step=3');
    try {
      // Check if the required fields are filled
      if (!fotoSelfi || !fotoKTP || !noKTP) {
        alert("Please fill in all fields.");
        return;
      }

      // Function to check file size and allowed extensions
      const validateFile = (file, maxSizeMB, allowedExtensions) => {
        if (file.size > maxSizeMB * 1024 * 1024) {
          alert(
            `File ${file.name} exceeds the maximum size of ${maxSizeMB} MB.`
          );
          return false;
        }

        const fileExtension = file.name.split(".").pop().toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
          alert(
            `File ${file.name
            } has an invalid extension. Allowed extensions are: ${allowedExtensions.join(
              ", "
            )}`
          );
          return false;
        }

        return true;
      };

      // Max file size in megabytes
      const maxFileSizeMB = 3;

      // Allowed file extensions
      const allowedExtensions = ["png", "jpg", "jpeg"];

      // Validate files
      if (
        !validateFile(fotoSelfi, maxFileSizeMB, allowedExtensions) ||
        !validateFile(fotoKTP, maxFileSizeMB, allowedExtensions)
      ) {
        return;
      }

      // Create a FormData object and append form fields
      const formData = new FormData();
      formData.append("fullName", registrasiDetonator.fullName);
      formData.append("phone", registrasiDetonator.phoneNumber);
      formData.append("email", registrasiDetonator.email);
      formData.append("password", registrasiDetonator.password);
      formData.append("ktp_number", noKTP);
      formData.append("self_photo", fotoSelfi);
      formData.append("ktp_photo", fotoKTP);

      const token = localStorage.getItem("token");
      // Log the FormData for debugging purposes
      // console.error('Data req:', formData);

      // Make the Axios POST request
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}detonator/registration`,
        formData,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJzZXNzaW9uIjoiIiwicm9sZSI6ImRldG9uYXRvciIsImV4cCI6MTcwMTg1NDQ1M30.9W_yDlyGbvavO2mX3mHRkzoRUOvRnmZA9CJoLBvP6g4`,
            "Content-Type": "multipart/form-data",
          },
        }
      );


      // Redirect to the next step after successful registration
      router.push("/registrasi/detonator?step=3");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Error401(error, router);
      }
      if (error.response && error.response.status === 500) {
        // Handle 500 Internal Server Error
        const imageUrl = "/img/illustration/checklist.png";
        SweetAlert({
          title: "",
          text: "Akun sudah terdaftar",
          imageUrl,
          imageWidth: 200,
          imageHeight: 200,
          imageAlt: "Custom image",
          width: 350,
        });
        router.push("/registrasi/detonator?step=3");
      } else {
        // Handle other errors
        console.error("Error submitting Step Two:", error);
        // Handle error appropriately, e.g., show a user-friendly message
      }
    }
  };

  return (
    <>
      <ol className="flex justify-center mb-4 sm:mb-5 w-full p-2">
        <RoutStep
          liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block  after:border-b after:border-4 after:border-primary`}
          divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-primary`}
          iconCss={`w-4 h-4 text-white lg:w-6 lg:h-6 `}
          iconName={"User"}
        />
        <RoutStep
          liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block   after:border-b after:border-4 after:border-primary`}
          divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-primary`}
          iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
          iconName={"Scan"}
        />
        <RoutStep
          liCss={`flex items-center`}
          divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-gray-700`}
          iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
          iconName={"Password"}
        />
      </ol>
      <form className="p-2 mt-6 w-full" onSubmit={handleStepTwoSubmit}>
        <div className="mb-2">
          <label
            htmlFor="fotoSelfi"
            className="text-sm font-medium text-gray-900"
          >
            Foto Selfi
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="fotoSelfi"
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-gray-800 hover:bg-gray-100"
            >
              {fotoSelfi ? (
                <img
                  src={URL.createObjectURL(fotoSelfi)}
                  alt="Foto Selfi"
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 bg-gray-50 rounded-lg w-28">
                  <IconUser className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                  <div className="flex flex-col items-center justify-center bg-primary rounded-lg w-20">
                    <IconCamera className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                  </div>
                </div>
              )}
              <input
                id="fotoSelfi"
                type="file"
                className="hidden"
                onChange={handleFotoSelfiChange}
              />
            </label>
          </div>
        </div>
        <div className="mb-2">
          <label
            htmlFor="fotoKTP"
            className="text-sm font-medium text-gray-900"
          >
            Foto KTP
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="fotoKTP"
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-gray-800 hover:bg-gray-100"
            >
              {fotoKTP ? (
                <img
                  src={URL.createObjectURL(fotoKTP)}
                  alt="Foto KTP"
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 bg-gray-50 rounded-lg w-28">
                  <IconUser className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                  <div className="flex flex-col items-center justify-center bg-primary rounded-lg w-20">
                    <IconCamera className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                  </div>
                </div>
              )}
              <input
                id="fotoKTP"
                type="file"
                className="hidden"
                onChange={handleFotoKTPChange}
              />
            </label>
          </div>
        </div>

        <div className="mb-2">
          <label htmlFor="noKTP" className="text-sm font-medium text-gray-900">
            No KTP
          </label>
          <InputForm
            cssInput={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            label="noKTP"
            type="number"
            name="noKTP"
            value={noKTP}
            onChange={handleNoKTPChange}
            placeholder="No KTP"
          />
        </div>

        <div className="grid gap-4 content-center">
          <button
            type="submit"
            className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
function StepThree({ registrasiDetonator, setRegistrasiDetonator }) {
  // useEffect(() => {
  //     if (!registrasiDetonator || Object.keys(registrasiDetonator).length === 0) {
  //         router.push('/registrasi/detonator?step=1');
  //     }
  // }, [registrasiDetonator]);

  const [codes, setCodes] = useState(["", "", "", "", "", ""]);
  const router = useRouter();

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
      email: registrasiDetonator.email,
      code: newCodes.join(""),
    };

    if (newCodes.join("").length === 6) {
      // Perform any action you want when the OTP is complete

      // Example: Handle submit here
      handleSubmit(otp);
    }
  };

  const handleSubmit = async (otp) => {
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
      if (error.response && error.response.status === 401) {
        Error401(error, router);
      }
      console.error("Error handling submit:", error);
      const imageUrl = "/img/illustration/checklist.png";
      SweetAlert({
        title: "",
        text: "Kode OTP Tidak Sesuai",
        imageUrl,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "Custom image",
        width: 350,
      });
    }
  };

  return (
    <>
      <ol className="flex justify-center mb-4 sm:mb-5 w-full p-2">
        {/* ... (your RoutStep components) */}
      </ol>

      <form className="justify-center p-2 mt-5 w-full h-full">
        <div className="flex justify-center mb-2">
          {codes.map((code, index) => (
            <div key={index} className="mr-2">
              <label htmlFor={`code-${index + 1}`} className="sr-only">{`Code ${index + 1
                }`}</label>
              <input
                type="number"
                maxLength="1"
                onChange={(e) => handleChange(index, e.target.value)}
                value={code}
                id={`code-${index + 1}`}
                className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
              />
            </div>
          ))}
        </div>
        <div className="justify-center mb-60">
          <p className="text-sm text-center text-black">Tidak menerima OTP?</p>
          <p className="text-sm text-center text-cyan-600">
            Kirim Ulang Kode OTP
          </p>
        </div>

        <div className=" grid place-items-center mt-60">
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
    </>
  );
}

export { StepOne, StepTwo, StepThree };

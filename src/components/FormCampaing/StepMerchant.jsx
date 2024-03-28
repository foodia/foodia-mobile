import {
  IconCamera,
  IconCircleCheck,
  IconCircleX,
  IconCurrentLocation,
  IconFile,
  IconInfoCircle,
  IconMailbox,
  IconMap,
  IconNote,
  IconShield,
  IconUser,
} from "@tabler/icons-react";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import LinkAja from "../../../public/icon/payment/LinkAja.png";
import RoutStep from "../RoutStep";
import SweetAlert from "../SweetAlert";
import Loading from "../Loading";
import Error401 from "../error401";
const DynamicMap = dynamic(() => import("../page/GeoMap"), { ssr: false });

function StepOne({ registrasiMerchant, setRegistrasiMerchant }) {
  // const { stepForm } = props;
  const router = useRouter();
  const [merchant_name, setmerchant_name] = useState(
    registrasiMerchant?.merchant_name ?? ""
  );
  const [ktp_number, setktp_number] = useState(
    registrasiMerchant?.ktp_number ?? ""
  );
  const [self_photo, setself_photo] = useState(
    registrasiMerchant?.self_photo || null
  );
  const [ktp_photo, setktp_photo] = useState(
    registrasiMerchant?.ktp_photo || null
  );
  const [no_link_aja, setno_link_aja] = useState(
    registrasiMerchant?.no_link_aja ?? ""
  );

  const Toast = Swal.mixin({
    toast: true,
    position: "center",
    iconColor: "white",
    customClass: {
      popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  const handlemerchant_nameChange = (event) => {
    setmerchant_name(event.target.value);
  };

  const handlektp_numberChange = async (event) => {
    const value = event.target.value;
    // if (value.length > 16) {
    //   await Toast.fire({
    //     icon: "error",
    //     title: "Nomer KTP maksimal 16 angka",
    //     iconColor: "bg-black",
    //   });
    // } else {
    setktp_number(value);
    // }
  };
  const handleself_photoChange = (event) => {
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
        setself_photo(file);
      }
    }
  };
  const handlektp_photoChange = (event) => {
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
        setktp_photo(file);
      }
    }
  };
  const handleNo_link_ajaChange = (event) => {
    setno_link_aja(event.target.value);
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    // event.preventDefault(); // Prevents the default form submission

    // Validation checks
    if (!merchant_name || !ktp_number || !self_photo || !ktp_photo) {
      window.alert("All fields are required");
      return;
    }

    // Create an object with the form data
    const formData = {
      merchant_name,
      ktp_number,
      self_photo,
      ktp_photo,
      no_link_aja,
    };

    // Save the form data to the registrasiMerchant state
    setRegistrasiMerchant(formData);

    // clear data after submit
    setmerchant_name("");
    setktp_number("");
    setself_photo("");
    setktp_photo("");

    router.push("/registrasi/merchant?step=2");
  };
  useEffect(() => {
    console.log("Step1:", registrasiMerchant);
  }, [registrasiMerchant]);

  const NAME_REGEX = /^[^\r\n]{1,64}$/;
  const PHONE_REGEX = /^(\+62|62|0)8[1-9][0-9]{7,10}$/;
  const KTP_REGEX = /^[1-9][0-9]{15,15}$/;
  const [validName, setValidName] = useState(false);
  const [validPhone, setValidPhone] = useState(false);
  const [validKTP, setValidKTP] = useState(false);

  useEffect(() => {
    setValidName(NAME_REGEX.test(merchant_name));
  }, [merchant_name]);

  useEffect(() => {
    setValidPhone(PHONE_REGEX.test(no_link_aja));
  }, [no_link_aja]);

  useEffect(() => {
    setValidPhone(PHONE_REGEX.test(no_link_aja));
  }, [no_link_aja]);

  useEffect(() => {
    setValidKTP(KTP_REGEX.test(ktp_number));
  }, [ktp_number]);

  return (
    <>
      <ol className="flex justify-center mb-4 sm:mb-5 w-full p-2">
        <RoutStep
          liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block after:border-b after:border-4 after:border-primary`}
          divCss={`flex items-center justify-center w-10 h-10 rounded-full lg:h-9 lg:w-9 shrink-0 bg-primary`}
          iconCss={`w-4 h-4 text-white lg:w-6 lg:h-6 `}
          iconName={"User"}
        />
        <RoutStep
          liCss={`flex items-center`}
          divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-9 lg:w-9 shrink-0 bg-gray-300`}
          iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
          iconName={"BuildingStore"}
        />
      </ol>
      <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />
      <div className="w-full p-2">
        <div className="bg-[#80D48F] gap-3 py-4 px-5 flex flex-row items-center rounded-xl">
          <IconShield color="#348BF2" size={50} />
          <p className="w-full text-xs font-bold">
            Semua informasi kamu dijamin kerahasianya dan tidak akan
            disalahgunakan
          </p>
        </div>
      </div>
      <div className="p-2 w-full space-y-3 px-7">
        <div>
          <div className="flex flex-row p-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none pr-2">
            <IconUser className="mt-3.5" />
            <textarea
              maxLength={120}
              onChange={handlemerchant_nameChange}
              value={merchant_name}
              type="text"
              className="ml-2 w-full text-black min-h-[95px] p-0 py-4 pl-1 bg-transparent focus:border-none outline-none"
              placeholder="Nama Toko"
              required
              style={{ resize: "none" }}
            />
            {/* <IconCircleCheck
              className={validName ? "text-green-600" : "hidden"}
            />
            <IconCircleX
              className={
                !merchant_name || validName ? "hidden" : "text-red-600"
              }
            /> */}
          </div>
          <p className="text-gray-400 text-end text-xs">
            <span className={merchant_name.length > 64 && "text-red-400"}>
              {merchant_name.length}
            </span>
            /64
          </p>
        </div>
        <div>
          <div className="flex flex-row items-center p-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none pr-2">
            <Image src={LinkAja} width={23} />
            <input
              value={no_link_aja}
              onChange={handleNo_link_ajaChange}
              type="number"
              id="number"
              className="ml-2 w-full p-0 py-4 pl-1 text-black bg-transparent focus:border-none  outline-none"
              placeholder="Number Link Aja"
              required
            />
            <IconCircleCheck
              className={validPhone ? "text-green-600" : "hidden"}
            />
            <IconCircleX
              className={!no_link_aja || validPhone ? "hidden" : "text-red-600"}
            />
          </div>
          <p
            className={
              no_link_aja && !validPhone
                ? "instructions italic text-[10px] flex items-center"
                : "hidden"
            }
          >
            <IconInfoCircle size={15} className="mr-1 text-red-600" />
            <span className="text-red-600">
              Diawali (08), Minimal 10 dan maksimal 13 angka.
            </span>
          </p>
        </div>
        <div className="mb-2">
          <div className="flex items-start justify-center w-full">
            <label className="flex flex-col items-start justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-gray-400 hover:bg-gray-100">
              {self_photo ? (
                <img
                  src={URL.createObjectURL(self_photo)}
                  alt="Foto Selfi"
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex flex-row items-center justify-center gap-2 pl-2">
                  <div className="flex h-24 flex-row items-center justify-center bg-primary rounded-lg w-28">
                    <IconCamera size={50} fontWeight={1} color="white" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-sm font-bold">Foto Selfi</p>
                    <p className="text-xs">Ambil foto Selfi kamu</p>
                  </div>
                </div>
              )}
              <input
                id="fotoSelfi"
                type="file"
                className="hidden"
                onChange={handleself_photoChange}
              />
            </label>
          </div>
        </div>
        <div className="mb-2">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-start justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-gray-400 hover:bg-gray-100">
              {ktp_photo ? (
                <img
                  src={URL.createObjectURL(ktp_photo)}
                  alt="Foto KTP"
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex flex-row items-center justify-center gap-2 pl-2">
                  <div className="flex h-24 flex-row items-center justify-center bg-primary rounded-lg w-28">
                    <IconCamera size={50} fontWeight={1} color="white" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-sm font-bold">Foto KTP</p>
                    <p className="text-xs">Ambil foto KTP kamu</p>
                  </div>
                </div>
              )}
              <input
                id="fotoKTP"
                type="file"
                className="hidden"
                onChange={handlektp_photoChange}
              />
            </label>
          </div>
        </div>

        <div>
          <div className="flex flex-row items-center p-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none pr-2">
            <IconFile />
            <input
              value={ktp_number}
              onChange={handlektp_numberChange}
              type="number"
              id="email"
              className="ml-2 w-full p-0 py-4 pl-1 text-black outline-nones bg-transparent focus:border-none"
              placeholder="No. KTP"
              required
            />
            <IconCircleCheck
              className={validKTP ? "text-green-600" : "hidden"}
            />
            <IconCircleX
              className={!ktp_number || validKTP ? "hidden" : "text-red-600"}
            />
          </div>
          <p
            className={
              ktp_number && !validKTP
                ? "instructions italic text-[10px] flex items-center"
                : "hidden"
            }
          >
            <IconInfoCircle size={15} className="mr-1 text-red-600" />
            <span className="text-red-600">
              Minimal 16 dan maksimal 16 angka.
            </span>
          </p>
        </div>

        <div className="grid gap-4 content-center">
          <button
            disabled={
              !merchant_name ||
              !ktp_number ||
              !self_photo ||
              !ktp_photo ||
              !validPhone ||
              !validKTP ||
              !validName ||
              merchant_name.length > 64
            }
            onClick={() => handleSubmit()}
            type="submit"
            className={
              !merchant_name ||
                !ktp_number ||
                !self_photo ||
                !ktp_photo ||
                !validPhone ||
                !validKTP ||
                !validName ||
                merchant_name.length > 64
                ? "text-white bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-xl w-full sm:w-auto px-5 py-2.5 text-center"
                : "text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-xl w-full sm:w-auto px-5 py-2.5 text-center"
            }
          >
            Lanjut
          </button>
        </div>
      </div>
    </>
  );
}

function StepTwo({ registrasiMerchant, setRegistrasiMerchant }) {
  const router = useRouter();
  const [locationInfo, setLocationInfo] = useState(null);
  const [address, setAddress] = useState(registrasiMerchant?.location ?? "");
  const [province, setProvince] = useState(registrasiMerchant?.province ?? "");
  const [city, setCity] = useState(registrasiMerchant?.city ?? "");
  const [sub_district, setSubDistrict] = useState(
    registrasiMerchant?.subDistrict ?? ""
  );
  const [postal_code, setPostalCode] = useState(
    registrasiMerchant?.postalCode ?? ""
  );
  const [coordinates, setCoordinates] = useState(
    registrasiMerchant?.coordinates ?? ""
  );
  const [DetaiAlamat, setDetaiAlamat] = useState(
    registrasiMerchant?.DetaiAlamat ?? ""
  );
  const [loading, setLoading] = useState(false);
  const [tracking, setTracking] = useState(true);

  const handleDataFromMap = (receivedLocationInfo) => {
    setLocationInfo(receivedLocationInfo);
  };

  useEffect(() => {
    if (tracking) {
      handleDataFromMap();
    }
  });

  const getCurrentLocation = () => {
    setTracking((prevTracking) => !prevTracking);
  };
  const handleProvince = (event) => {
    setProvince(event.target.value);
  };
  const handleCity = (event) => {
    setCity(event.target.value);
  };
  const handleSubDistrict = (event) => {
    setSubDistrict(event.target.value);
  };
  const handlePostalCode = (event) => {
    setPostalCode(event.target.value);
  };
  const handleAddress = (event) => {
    setAddress(event.target.value);
  };
  const handleDetaiAlamatChange = (event) => {
    setDetaiAlamat(event.target.value);
  };

  useEffect(() => {
    if (locationInfo) {
      setAddress(locationInfo.fullAdres);
      setProvince(locationInfo.province);
      setCity(locationInfo.city);
      setSubDistrict(locationInfo.sub_district);
      setPostalCode(locationInfo.postal_code);
      setCoordinates(locationInfo.coordinates);
      // setJalan(locationInfo.address);
    }
  }, [locationInfo]);

  const handleSubmit = (e) => {
    setLoading(true);
    if (
      !address ||
      !province ||
      !city ||
      !sub_district ||
      !postal_code ||
      !coordinates
    ) {
      window.alert("All fields are required");
      return;
    }
    setRegistrasiMerchant((prevData) => ({
      ...prevData,
      address,
      province,
      city,
      sub_district,
      postal_code,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      DetaiAlamat,
    }));
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    if (!coordinates.lng) {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select a location",
        showConfirmButton: false,
        timer: 2000,
      });
    }
    const formData = new FormData();
    formData.append("merchant_name", registrasiMerchant?.merchant_name);
    formData.append("ktp_number", registrasiMerchant?.ktp_number);
    formData.append("self_photo", registrasiMerchant?.self_photo);
    formData.append("ktp_photo", registrasiMerchant?.ktp_photo);
    formData.append("province", province);
    formData.append("city", city);
    formData.append("sub_district", sub_district);
    formData.append("postal_code", postal_code);
    formData.append("address", address);
    formData.append("latitude", coordinates.lat);
    formData.append("longitude", coordinates.lng);
    formData.append("no_link_aja", registrasiMerchant?.no_link_aja);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant/registration`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        setLoading(false);
        Swal.fire({
          position: "bottom",
          customClass: {
            popup: "custom-swal",
            icon: "custom-icon-swal",
            title: "custom-title-swal",
            confirmButton: "custom-confirm-button-swal",
          },
          icon: "success",
          title: `<p class="w-auto pl-1 font-bold text-md">Pengajuan Formulir Berhasil Dikirim</p><p class="text-sm w-auto pl-1 font-light">Pendaftaran sedang di review oleh admin. Estimasi 3 x 24 jam</p>`,
          html: `
              <div class="absolute px-28 ml-4 top-0 mt-4">
                <hr class="border border-black w-16 h-1 bg-slate-700 rounded-lg "/>
              </div>
            `,
          width: "375px",
          showConfirmButton: true,
          confirmButtonText: "Kembali",
          confirmButtonColor: "#3FB648",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/home");
          }
        });
      })
      .catch((error) => {
        setLoading(false);
        if (error.response && error.response.status === 401) {
          Error401(error, router);
        }
        else if (error.response && error.response.status === 500) {
          // Handle 500 Internal Server Error
          const imageUrl = "/img/illustration/checklist.png";
          setLoading(false);
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
          setLoading(false);
          SweetAlert({
            title: "",
            text: `${error.response.data.message}`,
            width: 350,
          });
        }
        // router.push("/registrasi/merchant?step=3");
      });
  }

  return (
    <>
      <ol className="flex justify-center mb-4 mt-5 sm:mb-5 w-full p-2">
        <RoutStep
          liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block after:border-b after:border-4 after:border-primary`}
          divCss={`flex items-center justify-center w-10 h-10 rounded-full lg:h-9 lg:w-9 shrink-0 bg-primary`}
          iconCss={`w-4 h-4 text-white lg:w-6 lg:h-6 `}
          iconName={"User"}
        />
        <RoutStep
          liCss={`flex items-center`}
          divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-9 lg:w-9 shrink-0 bg-primary`}
          iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
          iconName={"BuildingStore"}
        />
      </ol>
      <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />
      <div className="py-2 mt-2 w-full px-5 flex flex-row justify-between">
        <button
          onClick={getCurrentLocation}
          className={
            tracking
              ? "bg-gray-50 border border-primary text-gray-900 text-sm rounded-xl block w-[60%] p-2.5 m-1 outline-none hover:bg-gray-200"
              : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl block w-[60%] p-2.5 m-1 outline-none hover:bg-gray-200"
          }
        >
          <div className="flex items-center justify-center gap-1 p-0">
            {/* <IconCurrentLocation color="green" /> */}
            <p>Gunakan Lokasi Saat Ini</p>
          </div>
        </button>
        <button
          onClick={getCurrentLocation}
          className={
            !tracking
              ? "bg-gray-50 border border-primary text-gray-900 text-sm rounded-xl block w-[40%] p-2.5 m-1 outline-none hover:bg-gray-200"
              : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl block w-[40%] p-2.5 m-1 outline-none hover:bg-gray-200"
          }
        >
          <div className="flex items-center justify-center gap-1 p-0">
            {/* <IconCurrentLocation color="green" /> */}
            <p>Pilih Lokasi</p>
          </div>
        </button>
      </div>
      <div className="w-full space-y-3">
        <div className="flex justify-center border-gray-300 rounded-lg">
          <DynamicMap sendDataToPage={handleDataFromMap} tracking={tracking} />
        </div>
        <div className="px-5 flex flex-col gap-4 py-4">
          <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
            <IconMap />
            <textarea
              // onChange={(e) => setLocation(e.target.value)}
              // disabled
              value={address}
              type="text"
              className="ml-2 w-full text-black px-1 p-0 py-4 pl-1 bg-transparent focus:border-none outline-none"
              placeholder="Wilayah"
            // required
            />
          </div>
          <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
            <IconMap />
            <input
              onChange={handleSubDistrict}
              value={sub_district}
              type="text"
              className="ml-2 w-full text-black px-1 p-0 py-4 pl-1 bg-transparent focus:border-none"
              placeholder="Kecamatan"
              required
            />
          </div>
          <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
            <IconMailbox />
            <input
              onChange={handlePostalCode}
              value={postal_code}
              type="number"
              className="ml-2 text-black w-full px-1 p-0 py-4 pl-1 bg-transparent focus:border-none"
              placeholder="Kode Pos"
              required
            />
          </div>
          <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
            <IconNote />
            <textarea
              onChange={handleDetaiAlamatChange}
              value={DetaiAlamat}
              type="text"
              className="ml-2 w-full text-black px-1 p-0 pl-1 py-4 bg-transparent focus:border-none outline-none"
              placeholder="Detail Alamat (Opsional)"
              required
            />
          </div>
          <div className="grid gap-4 content-center">
            <button
              onClick={() => handleSubmit()}
              disabled={
                !address ||
                !province ||
                !city ||
                !sub_district ||
                !postal_code ||
                !coordinates
              }
              type="submit"
              className={
                !address ||
                  !province ||
                  !city ||
                  !sub_district ||
                  !postal_code ||
                  !coordinates
                  ? `text-white bg-gray-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center`
                  : `text-white bg-primary focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center`
              }
            >
              Submit
            </button>
          </div>
        </div>
        {loading && <Loading />}
      </div>
    </>
  );
}

// function OTPMerchant({ registrasiMerchant, setRegistrasiMerchant }) {
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const [codes, setCodes] = useState("");
//   const [showCountdown, setShowCountdown] = useState(false);
//   const [countdownTime, setCountdownTime] = useState(Date.now() + 120000); // Set 120000 untuk 2 menit
//   const [email, setEmail] = useState("");

//   useEffect(() => {
//     setEmail(sessionStorage.getItem("email"));
//   }, []);

//   useEffect(() => {
//     if (email) {
//       handleResend(email);
//     }
//     console.log(email);
//     console.log("reg 3", registrasiMerchant);
//   }, [email]);

//   useEffect(() => {
//     const countdownInterval = setInterval(() => {
//       setCountdownTime((prevTime) => prevTime - 1000); // Kurangi 1 detik dari countdownTime setiap 1 detik
//     }, 1000);

//     return () => clearInterval(countdownInterval);
//   }, []);

//   useEffect(() => {
//     setShowCountdown(countdownTime > 0); // Tentukan apakah countdown masih berlangsung berdasarkan countdownTime
//   }, []);

//   const renderer = ({ minutes, seconds }) => {
//     if (minutes === 0 && seconds === 0) {
//       return (
//         <div
//           onClick={handleResend}
//           className="text-sm text-cyan-500 hover:underline cursor-pointer"
//         >
//           Kirim Ulang Kode OTP
//         </div>
//       );
//     } else {
//       return (
//         <>
//           <p>Input Sebelum :</p>
//           <span>
//             {minutes}:{seconds}
//           </span>
//         </>
//       );
//     }
//   };

//   const handleChange = (event) => {
//     const value = event.target.value;
//     setCodes(value);
//     // if (value.length < 7) {
//     //   setCodes(value);
//     // }
//     // if (value.length === 6) {
//     //   const otp = {
//     //     email: email,
//     //     code: value,
//     //   };
//     //   handleSubmit(otp);
//     // }
//   };

//   const handleResend = (email) => {
//     setLoading(true);
//     axios
//       .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}auth/resend-otp`, { email })
//       .then(() => {
//         setLoading(false);
//         setCountdownTime(Date.now() + 120000); // Set ulang countdownTime ke 2 menit
//         Swal.fire({
//           icon: "success",
//           title: "OTP Sent",
//           text: "Please check your email",
//           showConfirmButton: false,
//           timer: 2000,
//         });
//       })
//       .catch((error) => {
//         setLoading(false);
//         Swal.fire({
//           icon: "error",
//           title: "Gagal Mengirim OTP",
//           text: "Something Went Wrong",
//           width: "375px",
//           showConfirmButton: true,
//           confirmButtonText: "Tutup",
//           confirmButtonColor: "#3b82f6",
//         }).then((result) => {
//           if (result.isConfirmed) {
//             // router.push("/merchant/otp");
//           }
//         });
//       });
//   };

//   const handleSubmit = async (otp) => {
//     setLoading(true);
//     const token = sessionStorage.getItem("token");
//     axios
//       .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}auth/verify-otp`, {
//         email,
//         code: codes,
//       })
//       .then(() => {})
//       .catch(() => {
//         setLoading(false);
//         setLoading(false);
//         Swal.fire({
//           title: "",
//           icon: "error",
//           text: "OTP Tidak sesuai",
//           showConfirmButton: true,
//           confirmButtonText: "Coba Lagi",
//         });
//       });
//   };

//   return (
//     <div className="container mx-auto bg-white">
//       <div className="grid justify-items-center w-full">
//         <form className="justify-center pt-24 p-2 mt-5 w-full h-full">
//           <h5 className="flex justify-center text-4xl text-primary font-bold">
//             Verifikasi
//           </h5>
//           <h5 className="mt-4 flex justify-center text-center text-sm font-normal">
//             Ketikan Kode Verifikasi Yang Telah Dikirimkan Ke Email Anda:
//           </h5>
//           <h5 className="flex justify-center text-sm font-normal">{email}</h5>

//           <div className="mt-4 flex flex-row items-center px-0 bg-gray-100 text-gray-400 text-sm rounded-lg w-full focus:border-none">
//             <input
//               onChange={handleChange}
//               value={codes}
//               name="codes"
//               type="number"
//               id="codes"
//               className="w-full p-0 py-4 bg-transparent focus:border-none text-center"
//               placeholder="* * * * * *"
//               required
//             />
//           </div>

//           <div className="flex items-center flex-col justify-center pt-10">
//             <div
//               style={{
//                 display: "flex",
//                 gap: "5px",
//                 justifyContent: "center",
//               }}
//               className="font-bold"
//             >
//               <Countdown date={countdownTime} renderer={renderer} />
//             </div>
//             <br />
//             {/* <p className="text-sm text-center text-black font-light">
//               {!showCountdown && !loading
//                 ? "Tidak menerima OTP? Tunggu hingga waktu habis sebelum mengirim ulang."
//                 : "Menunggu waktu habis sebelum mengirim ulang..."}
//             </p> */}
//             {!showCountdown && !loading && (
//               <div
//                 onClick={handleResend}
//                 className="text-sm text-cyan-500 hover:underline cursor-pointer"
//               >
//                 Kirim Ulang Kode OTP
//               </div>
//             )}
//           </div>

//           <div className="grid place-items-center mt-40">
//             <button
//               type="button"
//               onClick={() => handleSubmit()}
//               className="text-white w-full bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-bold rounded-xl py-3 text-center"
//             >
//               Kirim
//             </button>
//           </div>
//         </form>
//       </div>
//       {loading && <Loading />}
//     </div>
//   );
// }

// function StepThree({ registrasiMerchant, setRegistrasiMerchant }) {
//   const router = useRouter();
//   const [fotoSelfi, setFotoSelfi] = useState(
//     registrasiMerchant?.fotoSelfi ?? null
//   );
//   const [fotoKTP, setFotoKTP] = useState(registrasiMerchant?.fotoKTP ?? null);
//   const [noKTP, setNoKTP] = useState(registrasiMerchant?.noKTP ?? "");
//   const [phone, setPhone] = useState(registrasiMerchant?.phone ?? "");
//   const [noLinkAja, setNoLinkAja] = useState(
//     registrasiMerchant?.noLinkAja ?? ""
//   );

//   // Debug
//   useEffect(() => {
//     if (registrasiMerchant && registrasiMerchant.fotoSelfi) {
//       console.log("Step2 - Foto Selfi:", registrasiMerchant.fotoSelfi);
//     }
//     if (registrasiMerchant && registrasiMerchant.fotoKTP) {
//       console.log("Step2 - Foto KTP:", registrasiMerchant.fotoKTP);
//     }
//   }, [registrasiMerchant]);

//   useEffect(() => {
//     if (!registrasiMerchant || Object.keys(registrasiMerchant).length === 0) {
//       router.push("/registrasi/merchant?step=1");
//     }
//   }, [registrasiMerchant]);

//   // Handle input file change Foto Selfi
//   const handleFotoSelfiChange = (event) => {
//     const file = event.target.files[0];

//     if (file) {
//       const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
//       const maxSize = 5 * 1024 * 1024; // 5MB

//       if (!allowedTypes.includes(file.type)) {
//         Swal.fire({
//           icon: "error",
//           title: "Oops...",
//           text: "Hanya file PNG, JPG, dan JPEG yang diizinkan!",
//         });
//         event.target.value = "";
//       } else if (file.size > maxSize) {
//         Swal.fire({
//           icon: "error",
//           title: "Oops...",
//           text: "Ukuran gambar melebihi 5MB!",
//         });
//         event.target.value = "";
//       } else {
//         setFotoSelfi(file);
//       }
//     }
//   };

//   // Handle input file change Foto KTP
//   const handleFotoKTPChange = (event) => {
//     const file = event.target.files[0];

//     if (file) {
//       const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
//       const maxSize = 5 * 1024 * 1024; // 5MB

//       if (!allowedTypes.includes(file.type)) {
//         Swal.fire({
//           icon: "error",
//           title: "Oops...",
//           text: "Hanya file PNG, JPG, dan JPEG yang diizinkan!",
//         });
//         event.target.value = "";
//       } else if (file.size > maxSize) {
//         Swal.fire({
//           icon: "error",
//           title: "Oops...",
//           text: "Ukuran gambar melebihi 5MB!",
//         });
//         event.target.value = "";
//       } else {
//         setFotoKTP(file);
//       }
//     }
//   };

//   // Handle input number change Foto Selfi
//   const handleNoKTPChange = (event) => {
//     setNoKTP(event.target.value);
//   };
//   const handlePhoneChange = (event) => {
//     setPhone(event.target.value);
//   };
//   const handleNoLinkAjaChange = (event) => {
//     setNoLinkAja(event.target.value);
//   };

//   const handleStepTwoSubmit = async (event) => {
//     event.preventDefault();

//     if (!fotoSelfi || !fotoKTP || !noKTP || !phone || !noLinkAja) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     setRegistrasiMerchant((prevData) => ({
//       ...prevData,
//       fotoSelfi,
//       fotoKTP,
//       noKTP,
//       phone,
//       noLinkAja,
//     }));
//     // router.push('/registrasi/detonator?step=3');
//     try {
//       // Check if the required fields are filled
//       if (!fotoSelfi || !fotoKTP || !noKTP || !phone || !noLinkAja) {
//         alert("Please fill in all fields.");
//         return;
//       }

//       // Function to check file size and allowed extensions
//       const validateFile = (file, maxSizeMB, allowedExtensions) => {
//         if (file.size > maxSizeMB * 1024 * 1024) {
//           alert(
//             `File ${file.name} exceeds the maximum size of ${maxSizeMB} MB.`
//           );
//           return false;
//         }

//         const fileExtension = file.name.split(".").pop().toLowerCase();
//         if (!allowedExtensions.includes(fileExtension)) {
//           alert(
//             `File ${
//               file.name
//             } has an invalid extension. Allowed extensions are: ${allowedExtensions.join(
//               ", "
//             )}`
//           );
//           return false;
//         }

//         return true;
//       };

//       // Max file size in megabytes
//       const maxFileSizeMB = 3;

//       // Allowed file extensions
//       const allowedExtensions = ["png", "jpg", "jpeg"];

//       // Validate files
//       if (
//         !validateFile(fotoSelfi, maxFileSizeMB, allowedExtensions) ||
//         !validateFile(fotoKTP, maxFileSizeMB, allowedExtensions)
//       ) {
//         return;
//       }

//       // Create a FormData object and append form fields
//       const formData = new FormData();
//       formData.append("fullname", registrasiMerchant.fullName);
//       formData.append("email", registrasiMerchant.email);
//       formData.append("password", registrasiMerchant.password);

//       formData.append("ktp_number", noKTP);
//       formData.append("phone", phone);
//       formData.append("no_link_aja", noLinkAja);
//       formData.append("self_photo", fotoSelfi);
//       formData.append("ktp_photo", fotoKTP);

//       formData.append("province", registrasiMerchant.province);
//       formData.append("city", registrasiMerchant.city);
//       formData.append("sub_district", registrasiMerchant.subDistrict);
//       formData.append("postal_code", registrasiMerchant.postalCode);
//       formData.append("address", registrasiMerchant.Jalan);
//       formData.append("latitude", registrasiMerchant.coordinates.lat);
//       formData.append("longitude", registrasiMerchant.coordinates.lng);

//       const token = sessionStorage.getItem("token");
//       // Log the FormData for debugging purposes
//       // console.error('Data req:', formData);

//       // Make the Axios POST request
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant/registration`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJzZXNzaW9uIjoiIiwicm9sZSI6ImRldG9uYXRvciIsImV4cCI6MTcwMTg1NDQ1M30.9W_yDlyGbvavO2mX3mHRkzoRUOvRnmZA9CJoLBvP6g4`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       // Log the API response
//       console.log("API Response:", response.data);

//       // Redirect to the next step after successful registration
//       router.push("/registrasi/merchant?step=4");
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         sessionStorage.clear();
//         router.push("/login");
//       }
//       if (error.response && error.response.status === 500) {
//         // Handle 500 Internal Server Error
//         const imageUrl = "/img/illustration/checklist.png";
//         SweetAlert({
//           title: "",
//           text: "Akun sudah terdaftar",
//           imageUrl,
//           imageWidth: 200,
//           imageHeight: 200,
//           imageAlt: "Custom image",
//           width: 350,
//         });
//         router.push("/registrasi/merchant?step=4");
//       } else {
//         // Handle other errors
//         console.error("Error submitting Step Two:", error);
//         // Handle error appropriately, e.g., show a user-friendly message
//       }
//     }
//   };

//   return (
//     <>
//       <ol className="flex justify-center mb-4 sm:mb-5 w-full p-2">
//         <RoutStep
//           liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block  after:border-b after:border-4 after:border-primary`}
//           divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-primary`}
//           iconCss={`w-4 h-4 text-white lg:w-6 lg:h-6 `}
//           iconName={"User"}
//         />
//         <RoutStep
//           liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block   after:border-b after:border-4 after:border-primary`}
//           divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-primary`}
//           iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
//           iconName={"Scan"}
//         />
//         <RoutStep
//           liCss={`flex items-center`}
//           divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-gray-700`}
//           iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
//           iconName={"Password"}
//         />
//       </ol>
//       <form className="p-2 mt-6 w-full" onSubmit={handleStepTwoSubmit}>
//         <div className="mb-2">
//           <label htmlFor="phone" className="text-sm font-medium text-gray-900">
//             Phone Number
//           </label>
//           <InputForm
//             cssInput={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
//             label="phone"
//             type="text"
//             name="phone"
//             value={phone}
//             onChange={handlePhoneChange}
//             placeholder="Phone Number"
//           />
//         </div>
//         <div className="mb-2">
//           <label
//             htmlFor="noLinkAja"
//             className="text-sm font-medium text-gray-900"
//           >
//             Link Aja
//           </label>
//           <InputForm
//             cssInput={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
//             label="noLinkAja"
//             type="number"
//             name="noLinkAja"
//             value={noLinkAja}
//             onChange={handleNoLinkAjaChange}
//             placeholder="Link Aja"
//           />
//         </div>

//         <div className="mb-2">
//           <label
//             htmlFor="fotoSelfi"
//             className="text-sm font-medium text-gray-900"
//           >
//             Foto Selfi
//           </label>
//           <div className="flex items-center justify-center w-full">
//             <label
//               htmlFor="fotoSelfi"
//               className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-gray-800 hover:bg-gray-100"
//             >
//               {fotoSelfi ? (
//                 <img
//                   src={URL.createObjectURL(fotoSelfi)}
//                   alt="Foto Selfi"
//                   className="w-full h-full rounded-lg object-cover"
//                 />
//               ) : (
//                 <div className="flex flex-col items-center justify-center pt-5 bg-gray-50 rounded-lg w-28">
//                   <IconUser className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
//                   <div className="flex flex-col items-center justify-center bg-primary rounded-lg w-20">
//                     <IconCamera className="w-8 h-8 text-gray-500 dark:text-gray-400" />
//                   </div>
//                 </div>
//               )}
//               <input
//                 id="fotoSelfi"
//                 type="file"
//                 className="hidden"
//                 onChange={handleFotoSelfiChange}
//               />
//             </label>
//           </div>
//           <p className="text-xs text-red-500">
//             *file yang diperbolehkan jpg, jpeg, png dan max 5mb
//           </p>
//         </div>
//         <div className="mb-2">
//           <label
//             htmlFor="fotoKTP"
//             className="text-sm font-medium text-gray-900"
//           >
//             Foto KTP
//           </label>
//           <div className="flex items-center justify-center w-full">
//             <label
//               htmlFor="fotoKTP"
//               className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-gray-800 hover:bg-gray-100"
//             >
//               {fotoKTP ? (
//                 <img
//                   src={URL.createObjectURL(fotoKTP)}
//                   alt="Foto KTP"
//                   className="w-full h-full rounded-lg object-cover"
//                 />
//               ) : (
//                 <div className="flex flex-col items-center justify-center pt-5 bg-gray-50 rounded-lg w-28">
//                   <IconUser className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
//                   <div className="flex flex-col items-center justify-center bg-primary rounded-lg w-20">
//                     <IconCamera className="w-8 h-8 text-gray-500 dark:text-gray-400" />
//                   </div>
//                 </div>
//               )}
//               <input
//                 id="fotoKTP"
//                 type="file"
//                 className="hidden"
//                 onChange={handleFotoKTPChange}
//               />
//             </label>
//           </div>
//           <p className="text-xs text-red-500">
//             *file yang diperbolehkan jpg, jpeg, png dan max 5mb
//           </p>
//         </div>
//         <div className="mb-2">
//           <label htmlFor="noKTP" className="text-sm font-medium text-gray-900">
//             No KTP
//           </label>
//           <InputForm
//             cssInput={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
//             label="noKTP"
//             type="number"
//             name="noKTP"
//             value={noKTP}
//             onChange={handleNoKTPChange}
//             placeholder="No KTP"
//           />
//         </div>
//         <div className="grid gap-4 content-center">
//           <button
//             type="submit"
//             className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </>
//   );
// }
// function Stepfour({ registrasiMerchant, setRegistrasiMerchant }) {
//   // useEffect(() => {
//   //     if (!registrasiMerchant || Object.keys(registrasiMerchant).length === 0) {
//   //         router.push('/registrasi/detonator?step=1');
//   //     }
//   // }, [registrasiMerchant]);

//   const [codes, setCodes] = useState(["", "", "", "", "", ""]);
//   const router = useRouter();

//   const handleChange = (index, value) => {
//     const newCodes = [...codes];
//     newCodes[index] = value;
//     setCodes(newCodes);

//     if (value.length === 0 && index > 0) {
//       document.getElementById(`code-${index}`).focus();
//     } else if (index < 5) {
//       document.getElementById(`code-${index + 2}`).focus();
//     }

//     const otp = {
//       email: registrasiMerchant.email,
//       code: newCodes.join(""),
//     };

//     if (newCodes.join("").length === 6) {
//       // Perform any action you want when the OTP is complete
//       console.log("OTP is complete! Handling submit...");

//       // Example: Handle submit here
//       handleSubmit(otp);
//     }
//   };

//   const handleSubmit = async (otp) => {
//     console.log("OTP:", otp);
//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/verify-otp`,
//         otp,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer YOUR_ACCESS_TOKEN", // Replace with your actual access token
//           },
//         }
//       );
//       console.log("API Response:", response.data);
//       const imageUrl = "/img/illustration/checklist.png";
//       SweetAlert({
//         title: "",
//         text: "Akun Berhasil Di Buat",
//         imageUrl,
//         imageWidth: 200,
//         imageHeight: 200,
//         imageAlt: "Custom image",
//         width: 350,
//       });
//       router.push("/home");
//     } catch (error) {
//       console.error("Error handling submit:", error);
//       if (error.response && error.response.status === 401) {
//         sessionStorage.clear();
//         router.push("/login");
//       }
//       const imageUrl = "/img/illustration/checklist.png";
//       SweetAlert({
//         title: "",
//         text: "Kode OTP Tidak Sesuai",
//         imageUrl,
//         imageWidth: 200,
//         imageHeight: 200,
//         imageAlt: "Custom image",
//         width: 350,
//       });
//     }
//   };

//   return (
//     <>
//       <ol className="flex justify-center mb-4 sm:mb-5 w-full p-2">
//         {/* ... (your RoutStep components) */}
//       </ol>

//       <form className="justify-center p-2 mt-5 w-full h-full">
//         <div className="flex justify-center mb-2">
//           {codes.map((code, index) => (
//             <div key={index} className="mr-2">
//               <label htmlFor={`code-${index + 1}`} className="sr-only">{`Code ${
//                 index + 1
//               }`}</label>
//               <input
//                 type="number"
//                 maxLength="1"
//                 onChange={(e) => handleChange(index, e.target.value)}
//                 value={code}
//                 id={`code-${index + 1}`}
//                 className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500"
//                 required
//               />
//             </div>
//           ))}
//         </div>
//         <div className="justify-center mb-60">
//           <p className="text-sm text-center text-black">Tidak menerima OTP?</p>
//           <p className="text-sm text-center text-cyan-600">
//             Kirim Ulang Kode OTP
//           </p>
//         </div>

//         <div className=" grid place-items-center mt-60">
//           {/* Hidden submit button */}
//           <button
//             type="submit"
//             id="submit-button"
//             style={{ display: "none" }}
//           ></button>

//           {/* Visible button that triggers the auto-submit */}
//           <button
//             onClick={handleSubmit}
//             className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </>
//   );
// }

export { StepOne, StepTwo };

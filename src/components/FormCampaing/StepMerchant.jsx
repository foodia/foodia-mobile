// src/components/formCampaing/StepDetonator.jsx

import { useState, useEffect } from "react";
import InputForm from "../Imput";
import RoutStep from "../RoutStep";
import {
  IconCamera,
  IconCurrentLocation,
  IconFile,
  IconList,
  IconMailbox,
  IconMap,
  IconUser,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import axios from "axios";
import SweetAlert from "../SweetAlert";

import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import Image from "next/image";
import LinkAja from "../../../public/icon/payment/LinkAja.png";
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

  const handlemerchant_nameChange = (event) => {
    setmerchant_name(event.target.value);
  };

  const handlektp_numberChange = (event) => {
    setktp_number(event.target.value);
  };
  const handleself_photoChange = (event) => {
    setself_photo(event.target.files[0]);
  };

  const handlektp_photoChange = (event) => {
    setktp_photo(event.target.files[0]);
  };
  const handleNo_link_ajaChange = (event) => {
    setno_link_aja(event.target.value);
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the default form submission

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
          liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block   after:border-b after:border-4 after:border-gray-700`}
          divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-gray-700`}
          iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
          iconName={"Scan"}
        />
        <RoutStep
          liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block   after:border-b after:border-4 after:border-gray-700`}
          divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-gray-700`}
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
      <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />
      {/* <h1>Campain: 1</h1> */}
      <form className="p-2 w-full space-y-3" onSubmit={handleSubmit}>
        <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          <IconUser />
          <input
            value={merchant_name}
            onChange={handlemerchant_nameChange}
            type="text"
            id="email"
            className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Nama Toko"
            required
          />
        </div>
        {/* <div className="mb-2">
          <label
            htmlFor="merchant_name"
            className="text-sm font-medium text-gray-900"
          >
            Merchant Name
          </label>
          <InputForm
            cssInput={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            label="merchant_name"
            type="text"
            name="merchant_name"
            value={merchant_name}
            onChange={handlemerchant_nameChange}
            placeholder="Merchant Name"
          />
        </div> */}
        <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          <Image src={LinkAja} width={23} />
          <input
            value={no_link_aja}
            onChange={handleNo_link_ajaChange}
            type="number"
            id="email"
            className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Number Link Aja"
            required
          />
        </div>
        {/* <div className="mb-2">
          <label
            htmlFor="no_link_aja"
            className="text-sm font-medium text-gray-900"
          >
            Link Aja
          </label>
          <InputForm
            cssInput={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            label="no_link_aja"
            type="number"
            name="no_link_aja"
            value={no_link_aja}
            onChange={handleNo_link_ajaChange}
            placeholder="Link Aja"
          />
        </div> */}

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
              {self_photo ? (
                <img
                  src={URL.createObjectURL(self_photo)}
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
                onChange={handleself_photoChange}
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
              {ktp_photo ? (
                <img
                  src={URL.createObjectURL(ktp_photo)}
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
                onChange={handlektp_photoChange}
              />
            </label>
          </div>
        </div>

        <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          <IconFile />
          <input
            value={ktp_number}
            onChange={handlektp_numberChange}
            type="number"
            id="email"
            className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="No. KTP"
            required
          />
        </div>

        {/* <div className="mb-2">
          <label htmlFor="noKTP" className="text-sm font-medium text-gray-900">
            No KTP
          </label>
          <InputForm
            cssInput={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            label="noKTP"
            type="number"
            name="noKTP"
            value={ktp_number}
            onChange={handlektp_numberChange}
            placeholder="No KTP"
          />
        </div> */}

        {/* <div className="mb-2">
          <label
            htmlFor="ktp_number"
            className="text-sm font-medium text-gray-900"
          >
            Nomer KTP
          </label>
          <InputForm
            cssInput={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            label="ktp_number"
            type="number"
            name="ktp_number"
            value={ktp_number}
            onChange={handlektp_numberChange}
            placeholder="Nomer KTP"
          />
        </div>
        <div className="mb-2">
          <label
            htmlFor="self_photo"
            className="text-sm font-medium text-gray-900"
          >
            Foto Selfi
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="self_photo"
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-gray-800 hover:bg-gray-100"
            >
              {self_photo ? (
                <img
                  src={URL.createObjectURL(self_photo)}
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
                id="self_photo"
                type="file"
                className="hidden"
                onChange={handleself_photoChange}
              />
            </label>
          </div>
        </div>
        <div className="mb-2">
          <label
            htmlFor="ktp_photo"
            className="text-sm font-medium text-gray-900"
          >
            Foto KTP
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="ktp_photo"
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-gray-800 hover:bg-gray-100"
            >
              {ktp_photo ? (
                <img
                  src={URL.createObjectURL(ktp_photo)}
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
                id="ktp_photo"
                type="file"
                className="hidden"
                onChange={handlektp_photoChange}
              />
            </label>
          </div>
        </div> */}

        <div className="grid gap-4 content-center">
          <button
            type="submit"
            className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-xl w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Lanjut
          </button>
        </div>
      </form>
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

  // const [Jalan, setJalan] = useState(registrasiMerchant?.Jalan ?? '');// menggunakan respon address

  const [tracking, setTracking] = useState(true);

  const handleDataFromMap = (receivedLocationInfo) => {
    setLocationInfo(receivedLocationInfo);
  };

  const getCurrentLocation = () => {
    setTracking((prevTracking) => !prevTracking);
  };

  // const handleJalanChange = (event) => {
  //     setJalan(event.target.value);
  // };
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    setLoading(true);

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
    console.log("data regis", registrasiMerchant);

    try {
      // Ensure the token is valid
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
      formData.append("merchant_name", registrasiMerchant.merchant_name);
      formData.append("ktp_number", registrasiMerchant.ktp_number);
      formData.append("self_photo", registrasiMerchant.self_photo);
      formData.append("ktp_photo", registrasiMerchant.ktp_photo);
      formData.append("province", province);
      formData.append("city", city);
      formData.append("sub_district", sub_district);
      formData.append("postal_code", postal_code);
      formData.append("address", address);
      formData.append("latitude", coordinates.lat);
      formData.append("longitude", coordinates.lng);
      formData.append("no_link_aja", registrasiMerchant.no_link_aja);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant/registration`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("token:", token);
      console.log("API Response:", response.data);
      Swal.fire({
        icon: "success",
        title: "Registration successful",
        text: ` Mohon tunggu konfirmasi dari admin kami.`,
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        router.push("/home");
        setLoading(false);
      }, 2000);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        sessionStorage.clear();
        router.push("/login");
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

    router.push("/registrasi/merchant?step=3");
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
      <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />
      <div className="p-2 mt-2 w-full px-10">
        <button
          onClick={getCurrentLocation}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 m-1"
        >
          {tracking ? (
            <div className="flex items-center justify-center gap-1 p-0">
              <IconCurrentLocation color="green" />
              <p>Gunakan Lokasi Saat Ini</p>
            </div>
          ) : (
            <p>Custom Location</p>
          )}
        </button>
      </div>
      <form className="p-2 w-full space-y-3" onSubmit={handleSubmit}>
        <div className="flex justify-center border-gray-300 rounded-lg">
          <DynamicMap sendDataToPage={handleDataFromMap} tracking={tracking} />
        </div>
        <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          <IconMap />
          <textarea
            onChange={(e) => setLocation(e.target.value)}
            value={address}
            type="text"
            className="ml-2 w-full px-1 p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Wilayah"
            required
          />
        </div>
        {/* <div className="mb-2">
          <label
            htmlFor="address"
            className="text-sm font-medium text-gray-900"
          >
            Alamat
          </label>
          <textarea
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 m-1"
            id="address"
            name="address"
            value={address}
            defaultValue={address} // Use defaultValue instead of value
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Alamat"
          />
        </div> */}
        <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          <IconMap />
          <input
            onChange={handleProvince}
            value={province}
            type="text"
            className="ml-2 w-full px-1 p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Provinsi"
            required
          />
        </div>
        {/* <div className="mb-2">
            <label
              htmlFor="province"
              className="text-sm font-medium text-gray-900"
            >
              Provinsi
            </label>
            <InputForm
              cssInput={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 m-1`}
              label="province"
              type="text"
              name="province"
              value={province}
              defaultValue={province} // Use defaultValue instead of value
              // onChange={(e) => handleProvince(e.target.value)}
              onChange={handleProvince}
              placeholder="province Name"
            />
          </div> */}

        <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          <IconMap />
          <input
            onChange={handleCity}
            value={city}
            type="text"
            className="ml-2 w-full px-1 p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Kota"
            required
          />
        </div>

        {/* <div className="mb-2">
          <label htmlFor="city" className="text-sm font-medium text-gray-900">
            Kota
          </label>
          <InputForm
            cssInput={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 m-1`}
            label="city"
            type="text"
            name="city"
            value={city}
            defaultValue={city} // Use defaultValue instead of value
            // onChange={(e) => handleProvince(e.target.value)}
            onChange={handleCity}
            placeholder="Nama Kota"
          />
        </div> */}

        <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          <IconMap />
          <input
            onChange={handleSubDistrict}
            value={sub_district}
            type="text"
            className="ml-2 w-full px-1 p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Kecamatan"
            required
          />
        </div>

        {/* <div className="mb-2">
          <label
            htmlFor="sub_district"
            className="text-sm font-medium text-gray-900"
          >
            Kecamatan
          </label>
          <InputForm
            cssInput={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 m-1`}
            label="sub_district"
            type="text"
            name="sub_district"
            value={sub_district}
            defaultValue={sub_district} // Use defaultValue instead of value
            onChange={handleSubDistrict}
            placeholder="Kecamatan"
          />
        </div> */}

        <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          <IconMailbox />
          <input
            onChange={handlePostalCode}
            value={postal_code}
            type="number"
            className="ml-2 w-full px-1 p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Kode Pos"
            required
          />
        </div>

        {/* <div className="mb-2">
          <label
            htmlFor="postal_code"
            className="text-sm font-medium text-gray-900"
          >
            Kode Pos
          </label>
          <InputForm
            cssInput={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 m-1`}
            label="postal_code"
            type="number"
            name="postal_code"
            value={postal_code}
            defaultValue={postal_code} // Use defaultValue instead of value
            onChange={handlePostalCode}
            placeholder="Kode Pos"
          />
        </div> */}

        {/* <div className="mb-2">
            <label htmlFor='Jalan' className="  text-sm font-medium text-gray-900">Nama Jalan</label>

            <InputForm
                cssInput="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 m-1"
                label="Jalan"
                type="text"
                name="Jalan"
                value={Jalan}
                onChange={handleJalanChange}
                placeholder="Nama Jalan"
            />
        </div> */}

        <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          <IconMap />
          <textarea
            onChange={handleDetaiAlamatChange}
            value={DetaiAlamat}
            type="text"
            className="ml-2 w-full px-1 p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Detail Alamat"
            required
          />
        </div>

        {/* <div className="mb-2">
          <label
            htmlFor="DetaiAlamat"
            className="  text-sm font-medium text-gray-900"
          >
            Detai Alamat
          </label>
          <InputForm
            cssInput="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 m-1"
            label="DetaiAlamat"
            type="text"
            name="DetaiAlamat"
            value={DetaiAlamat}
            onChange={handleDetaiAlamatChange}
            placeholder="Detail Lainnya (Cth: Block/Unit No., Patokan)"
          />
        </div> */}

        <div className="grid gap-4 content-center">
          <button
            disabled={loading ? true : false}
            type="submit"
            className={`text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center ${loading ? "disabled:opacity-50 disabled:pointer-events-none" : ""
              }`}
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
}

function StepThree({ registrasiMerchant, setRegistrasiMerchant }) {
  const router = useRouter();
  const [fotoSelfi, setFotoSelfi] = useState(
    registrasiMerchant?.fotoSelfi ?? null
  );
  const [fotoKTP, setFotoKTP] = useState(registrasiMerchant?.fotoKTP ?? null);
  const [noKTP, setNoKTP] = useState(registrasiMerchant?.noKTP ?? "");
  const [phone, setPhone] = useState(registrasiMerchant?.phone ?? "");
  const [noLinkAja, setNoLinkAja] = useState(
    registrasiMerchant?.noLinkAja ?? ""
  );

  // Debug
  useEffect(() => {
    if (registrasiMerchant && registrasiMerchant.fotoSelfi) {
      console.log("Step2 - Foto Selfi:", registrasiMerchant.fotoSelfi);
    }
    if (registrasiMerchant && registrasiMerchant.fotoKTP) {
      console.log("Step2 - Foto KTP:", registrasiMerchant.fotoKTP);
    }
  }, [registrasiMerchant]);

  useEffect(() => {
    if (!registrasiMerchant || Object.keys(registrasiMerchant).length === 0) {
      router.push("/registrasi/merchant?step=1");
    }
  }, [registrasiMerchant]);

  // Handle input file change Foto Selfi
  const handleFotoSelfiChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
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
        setFotoSelfi(file);
      }
    }
  };

  // Handle input file change Foto KTP
  const handleFotoKTPChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
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

  // Handle input number change Foto Selfi
  const handleNoKTPChange = (event) => {
    setNoKTP(event.target.value);
  };
  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };
  const handleNoLinkAjaChange = (event) => {
    setNoLinkAja(event.target.value);
  };

  const handleStepTwoSubmit = async (event) => {
    event.preventDefault();

    if (!fotoSelfi || !fotoKTP || !noKTP || !phone || !noLinkAja) {
      alert("Please fill in all fields.");
      return;
    }

    setRegistrasiMerchant((prevData) => ({
      ...prevData,
      fotoSelfi,
      fotoKTP,
      noKTP,
      phone,
      noLinkAja,
    }));
    // router.push('/registrasi/detonator?step=3');
    try {
      // Check if the required fields are filled
      if (!fotoSelfi || !fotoKTP || !noKTP || !phone || !noLinkAja) {
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
      formData.append("fullname", registrasiMerchant.fullName);
      formData.append("email", registrasiMerchant.email);
      formData.append("password", registrasiMerchant.password);

      formData.append("ktp_number", noKTP);
      formData.append("phone", phone);
      formData.append("no_link_aja", noLinkAja);
      formData.append("self_photo", fotoSelfi);
      formData.append("ktp_photo", fotoKTP);

      formData.append("province", registrasiMerchant.province);
      formData.append("city", registrasiMerchant.city);
      formData.append("sub_district", registrasiMerchant.subDistrict);
      formData.append("postal_code", registrasiMerchant.postalCode);
      formData.append("address", registrasiMerchant.Jalan);
      formData.append("latitude", registrasiMerchant.coordinates.lat);
      formData.append("longitude", registrasiMerchant.coordinates.lng);

      const token = sessionStorage.getItem("token");
      // Log the FormData for debugging purposes
      // console.error('Data req:', formData);

      // Make the Axios POST request
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant/registration`,
        formData,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJzZXNzaW9uIjoiIiwicm9sZSI6ImRldG9uYXRvciIsImV4cCI6MTcwMTg1NDQ1M30.9W_yDlyGbvavO2mX3mHRkzoRUOvRnmZA9CJoLBvP6g4`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Log the API response
      console.log("API Response:", response.data);

      // Redirect to the next step after successful registration
      router.push("/registrasi/merchant?step=4");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        sessionStorage.clear();
        router.push("/login");
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
        router.push("/registrasi/merchant?step=4");
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
          <label htmlFor="phone" className="text-sm font-medium text-gray-900">
            Phone Number
          </label>
          <InputForm
            cssInput={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            label="phone"
            type="text"
            name="phone"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="Phone Number"
          />
        </div>
        <div className="mb-2">
          <label
            htmlFor="noLinkAja"
            className="text-sm font-medium text-gray-900"
          >
            Link Aja
          </label>
          <InputForm
            cssInput={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            label="noLinkAja"
            type="number"
            name="noLinkAja"
            value={noLinkAja}
            onChange={handleNoLinkAjaChange}
            placeholder="Link Aja"
          />
        </div>

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
          <p className="text-xs text-red-500">*file yang diperbolehkan jpg, jpeg, png dan max 5mb</p>
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
          <p className="text-xs text-red-500">*file yang diperbolehkan jpg, jpeg, png dan max 5mb</p>
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
function Stepfour({ registrasiMerchant, setRegistrasiMerchant }) {
  // useEffect(() => {
  //     if (!registrasiMerchant || Object.keys(registrasiMerchant).length === 0) {
  //         router.push('/registrasi/detonator?step=1');
  //     }
  // }, [registrasiMerchant]);

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
      email: registrasiMerchant.email,
      code: newCodes.join(""),
    };

    if (newCodes.join("").length === 6) {
      // Perform any action you want when the OTP is complete
      console.log("OTP is complete! Handling submit...");

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
      if (error.response && error.response.status === 401) {
        sessionStorage.clear();
        router.push("/login");
      }
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

export { StepOne, StepTwo, StepThree, Stepfour };

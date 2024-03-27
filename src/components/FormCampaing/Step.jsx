// src/components/FormCampaing/Step.jsx

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "react-clock/dist/Clock.css";
import "react-time-picker/dist/TimePicker.css";
import RoutStep from "../RoutStep";

import {
  Icon123,
  IconCalendar,
  IconCamera,
  IconCirclePlus,
  IconClock,
  IconCurrentLocation,
  IconDetails,
  IconFileDescription,
  IconGardenCart,
  IconHome2,
  IconMap,
  IconMinus,
  IconPhotoScan,
  IconPlus,
  IconUser,
} from "@tabler/icons-react";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import Swal from "sweetalert2";
import Market from "../../../public/img/illustration/market.png";
import CardListMerchan from "../page/Detonator/CardListMerchan";
import AddFoodCamp from "./AddFoodCamp";
import Error401 from "../error401";
import Header from "../Header";

const DynamicMap = dynamic(() => import("../page/GeoMap"), { ssr: false });

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

function StepOne({ updateLocalStorage, setUploadedFile, uploadedFile }) {
  const router = useRouter();
  const [eventName, setEventName] = useState(() => {
    const storedFormData = localStorage.getItem("formData");
    const parsedFormData = storedFormData ? JSON.parse(storedFormData) : {};
    return parsedFormData.eventName || "";
  });

  const [TypeEvent, setTypeEvent] = useState(() => {
    const storedFormData = localStorage.getItem("formData");
    const parsedFormData = storedFormData ? JSON.parse(storedFormData) : {};
    return parsedFormData.TypeEvent || "";
  });

  const [Tanggal, setTanggal] = useState(() => {
    const storedFormData = localStorage.getItem("formData");
    const parsedFormData = storedFormData ? JSON.parse(storedFormData) : {};
    return parsedFormData.Tanggal || "";
  });

  const [Waktu, setWaktu] = useState(() => {
    const storedFormData = localStorage.getItem("formData");
    const parsedFormData = storedFormData ? JSON.parse(storedFormData) : {};
    return parsedFormData.Waktu || "";
  });

  const [Description, setDescription] = useState(() => {
    const storedFormData = localStorage.getItem("formData");
    const parsedFormData = storedFormData ? JSON.parse(storedFormData) : {};
    return parsedFormData.Description || "";
    Description;
  });

  // const [ImageCamp, setImageCamp] = useState(() => {
  //     const storedFormData = localStorage.getItem('formData');
  //     const parsedFormData = storedFormData ? JSON.parse(storedFormData) : {};
  //     return parsedFormData.ImageCamp || '';
  // });

  const handleEventNameChange = (event) => {
    setEventName(event.target.value);
  };

  const handleTypeEventChange = (event) => {
    setTypeEvent(event.target.value);
  };

  const handleTanggalChange = (event) => {
    const selectedDate = event.target.value;

    // Get the current date
    const currentDate = new Date();

    // Convert the selected date to a Date object for comparison
    const selectedDateObject = new Date(selectedDate);

    // Calculate the minimum allowed date (7 days from the current date)
    const minAllowedDate = new Date();
    minAllowedDate.setDate(currentDate.getDate() + 2);

    // Check if the selected date is at least 7 days from the current date
    if (selectedDateObject >= minAllowedDate) {
      setTanggal(selectedDate);
    } else {
      Swal.fire({
        icon: "error",
        title: "Tanggal Tidak Valid",
        text: "Pilihlah tanggal minimal 2 hari dari tanggal saat ini.",
        timer: 2000,
      });
    }
  };

  const handleWaktuChange = (event) => {
    const selectedTime = event.target.value;

    const isWithinAllowedRange = isTimeWithinRange(selectedTime);

    if (isWithinAllowedRange) {
      setWaktu(selectedTime);
    } else {
      Swal.fire({
        icon: "error",
        title: "Waktu Tidak Valid",
        text: "Waktu yang dipilih tidak berada dalam rentang yang diizinkan (01:00 - 23:00).",
        timer: 2000,
      });
    }
  };
  const isTimeWithinRange = (time) => {
    const selectedHour = parseInt(time.split(":")[0], 10);
    const selectedMinute = parseInt(time.split(":")[1], 10);
    return (
      (selectedHour === 1 && selectedMinute >= 0) ||
      (selectedHour > 1 && selectedHour < 23) ||
      (selectedHour === 23 && selectedMinute === 0)
    );
  };

  const handleDescriptionChange = (event) => {
    const value = event.target.value;
    // if (value.length > 120) {
    //   Toast.fire({
    //     icon: 'error',
    //     title: 'Deskripsi maksimal 120 karakter mohon periksa kembali',
    //     iconColor: 'bg-black',
    //     timer: 2000
    //   });
    // }
    setDescription(value);
  };

  const handleImageCampChange = (event) => {
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
        setUploadedFile(file);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      "eventName",
      "TypeEvent",
      "Tanggal",
      "Waktu",
      "Description",
    ];
    const errorMessages = {
      eventName: "Event Name",
      TypeEvent: "Type of Event",
      Tanggal: "Date",
      Waktu: "Time",
      Description: "Description",
    };

    // Konversi eventName menjadi kapitalisasi setiap kata
    const capitalizeEachWord = (str) => {
      return str.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const formData = {
      eventName: capitalizeEachWord(eventName), // Konversi eventName di sini
      TypeEvent,
      Tanggal,
      Waktu,
      Description,
    };
    const emptyFields = requiredFields.filter((field) => !formData[field]);

    emptyFields.forEach((field) => {
      const errorMessage = `${errorMessages[field]} is required`;
      Toast.fire({
        icon: "error",
        title: errorMessage,
        iconColor: "bg-black",
        timer: 2000,
      });
    });

    if (emptyFields.length > 0) {
      return;
    }
    // if (Description.length > 120) {
    //   Toast.fire({
    //     icon: 'error',
    //     title: 'Deskripsi maksimal 120 karakter mohon periksa kembali',
    //     iconColor: 'bg-black',
    //     timer: 2000
    //   });
    //   return;
    // }
    if (!uploadedFile) {
      Toast.fire({
        icon: "error",
        title: "Image is required",
        iconColor: "bg-black",
        timer: 2000,
      });
      return;
    }

    // Update the local storage when form data changes
    updateLocalStorage(formData);

    // Reset form after submit
    setEventName("");
    setTypeEvent("");
    setTanggal("");
    setWaktu("");
    // setImageCamp('');

    // Navigate to the next step
    router.push(`creatcampaign?step=2`);
  };

  useEffect(() => {
    console.log("gambar", uploadedFile);
  }, [uploadedFile]);

  return (
    <>
      <ol className="flex justify-center mb-2 w-full p-2">
        <RoutStep
          liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block  after:border-b after:border-4 after:border-primary`}
          divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-primary`}
          iconCss={`w-4 h-4 text-white lg:w-6 lg:h-6 `}
          iconName={"CalendarEvent"}
        />
        <RoutStep
          liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block   after:border-b after:border-4 after:border-gray-700`}
          divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-gray-700`}
          iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
          iconName={"Map"}
        />
        <RoutStep
          liCss={`flex items-center`}
          divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-gray-700`}
          iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
          iconName={"CalendarEvent"}
        />
      </ol>
      <form className="p-2 mt-2 w-full px-5 space-y-3" onSubmit={handleSubmit}>
        <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg w-full focus:border-none">
          {/* <label
            htmlFor="password"
            className="block  text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label> */}
          <IconUser />
          <input
            onChange={handleEventNameChange}
            value={eventName}
            name="eventName"
            type="text"
            id="email"
            className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Nama Campaign"
            required
          />
        </div>
        {/* <div className="mb-2 px-4">
          <label
            htmlFor="eventName"
            className="text-sm font-medium text-gray-900"
          >
            Event Name
          </label>
          <IconUser />
          <InputForm
            cssInput="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-10 p-2.5"
            label="eventName"
            type="text"
            name="eventName"
            value={eventName}
            onChange={handleEventNameChange}
            placeholder="Nama Campaign"
          />
        </div> */}

        <div className="flex flex-row items-center p-4 pr-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg w-full focus:border-none">
          <Icon123 />
          <select
            name="TypeEvent"
            value={TypeEvent}
            id="TypeEvent"
            onChange={handleTypeEventChange}
            className="ml-1 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
          >
            <option value="">Tipe Campaign</option>
            <option value="one_time">One Time</option>
            {/* <option value="regular">Regular</option> */}
          </select>
        </div>

        {/* <div className="mb-2 px-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type Event:
            <select
              name="TypeEvent"
              value={TypeEvent}
              onChange={handleTypeEventChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            >
              <option>---Pilih Type Event---</option>
              <option value="one_time">One Time</option>
              <option value="regular">Regular</option>
            </select>
          </label>
        </div> */}

        <div className="flex flex-row items-center p-4 pr-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          <IconCalendar />
          <input
            onChange={handleTanggalChange}
            value={Tanggal}
            name="Tanggal"
            type="date"
            className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Tanggal Pelaksanaan"
            required
          />
        </div>

        {/* <div className="mb-2 px-4">
          <label
            htmlFor="Tanggal"
            className="text-sm font-medium text-gray-900"
          >
            Tanggal
          </label>
          <InputForm
            cssInput="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            label="Tanggal"
            type="date"
            name="Tanggal"
            value={Tanggal}
            onChange={handleTanggalChange}
            placeholder="Tanggal"
          />
        </div> */}

        <div className="flex flex-row items-center p-4 pr-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          {/* <label
            htmlFor="password"
            className="block  text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label> */}
          <IconClock />
          <input
            onChange={handleWaktuChange}
            value={Waktu}
            type="time"
            name="Waktu"
            className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Waktu Pelaksanaan"
            required
          />
        </div>

        {/* <TimePicker onChange='' value='' /> */}
        {/* <div className="mb-2 px-4">
          <label htmlFor="Waktu" className="text-sm font-medium text-gray-900">
            Waktu
          </label>
          <InputForm
            cssInput="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            label="Waktu"
            type="time"
            name="Waktu"
            value={Waktu}
            onChange={handleWaktuChange}
            placeholder="Waktu"
          />
        </div> */}

        <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          <IconFileDescription />
          <textarea
            onChange={handleDescriptionChange}
            value={Description}
            className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Description"
            required
            name="Description"
            rows={2} // Atur jumlah baris sesuai kebutuhan
          />
        </div>

        {/* <div className="mb-2 px-4">
          <label
            htmlFor="Description"
            className="text-sm font-medium text-gray-900"
          >
            Description
          </label>
          <textarea
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            id="Description"
            name="Description"
            value={Description}
            onChange={handleDescriptionChange}
            placeholder="Description"
          />
        </div> */}

        <div className="mb-2 px-4">
          <label
            htmlFor="ImageCamp"
            className="text-sm font-medium text-gray-900"
          >
            Image
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="uploadedFile"
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-gray-800 hover:bg-gray-100"
            >
              {uploadedFile ? (
                <img
                  src={URL.createObjectURL(uploadedFile)}
                  alt="Image"
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 bg-gray-50 rounded-lg w-28">
                  <IconPhotoScan className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                  <div className="flex flex-col items-center justify-center bg-primary rounded-lg w-20">
                    <IconCamera className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                  </div>
                </div>
              )}
              <input
                id="uploadedFile"
                type="file"
                className="hidden"
                onChange={handleImageCampChange}
              />
            </label>
          </div>
          <p className="text-xs text-primary font-semibold">
            *file yang diperbolehkan jpg, jpeg, png dan max 5mb
          </p>
        </div>

        <div className="grid gap-4 content-center px-4 mb-2">
          <button
            type="submit"
            className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Lanjut
          </button>
        </div>
      </form>
    </>
  );
}
function StepTwo({ updateLocalStorage, loading, setLoading }) {
  const router = useRouter();

  const [locationInfo, setLocationInfo] = useState(null);
  const [location, setLocation] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [Jalan, setJalan] = useState(""); // menggunakan respon address
  const [DetaiAlamat, setDetaiAlamat] = useState("");
  const [coordinates, setCoordinates] = useState("");

  const [tracking, setTracking] = useState(true);

  const handleDataFromMap = (receivedLocationInfo) => {
    setLocationInfo(receivedLocationInfo);
  };

  const getCurrentLocation = () => {
    setTracking((prevTracking) => !prevTracking);
  };

  const handleJalanChange = (event) => {
    setJalan(event.target.value);
  };

  const handleDetaiAlamatChange = (event) => {
    setDetaiAlamat(event.target.value);
  };

  useEffect(() => {
    if (locationInfo) {
      setLocation(locationInfo.fullAdres);
      setProvince(locationInfo.province);
      setCity(locationInfo.city);
      setSubDistrict(locationInfo.sub_district);
      setPostalCode(locationInfo.postal_code);
      setJalan(locationInfo.address);
      setCoordinates(locationInfo.coordinates);
    }
  }, [locationInfo]);

  useEffect(() => {
    // Check local storage for existing form data
    const storedFormData = localStorage.getItem("formData");
    if (storedFormData) {
      const parsedFormData = JSON.parse(storedFormData);
      if (parsedFormData) {
        // Merge the existing data with the new data
        setLocation(parsedFormData.location || "");
        setJalan(parsedFormData.Jalan || "");
        setDetaiAlamat(parsedFormData.DetaiAlamat || "");
        setCoordinates(parsedFormData.coordinates || "");
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!location || !Jalan || !DetaiAlamat) {
      window.alert("All fields are required");
      return;
    }
    if (!coordinates) {
      Swal.fire({
        icon: "error",
        title: "Koordinat tidak ditemukan",
        text: "lokasi tidak ditemukan, Silakan pilih lokasi di peta",
        showConfirmButton: false,
        timer: 2000

      })
      return;
    }

    const formData = {
      // set the existing data
      ...JSON.parse(localStorage.getItem("formData")),
      location,
      Jalan,
      DetaiAlamat,
      coordinates,
      province,
      city,
      subDistrict,
      postalCode,
    };

    // upload data to local storage
    updateLocalStorage(formData);

    router.push(`creatcampaign?step=3`);
  };

  return (
    <>
      <ol className="flex justify-center mb-4 sm:mb-5 w-full p-2">
        <RoutStep
          liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block  after:border-b after:border-4 after:border-primary`}
          divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-primary`}
          iconCss={`w-4 h-4 text-white lg:w-6 lg:h-6 `}
          iconName={"CalendarEvent"}
        />
        <RoutStep
          liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block   after:border-b after:border-4 after:border-gray-700`}
          divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-primary`}
          iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
          iconName={"Map"}
        />
        <RoutStep
          liCss={`flex items-center`}
          divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-gray-700`}
          iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
          iconName={"CalendarEvent"}
        />
      </ol>

      <div className="flex justify-center border-gray-300 rounded-lg w-full mb-2 px-8">
        <button
          onClick={getCurrentLocation}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          {tracking ? <p>Set Current Location</p> : <p>Custom Location</p>}
        </button>
      </div>
      <form className="p-2 w-full px-6 space-y-2" onSubmit={handleSubmit}>
        <div className="flex justify-center border-gray-300 rounded-lg mb-1">
          <DynamicMap sendDataToPage={handleDataFromMap} tracking={tracking} />
        </div>
        <div className="grid gap-4 content-center px-4 mb-2">
          <p className="text-primary font-semibold text-xs">
            {tracking
              ? "*Klik map untuk menentukan lokasi"
              : "*Geser marker untuk menentukan lokasi"}
          </p>
        </div>
        <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          <IconMap />
          <textarea
            onChange={(e) => setLocation(e.target.value)}
            value={location}
            type="text"
            className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Wilayah"
            required
          />
        </div>
        <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          <IconHome2 />
          <input
            onChange={handleJalanChange}
            value={Jalan}
            type="text"
            className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Nama Jalan, Gedung, No Rumah"
            required
          />
        </div>

        <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none ">
          <IconDetails />
          <input
            onChange={handleDetaiAlamatChange}
            value={DetaiAlamat}
            type="text"
            className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Detail Lainnya"
            required
          />
        </div>
        <div className="grid gap-4 content-center pt-20 mb-2">
          <button
            type="submit"
            className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xl w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Lanjut
          </button>
        </div>
      </form>
    </>
  );
}
function StepThree({
  cart,
  updateCart,
  setUploadedFile,
  uploadedFile,
  loading,
  setLoading,
}) {
  const router = useRouter();

  const totalCartPrice = cart.reduce((total, item) => total + item.total, 0);
  const totalCartQuantity = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const groupedCart = cart.reduce((acc, item) => {
    const IdMerchan = item.merchant_id;
    if (!acc[IdMerchan]) {
      acc[IdMerchan] = [];
    }
    acc[IdMerchan].push(item);
    return acc;
  }, {});

  const handleDecrease = (IdMerchan, itemId) => {
    const updatedCart = [...cart];

    const itemIndex = updatedCart.findIndex(
      (item) => item.merchant_id === parseInt(IdMerchan) && item.id === itemId
    );

    // console.log("IdMerchan:", IdMerchan);
    // console.log("itemId:", itemId);
    // console.log("Data updatedCart:", updatedCart);
    // console.log("itemIndex:", itemIndex);

    if (itemIndex !== -1) {
      const updatedItem = { ...updatedCart[itemIndex] };

      if (updatedItem.quantity > 1) {
        updatedItem.quantity -= 1;
        updatedItem.total = updatedItem.quantity * updatedItem.price;

        updatedCart[itemIndex] = updatedItem;

        const totalCartPrice = updatedCart.reduce(
          (total, item) => total + item.total,
          0
        );
        const totalCartQuantity = updatedCart.reduce(
          (total, item) => total + item.quantity,
          0
        );

        console.log("updatedCart after decrease:", updatedCart);

        updateCart(updatedCart, totalCartPrice, totalCartQuantity);
      } else {
        handleRemove(IdMerchan, itemId);
      }
    } else {
      console.warn("Item not found in cart:", { IdMerchan, itemId });
    }
  };

  const handleIncrease = (IdMerchan, itemId, capacity) => {
    const updatedCart = [...cart];
    const itemIndex = updatedCart.findIndex(
      (item) => item.merchant_id === parseInt(IdMerchan) && item.id === itemId
    );

    if (updatedCart[itemIndex].quantity >= capacity) {
      return;
    }
    if (itemIndex !== -1) {
      updatedCart[itemIndex].quantity += 1;
      updatedCart[itemIndex].total =
        updatedCart[itemIndex].quantity * updatedCart[itemIndex].price;

      const totalCartPrice = updatedCart.reduce(
        (total, item) => total + item.total,
        0
      );
      const totalCartQuantity = updatedCart.reduce(
        (total, item) => total + item.quantity,
        0
      );

      updateCart(updatedCart, totalCartPrice, totalCartQuantity);
    }
  };

  const handleRemove = (IdMerchan, itemId) => {
    const updatedCart = cart.filter(
      (item) =>
        !(item.merchant_id === parseInt(IdMerchan) && item.id === itemId)
    );
    const totalCartPrice = updatedCart.reduce(
      (total, item) => total + item.total,
      0
    );
    const totalCartQuantity = updatedCart.reduce(
      (total, item) => total + item.quantity,
      0
    );
    updateCart(updatedCart, totalCartPrice, totalCartQuantity);
  };

  const handleSubmit = async () => {
    console.log("data", cart);
    setLoading(true);
    const emptyFields = [];

    // Validate data
    if (!detonator_id) emptyFields.push("Detonator ID");
    if (!campData.eventName) emptyFields.push("Event Name");
    if (!campData.TypeEvent) emptyFields.push("Event Type");
    if (!campData.Tanggal) emptyFields.push("Event Date");
    if (!campData.Waktu) emptyFields.push("Event Time");
    if (!campData.Description) emptyFields.push("Description");
    if (!campData.province) emptyFields.push("Province");
    if (!campData.city) emptyFields.push("City");
    if (!campData.sub_district) emptyFields.push("Sub District");
    if (!campData.postal_code) emptyFields.push("Postal Code");
    if (!campData.location) emptyFields.push("Address");
    if (!campData.coordinates.lat) emptyFields.push("Latitude");
    if (!campData.coordinates.lng) emptyFields.push("Longitude");
    if (!mediaUploadResponse.data.body.file_url) emptyFields.push("Image URL");
    if (!products) emptyFields.push("Products");

    if (emptyFields.length > 0) {
      const errorMessage = `Please fill in all required fields: ${emptyFields.join(", ")}`;
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        showConfirmButton: false,
        timer: 2000
      });

      setLoading(false);
      return;
    }
    try {
      const totalCartPrice = cart.reduce(
        (total, item) => total + item.total,
        0
      );
      const totalCartQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
      );
      const campData = JSON.parse(localStorage.getItem("formData"));
      const detonator_id = sessionStorage.getItem("id");
      const token = sessionStorage.getItem("token");

      const formData = new FormData();
      formData.append("destination", "campaign");
      formData.append("file", uploadedFile);

      const mediaUploadResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}media/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "API Response media/upload:",
        mediaUploadResponse.data.body.file_url
      );

      if (mediaUploadResponse.status === 200) {
        const products = cart.map((item) => ({
          merchant_id: parseInt(item.merchant_id),
          merchant_product_id: parseInt(item.id),
          qty: parseInt(item.quantity),
        }));

        const eventData = {
          detonator_id: parseInt(detonator_id),
          event_name: campData.eventName,
          event_type: campData.TypeEvent,
          event_date: campData.Tanggal,
          event_time: campData.Waktu, // Check if you intended to use it twice
          description: campData.Description,
          donation_target: parseFloat(totalCartPrice),
          province: campData.province,
          city: campData.city,
          sub_district: campData.sub_district ?? "-",
          postal_code: campData.postal_code ?? "-",
          address: campData.location,
          latitude: String(campData.coordinates.lat),
          longitude: String(campData.coordinates.lng),
          image_url: mediaUploadResponse.data.body.file_url, // Set to the actual file_url
          food_required: parseInt(totalCartQuantity),
          food_total: parseInt(totalCartQuantity),
          products: products,
        };

        console.log("cek data", eventData);

        try {
          const createCampaignResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/create`,
            eventData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(
            "API Response create campaign:",
            createCampaignResponse.data
          );
          localStorage.removeItem("cart");
          localStorage.removeItem("formData");
          setLoading(false);
          // router.push("/detonator");

          Swal.fire({
            icon: "success",
            title: "Campaign Created!",
            text: "Campaign Berhasil dibuat Mohon Tunggu approval dari admin",
            showConfirmButton: false,
            timer: 2000,
          });

          setTimeout(() => {
            router.push("/detonator");
          }, 2000);
        } catch (error) {
          setLoading(false);
          console.error("Error creating campaign:", error);
          if (error.response && error.response.status === 401) {
            Error401(error, router);
          } else {
            Swal.fire({
              icon: "error",
              title: "Gagal Membuat Campaign",
              text: "Gagal Membuat Campaign Mohon Coba Lagi",
              showConfirmButton: false,
              timer: 2000,
            });
          }
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("API Error:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("cart");
        localStorage.removeItem("formData");
        Error401(error, router);
      } else {
        Swal.fire({
          icon: "error",
          title: "Image Gagal Upload",
          text: "Gagal Upload Image Mohon Coba Lagi",
          showConfirmButton: false,
          timer: 2000,
        });

        setTimeout(() => {
          router.push("/creatcampaign?step=1");
        }, 2000);
      }
    }
  };

  const handleLink = () => {
    router.push("/creatcampaign?step=5");
    console.log("data card", cart);
  };

  console.log("groupedCart add", groupedCart);

  // localStorage.removeItem('formData');
  // localStorage.removeItem('cart');

  return (
    <>
      <ol className="flex justify-center w-full p-2">
        <RoutStep
          liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block  after:border-b after:border-4 after:border-primary`}
          divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-primary`}
          iconCss={`w-4 h-4 text-white lg:w-6 lg:h-6 `}
          iconName={"CalendarEvent"}
        />
        <RoutStep
          liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block   after:border-b after:border-4 after:border-primary`}
          divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-primary`}
          iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
          iconName={"Map"}
        />
        <RoutStep
          liCss={`flex items-center`}
          divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-primary`}
          iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
          iconName={"CalendarEvent"}
        />
      </ol>
      <div className="container mx-auto">
        {/* <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" /> */}
        <div className="items-center justify-center mt-5 w-full">
          <div className="w-full bg-white  text-black rounded-lg inline-flex items-center px-4 py-2.5 ">
            <div
              className={`flex ${Object.keys(groupedCart).length > 0
                ? "justify-between"
                : "justify-center"
                } w-full`}
            >
              <div className="flex">
                {Object.keys(groupedCart).length > 0 ? (
                  <div className="text-left place-items-start">
                    <div className="font-medium text-xs text-gray-500">
                      Total {totalCartQuantity} Pesanan
                    </div>
                    <div className="text-primary font-bold text-lg">{`Rp ${totalCartPrice.toLocaleString(
                      undefined,
                      { minimumFractionDigits: 0, maximumFractionDigits: 0 }
                    )}`}</div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="flex justify-center items-center content-center">
                <button
                  onClick={handleLink}
                  type="submit"
                  className="text-primary hover:text-white flex flex-row items-center gap-1 border-2 border-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-xl text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                  <IconCirclePlus />
                  Menu
                </button>
              </div>
              {/* <div className="grid place-items-center">
                <button
                  onClick={handleLink}
                  className="flex rounded-lg w-20 h-10 grid grid-cols-3 gap-4 content-center text-white bg-primary p-2 hover:shadow-lg"
                >
                  <IconCirclePlus />
                  Menu
                </button>
              </div> */}
            </div>
          </div>
        </div>

        {/* <div className="items-center justify-center w-full"> */}
        <div className="items-center justify-center w-full">
          {/* <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" /> */}
          {Object.keys(groupedCart).length > 0
            ? Object.keys(groupedCart).map((IdMerchan, storeIndex) => (
              <div key={storeIndex} className="mb-4 p-2">
                {/* <h2 className="text-xl font-semibold my-2">ID :{IdMerchan}</h2> */}
                {groupedCart[IdMerchan].map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="bg-white text-black rounded-lg inline-flex items-center px-2 py-2 mb-2 w-full border border-primary"
                  >
                    <div className="flex h-30 w-full">
                      <img
                        className="w-28 h-28 rounded-xl bg-blue-100 mr-2 text-blue-600"
                        src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${item.images.length > 0
                          ? item.images[0].image_url
                          : ""
                          }`}
                        alt=""
                      />
                      <div className="flex flex-col justify-between w-full">
                        <div className="text-left place-items-start">
                          <div className="text-primary font-bold capitalize">
                            {item.name}
                            {/* {item.imageUrl} */}
                          </div>
                          <div className="mb-1 font-sans text-[11px]">
                            {/* terjual | Disukai oleh: 20 | */}
                            Max Quota: {item.capacity}
                          </div>
                          <div className="mb-1 font-sans text-[11px]">
                            {item.description}
                          </div>
                          {/* <p className="text-gray-600 mt-2">{`Total: Rp${(item.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p> */}
                          {/* <p className="text-gray-700">{`Total: $${item.total.toFixed(2)}`}</p> */}
                        </div>
                        <div className="mt-2 flex flex-row gap-4 justify-between">
                          <p className="font-bold text-primary">{`Rp ${(
                            item.price * item.quantity
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}`}</p>
                          <div className="grid place-items-center">
                            <div className="flex items-center">
                              <button
                                className=" text-black px-2 py-1 rounded-l hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                                onClick={() =>
                                  handleDecrease(
                                    IdMerchan,
                                    item.id,
                                    item.capacity
                                  )
                                }
                              >
                                <IconMinus size={15} />
                              </button>
                              <span className="px-4 text-blue-700 font-bold border rounded-md border-blue-900">
                                {item.quantity}
                              </span>
                              <button
                                className=" text-black px-2 py-1 rounded-r hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                                onClick={() =>
                                  handleIncrease(
                                    IdMerchan,
                                    item.id,
                                    item.capacity
                                  )
                                }
                              >
                                <IconPlus size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
            : ""}
        </div>
        {/* </div> */}

        {Object.keys(groupedCart).length > 0 ? (
          <div className="grid gap-4 h-screencontent-center px-4">
            <button
              onClick={handleSubmit}
              className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-xl text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Lanjut
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

function Stepfour({
  cart,
  updateCart,
  setCart,
  setUploadedFile,
  uploadedFile,
}) {
  const [groupedFoods, setGroupedFoods] = useState({});
  const router = useRouter();
  const IdMerchan = router.query.id;
  const nameMerchant = router.query.name;
  console.log("router", router);
  const detonator_id = sessionStorage.getItem("id");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    // Load cart data from local storage on component mount
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    // Fetch data from API
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant-product/filter?merchant_id=${IdMerchan}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // Filter foods with status 'approved'
        const approvedFoods = response.data.body.filter(
          (food) => food.status === "approved"
        );

        // Group approved foods by store
        const groupedByMerchant = approvedFoods.reduce((acc, food) => {
          const { merchant_id } = food;
          if (!acc[merchant_id]) {
            acc[merchant_id] = [];
          }
          acc[merchant_id].push(food);
          return acc;
        }, {});
        setGroupedFoods(groupedByMerchant);
      })

      .catch((error) => {
        if (error.response && error.response.status === 401) {
          Error401(error, router);
        }
        console.log(error);
      });
  }, [setCart]);

  const addToCart = (food) => {
    const existingItemIndex = cart.findIndex((item) => item.id === food.id);

    if (existingItemIndex !== -1) {
      const updatedCart = cart.map((item, index) =>
        index === existingItemIndex
          ? {
            ...item,
            quantity: item.quantity + food.quantity,
            total: (item.quantity + food.quantity) * item.price,
            capacity: food.qty,
          }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...cart, food];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = (food) => {
    const updatedCart = cart.filter(
      (item) =>
        !(item.merchant_id === parseInt(IdMerchan) && item.id === food.id)
    );
    const totalCartPrice = updatedCart.reduce(
      (total, item) => total + item.total,
      0
    );
    const totalCartQuantity = updatedCart.reduce(
      (total, item) => total + item.quantity,
      0
    );
    updateCart(updatedCart, totalCartPrice, totalCartQuantity);
  };

  const handleLink = () => {
    router.push("/creatcampaign?step=3");
  };

  const formatToRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  // console.log('groupedFoods', groupedFoods);
  // Calculate total price and total quantity
  // const totalHarga = cart.reduce((acc, item) => acc + item.total, 0).toFixed(0);
  const totalHarga = cart.reduce((acc, item) => acc + parseFloat(item.total), 0).toFixed(0);

  console.log('Total harga:', totalHarga);
  const jumlahMakanan = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="w-full">
      <Header title={"Pilih Menu"} />
      <div className="items-center justify-center mt-1 w-full">
        <div className="w-full bg-white  text-black rounded-lg inline-flex items-center px-4 py-2.5 ">
          <div className="flex justify-between w-full">
            <div className="flex">
              <div className="text-left place-items-start">
                <div className="mb-1 text-primary">
                  Total Harga:{" "}
                  {`Rp ${parseInt(totalHarga).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}`}
                </div>
                <div className="-mt-1 font-sans text-xs text-gray-500">
                  Jumlah Menu: {cart.length}
                </div>
              </div>
            </div>
            <div className="grid place-items-center">
              <button
                onClick={handleLink}
                className="flex rounded-lg w-20 h-10 grid grid-cols-3 gap-4 content-center text-white bg-primary p-2 hover:shadow-lg"
              >
                <IconGardenCart />
                Cart{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="items-center justify-center mt-2 w-full px-4">
        {Object.keys(groupedFoods).map((IdMerchan) => (
          <>
            {/* <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" /> */}
            <div key={IdMerchan} className="mb-4 flex flex-col gap-2">
              <h2 className="text-xl font-bold">{nameMerchant}</h2>
              {groupedFoods[IdMerchan].map((food) => (
                <>
                  <AddFoodCamp
                    cart={cart}
                    key={groupedFoods.id}
                    {...food}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                  />
                </>
              ))}
            </div>
          </>
        ))}
      </div>

      {/* <div className="container mx-auto mt-4 bg-white h-screen">
        <div className="items-center justify-center mt-2 w-full">
          
        </div>
      </div> */}
    </div>
  );
}

function Stepfive({ cart, setCart, setUploadedFile, uploadedFile, loading }) {
  const [groupedFoods, setGroupedFoods] = useState({});
  const router = useRouter();
  const [dataApi, setDataApi] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [location, setLocation] = useState("");
  const detonator_id = sessionStorage.getItem("id");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    // Check local storage for existing form data
    const storedFormData = localStorage.getItem("formData");
    if (storedFormData) {
      const parsedFormData = JSON.parse(storedFormData);
      if (parsedFormData) {
        // Merge the existing data with the new data
        setLocation(parsedFormData.location || "");
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!detonator_id || !token) {
          throw new Error("Missing required session data");
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant/filter?per_page=100000`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const approvedMerchants = response.data.body.filter((merchant) => {
          return (
            merchant.status === "approved" &&
            merchant.products.some((product) => product.status === "approved")
          );
        });
        console.log("page creat camp data", approvedMerchants);
        setDataApi(approvedMerchants);
        setFilteredData(approvedMerchants);
        // setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          Error401(error, router);
        }
        console.log("error =", error);
      }
    };

    fetchData();
  }, [detonator_id]);

  const handleLink = () => {
    router.push("/creatcampaign?step=3");
  };

  // Calculate total price and total quantity
  const totalHarga = cart.reduce((acc, item) => acc + item.total, 0).toFixed(2);
  const jumlahMakanan = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="container mx-auto px-4 bg-white">
      <Header title={"Pilih Merchant"} />
      {/* <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" /> */}

      {/* <div className="items-center justify-center mt-2 w-full h-full ">
        {loading && <p>Loading...</p>}

        {dataApi.map((item) => (
          <>
            <CardListMerchan key={item.id} data={item} />
          </>
        ))}
      </div> */}
      <p className="text-black font-light text-xs mb-5 flex flex-row items-center justify-center gap-1">
        <IconCurrentLocation color="red" />
        {location}
      </p>
      <div className="flex justify-center">
        <Image src={Market} />
      </div>
      <p className="py-2 pb-7 text-gray-700 font-medium text-xl">
        Merchant Terdekat
      </p>

      <div className="items-center justify-center w-full">
        <div className="items-center justify-center w-full">
          {loading && <p>Loading...</p>}

          {dataApi.map((item) => (
            <>
              <CardListMerchan key={item.id} data={item} />
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

export { StepOne, StepThree, StepTwo, Stepfive, Stepfour };

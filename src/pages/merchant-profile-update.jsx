import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import {
  IconBuildingStore,
  IconDeviceMobile,
  IconHome,
  IconInfoCircle,
  IconMapPin,
  IconUser,
} from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const MerchantUpdateProfile = (profile) => {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [dataUser, setDataUser] = useState();
  const [merchant_name, setMerchantName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [sub_district, setSub_district] = useState("");
  const [postal_code, setPostal_code] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(true);
  const [profile_pic, setProfilePic] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [validImage, setValidImage] = useState(true);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL
        }merchant/fetch/${localStorage.getItem("Merchant_id")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setDataUser(response.data.body);
        setPhone(response.data.body.no_link_aja);
        setMerchantName(response.data.body.merchant_name);
        setProfilePic(response.data.body.merchant_photo);
        if (localStorage.getItem("updatedAddress")) {
          const parseLocationObj = JSON.parse(
            localStorage.getItem("updatedAddress")
          );
          setAddress(parseLocationObj.fullAdres);
          setLatitude(parseLocationObj.coordinates.lat);
          setLongitude(parseLocationObj.coordinates.lng);
          setProvince(parseLocationObj.province);
          setPostal_code(parseLocationObj.postal_code);
          setSub_district(parseLocationObj.sub_district);
          setCity(parseLocationObj.city);
        } else {
          setAddress(response.data.body.address);
        }
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          Error401(error, router);
        }
      });
  }, []);

  const onSubmit = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("merchant_name", merchant_name);
    formData.append("province", province);
    formData.append("city", city);
    formData.append("sub_district", sub_district);
    formData.append("postal_code", postal_code);
    formData.append("address", address);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("no_link_aja", phone);
    if (uploadedFile) {
      formData.append("merchant_photo", uploadedFile);
    }
    axios
      .put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL
        }merchant/update/${localStorage.getItem("Merchant_id")}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        setLoading(false);
        const responeData = response.data.body;
        Swal.fire({
          position: "bottom",
          customClass: {
            popup: "custom-swal",
            icon: "custom-icon-swal",
            title: "custom-title-swal",
            confirmButton: "custom-confirm-button-swal",
          },
          willOpen: () => {
            Swal.getPopup().classList.add("swal2-show-swipeup");
          },
          willClose: () => {
            Swal.getPopup().classList.add("swal2-show-swipedown");
          },
          icon: "success",
          title: `<p class="w-auto pl-1 font-bold text-[25px]">Profile Toko Berhasil Diubah</p><p class="w-auto pl-1 font-light text-sm">Anda telah sukses merubah data toko anda</p>`,
          html: `
                  <div class="absolute px-24 ml-10 top-0 mt-4">
                    <hr class="border border-gray-400 w-10 h-1 bg-gray-400 rounded-lg "/>
                  </div>
                  `,
          width: "375px",
          showConfirmButton: true,
          confirmButtonText: "Kembali Ke Profile",
          confirmButtonColor: "#3FB648",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/profile");
          }
        });
      })
      .catch((error) => {
        setLoading(false);
        Error401(error, router);
      });
  };

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/heif",
        "image/heic",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        // Swal.fire({
        //   icon: "error",
        //   title: "Oops...",
        //   text: "Hanya file PNG, JPG, dan JPEG yang diizinkan!",
        // });
        setValidImage(false);
        event.target.value = "";
      } else if (file.size > maxSize) {
        // Swal.fire({
        //   icon: "error",
        //   title: "Oops...",
        //   text: "Ukuran gambar melebihi 5MB!",
        // });
        setValidImage(false);
        event.target.value = "";
      } else {
        setValidImage(true);
        setUploadedFile(file);
      }
    }
  };

  const PHONE_REGEX = /^(\+62|62|0)8[1-9][0-9]{7,10}$/;
  const [validPhone, setValidPhone] = useState(false);
  useEffect(() => {
    setValidPhone(PHONE_REGEX.test(phone));
  }, [phone]);

  return (
    <>
      <div className="bg-white flex flex-col px-1 h-screen">
        <Header title="Ubah Profile Toko" backto="/profile" />
        <div class="pt-12 w-full h-screen flex flex-col">
          <div
            className={`flex flex-col items-center justify-center mt-5 w-full gap-6 ${uploadedFile || validImage ? "mb-6" : ""
              }`}
          >
            <label
              htmlFor="images"
              className="w-24 h-24 rounded-full bg-blue-100 grid place-items-center text-blue-600 cursor-pointer"
            >
              {uploadedFile ? (
                <img
                  src={URL.createObjectURL(uploadedFile)}
                  alt="Foto KTP"
                  className="w-24 h-24 rounded-full bg-blue-100 grid place-items-center text-blue-600 object-cover"
                />
              ) : profile_pic !== "" ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${profile_pic}`}
                  alt=""
                  className="w-24 h-24 rounded-full bg-blue-100 grid place-items-center text-blue-600 object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-100 grid place-items-center text-blue-600 ">
                  <IconUser />
                </div>
              )}
              <input
                id="images"
                type="file"
                className="hidden"
                onChange={handleProfilePhotoChange}
              />
              <p className="text-[11px] mt-2 text-[#1D5882] font-semibold">
                Ganti
              </p>
            </label>
            <p
              className={
                !validImage
                  ? "font-semibold instructions text-[13px] flex items-center"
                  : "hidden"
              }
            >
              <span className="text-red-600">
                Max 5 Mb dan format .jpeg, .jpg, .png, .heif
              </span>
            </p>
          </div>
          <div className="mb-4 p-3 px-2 flex flex-col gap-3">
            <div
              className={`flex flex-row items-center p-3 pr-2 py-0  ${merchant_name ? "bg-transparent" : "bg-gray-50"
                } border-[1px] ${!merchant_name && "border-red-500"
                }  text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none`}
            >
              <IconBuildingStore />
              <input
                onChange={(e) => setMerchantName(e.target.value)}
                value={merchant_name}
                // defaultValue={dataUser?.merchant_name}
                type="text"
                id="name"
                className="text-black ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
                placeholder="Nama"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <div
                className={`flex flex-row items-center p-3 pr-2 py-0 ${phone ? "bg-transparent" : "bg-gray-50"
                  } border-[1px] ${(!phone && !validPhone && "border-red-500") ||
                  (phone && !validPhone && "border-red-500")
                  }  text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none`}
              >
                <IconDeviceMobile />
                <input
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  type="text"
                  id="name"
                  className="text-black ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
                  placeholder="No. Hp"
                  required
                />
              </div>
              <p
                className={
                  phone && !validPhone
                    ? "font-semibold instructions italic text-[10px] flex items-center"
                    : "hidden"
                }
              >
                <IconInfoCircle size={15} className="mr-1 text-red-600" />
                <span className="text-red-600">
                  Diawali dengan "08" dan min 10 digit
                </span>
              </p>
            </div>
            <div
              className={`flex flex-row items-start h-24 p-3 pr-2  ${address ? "bg-transparent" : "bg-gray-50"
                } border-[1px] ${!address && "border-red-500"
                }  text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none`}
            >
              <IconHome />
              <textarea
                disabled
                onChange={(e) => setAddress(e.target.value)}
                type="text"
                id="address"
                className="text-black ml-2 w-full h-full p-0 pr-0.5 pl-1 bg-transparent focus:border-none outline-none resize-none"
                placeholder="Alamat"
                required
                value={address}
              />
              <button
                onClick={() => {
                  router.push("/merchant-change-address");
                }}
                title="Pilih Map"
                className="text-red-400 h-full flex text-center justify-center items-center"
              >
                <IconMapPin />
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end py-8 px-2">
          <button
            disabled={!phone || !merchant_name || !address || !validPhone}
            onClick={onSubmit}
            className={`flex items-center justify-center ${!phone || !merchant_name || !address || !validPhone
                ? "bg-gray-400"
                : "bg-primary"
              } border-0 rounded-lg w-full h-10 text-white font-bold text-center`}
          >
            Ubah
          </button>
        </div>
        {loading && <Loading />}
      </div>
    </>
  );
};

export default MerchantUpdateProfile;

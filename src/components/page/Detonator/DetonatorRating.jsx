import Header from "@/components/Header";
import {
  Icon360View,
  IconCamera,
  IconFileDescription,
} from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAppState } from "../UserContext";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import j from "../../../../public/img/card/geprek.jpg";

const DetonatorRating = (DetonatorRating) => {
  const router = useRouter();
  const id_order = router.query.id;
  const id_camp = router.query.id_camp;
  // const id_merchant = router.query.id_mrc;
  const { state, setReportMechant } = useAppState();
  const [newReport, setnewReport] = useState({});
  const [dataOrder, setDataOrder] = useState({});
  const [star, setStar] = useState(newReport?.star || 0);
  const [description, setDescription] = useState(newReport?.description ?? "");
  const [loading, setloading] = useState(true);
  const [images, setImages] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setloading(true);
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/fetch/${id_camp}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((response) => {
        const orderData = response.data.body.orders.filter((order) => order.id === parseInt(id_order));
        setDataOrder(orderData[0]);
        setnewReport(response.data.body);
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
        Error401(error, router);
      })
  }, [id_camp]);

  useEffect(() => {
    setloading(false);
  }, [star]);

  const handleStarChange = (index) => {
    setStar(index);
  };

  const handledescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const handleSubmit = (event) => {

    setloading(true);
    const id_merchant = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    // Validation checks
    if (!star || !description || !images) {
      window.alert("All fields are required");
      return;
    }
    const formData = new FormData();
    formData.append("destination", "rating");
    formData.append("file", images);
    // setloading(true);
    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}media/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Set content type for FormData
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const eventData = {
            relation_id: parseInt(dataOrder?.merchant_id),
            relation_type: "merchant",
            order_id: parseInt(id_order),
            star,
            photo: response.data.body.file_url,
            note: description,
          }
          setnewReport(eventData);
          axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}rating/create`, eventData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((creatretingmerchant) => {

              Swal.fire({
                icon: "success",
                title: "Review Detonator Berhasil Disimpan",
                text: "Terima kasih telah memberi review detonator",
                showConfirmButton: false,
                timer: 2000,
              });

              setTimeout(() => {
                router.push("/detonator/review");
              }, 2000);
              setloading(false);
            })
            .catch((error) => {
              setloading(false);
              Error401(error, router);
            });
        }
      })
      .catch((error) => {
        setloading(false);
        if (condition === 401) {
          Error401(error, router);
        }
        Swal.fire({
          icon: "error",
          title: "Gagal Upload Image",
          text: "Gagal Upload Image, Mohon Coba Lagi",
          showConfirmButton: false,
          timer: 2000,
        })
      })

  }

  const handleImagesChange = (event) => {
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
        setImages(file);
      }
    }
  };

  return (
    <>
      <div className="container mx-auto pt-14 bg-white h-screen">
        <Header title="Review Menu Merchant" />
        <div className="place-content-center">
          <div className=" w-full p-2">
            <div className="flex justify-between items-center w-full p-2 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <img
                  src={"/img/card/geprek.jpg"}
                  alt="sadas"
                  className="w-20 h-20"
                />
                <div className="ml-2">
                  <p className="text-sm font-bold">{dataOrder?.qty}x {dataOrder?.merchant_product?.name}</p>
                  <p className="text-xs font-normal">{dataOrder?.merchant?.merchant_name}</p>
                  <p className="text-[11px] font-normal text-gray-400">
                    {`${newReport?.event_date} ${newReport?.event_time}`}
                  </p>
                  <p className="text-[11px] font-medium">
                    {dataOrder?.merchant_product?.note}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* <hr className="w-full h-0.5 mx-auto mt-2 bg-gray-300 border-0 rounded" /> */}
          <div className="p-2 mt-2">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="images"
                className="flex flex-col justify-center w-full h-32 border-2 border-black border-dashed rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-100"
              >
                {images ? (
                  <img
                    src={URL.createObjectURL(images)}
                    alt="Foto KTP"
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex items-center gap-2 px-3">
                    <div className="bg-primary text-white font-light w-20 py-5 rounded-xl flex items-center justify-center">
                      <IconCamera size={40} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Foto Makanan</p>
                      <p className="font-light text-xs">Ambil foto makanan</p>
                    </div>
                  </div>
                )}
                <input
                  id="images"
                  type="file"
                  className="hidden"
                  onChange={handleImagesChange}
                />
              </label>
            </div>
          </div>
          <div className="p-2 w-full">
            <div>
              <div className="flex flex-row p-4 pr-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
                <IconFileDescription className="mt-3.5" />
                <textarea
                  // maxLength={256}
                  onChange={handledescriptionChange}
                  value={description}
                  type="text"
                  className="ml-2 w-full min-h-[135px] p-0 py-4 pl-1 bg-transparent focus:border-none outline-none"
                  placeholder="Komentar"
                  required
                  style={{ resize: "none" }}
                />
              </div>
              <p className="text-end text-sm text-gray-400">
                <span className={description.length > 256 && "text-red-500"}>
                  {description.length}
                </span>
                /256
              </p>
            </div>
            <div className="mb-2 ml-4 flex justify-center">
              {[1, 2, 3, 4, 5].map((index) => (
                <svg
                  key={index}
                  className={`w-12 h-12 cursor-pointer ${index <= star ? "text-yellow-300" : "text-gray-500"
                    }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 33 18"
                  onClick={() => handleStarChange(index)}
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
              ))}
            </div>
            <div className="grid gap-4 mt-10 content-center">
              <button
                disabled={!star || !description || !images}
                onClick={() => handleSubmit()}
                type="submit"
                className={`${!star || !description || !images
                  ? "bg-gray-300"
                  : "bg-primary"
                  } text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-xl text-sm w-full sm:w-auto px-5 py-2.5 text-center`}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
        {loading && <Loading />}
      </div>
    </>
  );
};

export default DetonatorRating;

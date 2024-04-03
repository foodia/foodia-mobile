import {
  IconBowlFilled,
  IconCamera,
  IconFileDescription,
} from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Loading from "../Loading";

function StepOne({ Menu, setMenu }) {
  // const { stepForm } = props;
  const router = useRouter();
  const [name, setName] = useState(Menu?.name ?? "");
  const [description, setDescription] = useState(Menu?.description ?? "");
  const [price, setPrice] = useState(Menu?.price ?? "");
  const [qty, setQty] = useState(Menu?.qty ?? "");
  const [images, setImages] = useState(Menu?.images ?? "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleNameChange = (event) => {
    setName(capitalizeFirstLetter(event.target.value));
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handlePriceChange = (event) => {
    let inputVal = event.target.value;
    inputVal = inputVal.replace(/\D/g, ""); // Remove all non-numeric characters
    inputVal = inputVal.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Add dots every 3 digits
    setPrice(inputVal);
  };

  const handleQtyChange = (event) => {
    setQty(event.target.value);
  };

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

  const handleSubmit = (event) => {
    // event.preventDefault(); // Prevents the default form submission

    setLoading(true);
    if (!name || !description || !price || !qty || !images) {
      window.alert("All fields are required");
      return;
    }
    if (!/^\d+$/.test(qty)) {
      window.alert("Quantity must contain only digits");
      return;
    }
    if (!/^\d+$/.test(parseInt(price.replace(/\./g, ""), 10))) {
      window.alert("Price must contain only digits");
      return;
    }

    setMenu({
      name,
      description,
      price: parseInt(price.replace(/\./g, ""), 10),
      qty,
      images,
    });
    const token = sessionStorage.getItem("token");
    const idMerchant = sessionStorage.getItem("id");
    // Check if an image file is selected
    if (images) {
      const formData = new FormData();
      formData.append("destination", "merchant");
      formData.append("file", images);
      setLoading(true);
      axios
        .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}media/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Set content type for FormData
          },
        })
        .then((res) => {
          if (res.status === 200) {
            const dataRequest = {
              merchant_id: parseInt(idMerchant),
              name: name,
              description: description,
              price: parseInt(price.replace(/\./g, ""), 10),
              qty: parseInt(qty),
              images: [
                {
                  image_url: res.data.body.file_url,
                },
              ],
            };
            axios
              .post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant-product/create`,
                dataRequest,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then(() => {
                Swal.fire({
                  position: "bottom",
                  customClass: {
                    popup: "custom-swal",
                    icon: "custom-icon-swal",
                    title: "custom-title-swal",
                    confirmButton: "custom-confirm-button-swal",
                  },
                  icon: "success",
                  title: `<p class="w-auto pl-1 font-bold text-md">Pengajuan Menu Berhasil Dibuat</p><p class="text-sm w-auto pl-1 font-light">Terima kasih telah mengirim pengajuan menu, akan segera kami proses review</p>`,
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
                    router.push("/merchant");
                  }
                });
                setLoading(false);
              });
          }
        })
        .catch((error) => {
          setLoading(false);
          if (error.response.data.code === 401) {
            router.push("/login");
          }
        });
    } else {
      setLoading(false);
      // Handle the case where an image file is not selected
      window.alert("Please select an image file");
    }
  };

  return (
    <>
      <div className="p-5 space-y-5 py-0 w-full">
        <div className="flex flex-row items-center p-4 pr-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          <IconBowlFilled />
          <input
            onChange={handleNameChange}
            value={name}
            type="text"
            className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Nama Menu"
            required
          />
        </div>
        <div className="flex flex-row items-center p-4 pr-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          Rp.
          <input
            onChange={handlePriceChange}
            value={price}
            type="text"
            className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Harga Menu"
            required
          />
        </div>
        <div className="flex flex-row items-center p-4 pr-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          <p className="text-xs">Max.</p>
          <input
            onChange={handleQtyChange}
            value={qty}
            type="number"
            className="ml-2 w-full p-0 py-4 bg-transparent focus:border-none"
            placeholder="Maksimal Pesanan"
            required
          />
        </div>
        <div>
          <div className="flex flex-row p-4 pr-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
            <IconFileDescription className="mt-3.5" />
            <textarea
              // maxLength={256}
              onChange={handleDescriptionChange}
              value={description}
              type="text"
              className="ml-2 w-full min-h-[135px] p-0 py-4 pl-1 bg-transparent focus:border-none outline-none"
              placeholder="Deskripsi Menu"
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
        <div className="mb-2">
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

        <div className="grid gap-4 content-center">
          <button
            disabled={
              !name ||
              !description ||
              !price ||
              !qty ||
              !images ||
              description.length > 256
            }
            onClick={() => handleSubmit()}
            type="submit"
            className={
              !name ||
              !description ||
              !price ||
              !qty ||
              !images ||
              description.length > 256
                ? "bg-slate-400 text-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-bold rounded-xl text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                : "text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-bold rounded-xl text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            }
          >
            Ajukan
          </button>
        </div>
        {loading && <Loading />}
      </div>
    </>
  );
}

export { StepOne };

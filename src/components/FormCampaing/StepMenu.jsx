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
  });

  const handleNameChange = (event) => {
    setName(event.target.value);
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
    setImages(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents the default form submission
    setLoading(true);
    // Validation checks
    if (!name || !description || !price || !qty || !images) {
      window.alert("All fields are required");
      return;
    }

    if (!/^\d+$/.test(qty)) {
      window.alert("Quantity must contain only digits");
      return;
    }
    // if (!/^\d+$/.test(price)) {
    //   // window.alert("Price must contain only digits");
    //   console.log(parseInt(price.replace(/\./g, ""), 10));
    //   return;
    // }

    setMenu({
      name,
      description,
      price: parseInt(price.replace(/\./g, ""), 10),
      qty,
      images,
    });

    try {
      const token = sessionStorage.getItem("token");
      const idMerchant = sessionStorage.getItem("id");

      // Check if an image file is selected
      if (images) {
        const formData = new FormData();
        formData.append("destination", "merchant");
        formData.append("file", images);

        const mediaUploadResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}media/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data", // Set content type for FormData
            },
          }
        );

        console.log(
          "API Response media/upload:",
          mediaUploadResponse.data.body.file_url
        );

        if (mediaUploadResponse.status === 200) {
          console.log(mediaUploadResponse.data.data);

          const dataRequest = {
            merchant_id: parseInt(idMerchant),
            name: name,
            description: description,
            price: parseInt(price.replace(/\./g, ""), 10),
            qty: parseInt(qty),
            images: [
              {
                image_url: mediaUploadResponse.data.body.file_url,
              },
            ],
          };

          console.log("data req", dataRequest);

          try {
            const ResponeCreatMenu = await axios.post(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant-product/create`,
              dataRequest,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log(
              "API Response create Menu Merchant:",
              ResponeCreatMenu.data
            );

            Swal.fire({
              icon: "success",
              title: "Menu Created!",
              text: "Menu Berhasil dibuat Mohon Tunggu approval dari admin",
              showConfirmButton: false,
              timer: 2000,
            });

            setLoading(false);

            setTimeout(() => {
              router.push("/merchant");
            }, 2000);
          } catch (error) {
            setLoading(false);
            console.error("Error creating campaign:", error);
            if (error.response && error.response.status === 401) {
              router.push("/merchant");
            } else {
              Swal.fire({
                icon: "error",
                title: "Gagal Membuat Menu",
                text: "Gagal Membuat Menu Mohon Coba Lagi",
                showConfirmButton: false,
                timer: 2000,
              });
            }
          }
        }
      } else {
        // Handle the case where an image file is not selected
        window.alert("Please select an image file");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      console.error("Error creating campaign:", error);
      if (error.response && error.response.status === 401) {
        router.push("/merchant");
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Membuat Menu",
          text: "Gagal Membuat Menu Mohon Coba Lagi",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  };

  return (
    <>
      <form className="p-5 space-y-5 py-0 w-full" onSubmit={handleSubmit}>
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
          Max.
          <input
            onChange={handleQtyChange}
            value={qty}
            type="number"
            className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Maksimal Pesanan"
            required
          />
        </div>
        <div className="flex flex-row items-center p-4 pr-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          <IconFileDescription />
          <textarea
            onChange={handleDescriptionChange}
            value={description}
            type="text"
            className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Deskripsi Menu"
            required
          />
        </div>
        <div className="mb-2">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="images"
              className="flex flex-col justify-center px-2 w-full h-32 border-2 border-black border-dashed rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-100"
            >
              {images ? (
                <img
                  src={URL.createObjectURL(images)}
                  alt="Foto KTP"
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex items-center gap-2">
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
            type="submit"
            className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-bold rounded-xl text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Ajukan
          </button>
        </div>
        {loading && <Loading />}
      </form>
    </>
  );
}

export { StepOne };

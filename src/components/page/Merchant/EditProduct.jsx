// src/components/formCampaing/StepDetonator.jsx

import { IconBowlFilled, IconFileDescription } from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function EditProduct() {
  // const { stepForm } = props;
  const router = useRouter();
  const [dataProduct, setDataProduct] = useState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [images, setImages] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const ressponse = axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant-product/fetch/${router.query.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("data", response.data.body);

        setDataProduct(response.data.body);
        setName(response.data.body.name);
        setDescription(response.data.body.description);
        setPrice(response.data.body.price);
        setQty(response.data.body.qty);
        // setImages(response.data.body.images);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          sessionStorage.clear();
          router.push("/login");
        }
      });
  }, [router.query.id]);

  const Toast = Swal.mixin({
    toast: true,
    position: "center",
    iconColor: "white",
    customClass: {
      popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
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

  console.log("sfsfs", images);
  // const [error, setError] = useState("");

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents the default form submission

    let parsedPrice = price;

    if (typeof price === `string`) {
      parsedPrice = parseInt(price.replace(/\./g, ""), 10);
    }

    // Validation checks
    if (!name || !description || !price || !qty) {
      window.alert("All fields are required");
      return;
    }
    if (!/^\d+$/.test(qty)) {
      window.alert("Quantity must contain only digits");
      return;
    }
    // if (!/^\d+$/.test(price)) {
    //   window.alert("Price must contain only digits");
    //   return;
    // }

    if (parsedPrice > dataProduct.price * 1.3) {
      Toast.fire({
        icon: "error",
        title: "Harga tidak boleh melebihi 30% dari harga asli",
        iconColor: "bg-black",
      });
      return;
    }

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

        //   if (mediaUploadResponse.status === 200) {
        console.log(mediaUploadResponse.data.data);

        const dataRequest = {
          merchant_id: parseInt(idMerchant),
          name: name,
          description: description,
          price: parsedPrice,
          qty: parseInt(qty),
          images: [
            {
              image_url: mediaUploadResponse.data.body.file_url,
            },
          ],
        };

        console.log("data req", dataRequest);

        try {
          const ResponeCreatMenu = await axios.put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant-product/update/${router.query.id}`,
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
            title: "Update Menu!",
            text: "Menu Berhasil di update mohon tunggu approval dari admin",
            showConfirmButton: false,
            timer: 2000,
          });

          setTimeout(() => {
            router.push("/merchant");
          }, 2000);
        } catch (error) {
          console.error("Error creating campaign:", error);
          if (error.response && error.response.status === 401) {
            router.push("/merchant");
          } else {
            Swal.fire({
              icon: "error",
              title: "Gagal update Menu",
              text: "Gagal update Menu Mohon Coba Lagi",
              showConfirmButton: false,
              timer: 2000,
            });
          }
        }
      } else {
        const dataRequest = {
          merchant_id: parseInt(idMerchant),
          name: name,
          description: description,
          price: parsedPrice,
          qty: parseInt(qty),
        };

        axios
          .put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant-product/update/${router.query.id}`,
            dataRequest,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            console.log("API Response create Menu Merchant:", res.data.body);

            Swal.fire({
              icon: "success",
              title: "Update Menu!",
              text: "Menu Berhasil di update mohon tunggu approval dari admin",
              showConfirmButton: false,
              timer: 2000,
            });

            setTimeout(() => {
              router.push("/merchant");
            }, 2000);
          })
          .catch((error) => {
            console.error("Error creating campaign:", error);
            if (error.response && error.response.status === 401) {
              router.push("/merchant");
            } else {
              Swal.fire({
                icon: "error",
                title: "Gagal update Menu",
                text: "Gagal update Menu Mohon Coba Lagi",
                showConfirmButton: false,
                timer: 2000,
              });
            }
          });
      }
    } catch (error) {
      console.log(error);
      console.error("Error creating campaign:", error);
      if (error.response && error.response.status === 401) {
        router.push("/merchant");
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal update Menu",
          text: "Gambar Gagal Diupload Mohon Coba Lagi",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  };

  // useEffect(() => {
  //     console.log('Step1:', Menu);
  // }, [Menu]);

  return (
    <>
      {/* <h1>Campain: 1</h1> */}
      <form className="p-5 space-y-5 py-0 w-full" onSubmit={handleSubmit}>
        <div className="flex flex-row items-center p-4 pr-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          <IconBowlFilled />
          <input
            onChange={handleNameChange}
            value={name}
            id="name"
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
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-gray-800 hover:bg-gray-100 px-4"
            >
              {images ? (
                <img
                  src={URL.createObjectURL(images)}
                  alt="images Food"
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <img
                  // src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataProduct?.self_photo || ''}`}
                  src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataProduct?.images[0].image_url}`}
                  alt="images Food"
                  className="w-full h-full rounded-lg object-cover"
                />
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
            Ubah
          </button>
        </div>
      </form>
    </>
  );
}

export default EditProduct;

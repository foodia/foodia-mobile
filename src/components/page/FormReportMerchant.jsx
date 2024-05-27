import { IconCamera, IconFileDescription } from "@tabler/icons-react";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import CardPesanan from "../CardPesanan";
import Header from "../Header";
import Loading from "../Loading";
import Error401 from "../error401";
import { useAppState } from "./UserContext";
import CompressImage from "../CompressImage";

const FormReportMerchant = () => {
  const router = useRouter();
  const { state, setReportMechant } = useAppState();
  const [image_url, setimage_url] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const id_order = router.query.id;
  const [dataApi, setDataApi] = useState();
  const [description, setdescription] = useState("");
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (id_order) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}order/fetch/${id_order}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setDataApi(response.data.body);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          Error401(error, router);
        });
    }
  }, [id_order]);

  const handleimage_urlChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/heif",
      "image/heic",
    ];
    const maxSize = 5 * 1024 * 1024;
    setLoadingImage(true);
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hanya file PNG, JPG, dan JPEG dan HEIF yang diizinkan!",
      });
      setLoadingImage(false);
      return;
    }
    if (file.size <= maxSize) {
      setimage_url(file);
      setLoadingImage(false);
    } else {
      CompressImage(file)
        .then((compressedFile) => {
          const size = (compressedFile.size / (1024 * 1024)).toFixed(2);
          if (size <= maxSize) {
            setimage_url(compressedFile);
          } else {
            Toast.fire({
              icon: "error",
              title: "Ukuran gambar melebihi 5MB!",
              iconColor: "bg-black",
            });
          }
          setLoadingImage(false);
          console.log("hasil compressedFile", compressedFile);
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ukuran gambar melebihi 5MB!",
          });
          setLoadingImage(false);
        });
    }
  };

  const handledescriptionChange = (event) => {
    setdescription(event.target.value);
  };

  const handleStepTwoSubmit = () => {
    setLoading(true);
    if (!image_url || !description) {
      alert("Please fill in all fields.");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("destination", "rating");
    formData.append("file", image_url);

    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}media/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((mediaUploadResponse) => {
        if (mediaUploadResponse.status === 200) {
          const reqData = {
            campaign_id: dataApi?.campaign_id,
            title: `Makanan Di terima`,
            description,
            type: "merchant",
            order_id: parseInt(id_order),
            images: [
              {
                image_url: mediaUploadResponse.data.body.file_url,
              },
            ],
          };
          axios
            .post(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign-report/create`,
              reqData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((res) => {
              Swal.fire({
                icon: "success",
                title: "Report Berhasil",
                text: ``,
                showConfirmButton: false,
                timer: 2000,
              });
              setTimeout(() => {
                router.push(`/merchant/review`);
              }, 2000);
              setLoading(false);
            })
            .catch((error) => {
              setLoading(false);
              Error401(error, router);
              Swal.fire({
                icon: "error",
                title: "Gagal Membuat Report",
                text: "Gagal Membuat Report Mohon Coba Lagi",
                showConfirmButton: false,
                timer: 2000,
              });
            });
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        Error401(error, router);
      });
  };

  return (
    <>
      <div className="container mx-auto pt-14 bg-white h-screen">
        <Header title="Form Bukti Pengiriman" />
        <div className="place-content-center">
          <div className="grid justify-items-center w-full">
            <CardPesanan
              key={dataApi?.id}
              to={""}
              idOrder={dataApi?.id}
              img={
                dataApi?.merchant_product.images.length > 0
                  ? `${process.env.NEXT_PUBLIC_URL_STORAGE}${dataApi?.merchant_product.images[0].image_url}`
                  : "/img/default-image.png"
              }
              title={dataApi?.campaign.event_name}
              productName={dataApi?.merchant_product.name}
              created_at={moment(dataApi?.campaign?.created_at).format(
                "DD MMM YYYY hh:mm"
              )}
              date={`${moment(dataApi?.campaign?.event_date).format(
                "DD MMM YYYY"
              )} ${dataApi?.campaign?.event_time}`}
              qty={dataApi?.qty}
              price={dataApi?.merchant_product.price}
              total_amount={dataApi?.total_amount}
              status={dataApi?.approval_status}
              setLoading={setLoading}
            />
            <div className="px-6 mt-2 w-full">
              <div className="mb-2">
                <div className="relative flex items-center justify-center w-full">
                  <label
                    htmlFor="image_url"
                    className="flex items-center w-full h-36 border-2 border-gray-500 border-dashed rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-100"
                  >
                    {image_url ? (
                      <img
                        src={URL.createObjectURL(image_url)}
                        alt="Foto Selfi"
                        className="w-full h-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex p-4">
                        <div className="flex items-center justify-center bg-primary rounded-lg w-14 h-14">
                          <IconCamera className="w-8 h-8 text-white" />
                        </div>
                        <div className="my-auto ml-2">
                          <p className="text-sm font-bold text-black">
                            Foto Bukti Pengiriman
                          </p>
                          <p className="text-xs font-semibold text-gray-500">
                            Ambil Foto Bukti Pengiriman
                          </p>
                        </div>
                      </div>
                    )}
                    <input
                      id="image_url"
                      type="file"
                      className="hidden"
                      onChange={handleimage_urlChange}
                    />
                  </label>
                  {loadingImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 rounded-lg">
                      <svg
                        aria-hidden="true"
                        className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div className="py-4">
                <div className="flex flex-row p-4 pr-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
                  <IconFileDescription className="mt-3.5" />
                  <textarea
                    // maxLength={256}
                    onChange={(e) => handledescriptionChange(e)}
                    value={description}
                    type="text"
                    className="ml-2 w-full text-black min-h-[135px] p-0 py-4 pl-1 bg-transparent focus:border-none outline-none"
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

              <div className="grid gap-4 content-center">
                <button
                  disabled={!image_url || !description}
                  onClick={() => handleStepTwoSubmit()}
                  type="submit"
                  className={`text-white ${
                    !image_url || !description ? "bg-gray-400" : "bg-primary"
                  } focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-xl text-sm w-full sm:w-auto px-5 py-2.5 text-center`}
                >
                  Kirim
                </button>
              </div>
            </div>
          </div>
        </div>
        {loading && <Loading />}
      </div>
    </>
  );
};

export default FormReportMerchant;

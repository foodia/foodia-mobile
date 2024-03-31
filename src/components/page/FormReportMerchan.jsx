import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IconCamera, IconFileDescription, IconUser } from "@tabler/icons-react";
import InputForm from "../Imput";
import { useAppState } from "./UserContext";
import Swal from "sweetalert2";
import axios from "axios";
import Header from "../Header";
import CardPesanan from "../CardPesanan";
import moment from "moment";
import Loading from "../Loading";
import Error401 from "../error401";

const FormReportMerchan = () => {
  const router = useRouter();
  const { state, setReportMechant } = useAppState();
  const [image_url, setimage_url] = useState(null);
  const [description, setdescription] = useState("");
  const [loading, setloading] = useState(true);

  // the bug is here
  //   useEffect(() => {
  //     console.log("state p", state.reportMechant);
  //   }, [state]);

  useEffect(() => {
    // Ensure the user is logged in
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setloading(false);
    }
  }, [router]);

  const handleimage_urlChange = (event) => {
    setimage_url(event.target.files[0]);
  };

  const handledescriptionChange = (event) => {
    setdescription(event.target.value);
  };

  const handleStepTwoSubmit = async (event) => {
    setloading(true);
    if (!image_url || !description) {
      alert("Please fill in all fields.");
      return;
    }

    const token = sessionStorage.getItem("token");
    const id_merchant = sessionStorage.getItem("id");
    const formData = new FormData();
    formData.append("destination", "rating");
    formData.append("file", image_url);

    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}media/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Tambahkan header Content-Type untuk FormData
        },
      })
      .then((mediaUploadResponse) => {
        if (mediaUploadResponse.status === 200) {
          const reqData = {
            campaign_id: state.reportMechant?.campaign_id,
            title: `Peanan ${state.reportMechant?.merchant.merchant_name}`,
            description,
            type: "merchant",
            order_id: state.reportMechant?.id,
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
            .then(() => {
              Swal.fire({
                icon: "success",
                title: "Report Berhasil",
                text: `Report Berhasil, silahkan lakukan penilaian campaign.`,
                showConfirmButton: false,
                timer: 2000,
              });
              setTimeout(() => {
                router.push("/merchant/rating");
              }, 2000);
              setloading(false);
            })
            .catch((error) => {
              setloading(false);
              if (error.response && error.response.status === 401) {
                Error401(error, router);
              }
              console.error("Error creating report:", error);
              Swal.fire({
                icon: "error",
                title: "Gagal Membuat Report",
                text: "Gagal Membuat Report Mohon Coba Lagi",
                showConfirmButton: false,
                timer: 2000,
              });
            });
        } else {
          // Handle kesalahan jika upload media gagal
          console.error(
            "Error uploading media:",
            mediaUploadResponse.data.error
          );
          setloading(false);
        }
      })
      .catch(() => {
        setloading(false);
        if (error.response && error.response.status === 401) {
          Error401(error, router);

        }
        console.log("error");
      });
  };

  return (
    <>
      <div className="container mx-auto pt-14 bg-white h-screen">
        <Header title="Form Bukti Pengiriman" />
        <div className="place-content-center">
          <div className="grid justify-items-center w-full">
            <CardPesanan
              key={state.reportMechant?.id}
              to={``}
              idOrder={state.reportMechant?.id}
              img={
                state.reportMechant.merchant_product?.images.length > 0
                  ? `${process.env.NEXT_PUBLIC_URL_STORAGE}${state.reportMechant?.merchant_product.images[0].image_url}`
                  : "/img/default-image.png"
              }
              title={state.reportMechant.campaign?.event_name}
              productName={state.reportMechant.merchant_product?.name}
              created_at={moment(
                state.reportMechant.campaign?.created_at
              ).format("DD MMM YYYY hh:mm")}
              date={`${moment(state.reportMechant.campaign?.event_date).format(
                "DD MMM YYYY"
              )} ${state.reportMechant.campaign?.event_time}`}
              qty={state.reportMechant?.qty}
              price={state.reportMechant?.merchant_product?.price}
              total_amount={state.reportMechant?.total_amount}
              status={state.reportMechant?.order_status}
              setLoading={true}
            />
            <div className="px-6 mt-2 w-full">
              <div className="mb-2">
                {/* <label htmlFor="image_url" className="text-sm font-medium text-gray-900">Foto Selfi</label> */}
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image_url"
                    className="flex items-center w-full h-36 border-2 border-gray-500 border-dashed rounded-lg cursor-pointer bg-gray-200  hover:bg-gray-100"
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
                </div>
              </div>
              <div className="py-4">
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

              <div className="grid gap-4 content-center">
                <button
                  onClick={() => handleStepTwoSubmit()}
                  type="submit"
                  className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-xl text-sm w-full sm:w-auto px-5 py-2.5 text-center"
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

export default FormReportMerchan;

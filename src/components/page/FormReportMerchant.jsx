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

const FormReportMerchant = () => {
  const router = useRouter();
  const { state, setReportMechant } = useAppState();
  const [image_url, setimage_url] = useState(null);
  const id_order = router.query.id;
  const [dataApi, setDataApi] = useState();
  const [description, setdescription] = useState("");
  const [loading, setLoading] = useState(true);

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
    setimage_url(event.target.files[0]);
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
      .catch(() => {
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
                    onChange={(e) => handledescriptionChange(e)}
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

export default FormReportMerchant;

import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IconInfoCircle, IconMapPin } from "@tabler/icons-react";
import CardPesanan from "@/components/CardPesanan";
import Header from "@/components/Header";
import moment from "moment/moment";
import Link from "next/link";
import Swal from "sweetalert2";
import { useAppState } from "../UserContext";
import Error401 from "@/components/error401";
import Loading from "@/components/Loading";

const DetailPesanan = () => {
  const router = useRouter();
  const id_order = router.query.id;
  const [loading, setLoading] = useState(true);
  const [dataApi, setDataApi] = useState();
  const [confirmedOrder, setConfirmedOrder] = useState(0);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const status = localStorage.getItem("status");
    const id = localStorage.getItem("id");

    if (
      !role ||
      !token ||
      role !== "merchant" ||
      status !== "approved" ||
      !id
    ) {
      // Redirect to login if either role or token is missing or role is not 'detonator' or status is not 'approved'
      localStorage.clear();
      router.push("/login");
    } else {
      // Role is 'detonator' and token is present
      setLoading(false); // Set loading to false once the check is complete
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
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

          setConfirmedOrder(response.data.body.qty);
        })
        .catch((error) => {
          setLoading(false);
          Error401(error, router);
        });
    }
  }, [id_order]);
  const handleRejectButtonClick = async (e) => {
    e.preventDefault();

    // Show SweetAlert confirmation dialog
    Swal.fire({
      title: "Apakah Anda Yakin?",
      text: "Anda akan menolak pesanan. Tindakan ini tidak dapat dibatalkan.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Tolak Pesanan",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        if (!id || !token) {
          throw new Error("Missing required session data");
        }

        axios
          .put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}order/update/${id_order}`,
            {
              order_status: "tolak",
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then(() => {
            setLoading(false);
            Swal.fire({
              position: "bottom",
              customClass: {
                popup: "custom-swal",
                icon: "custom-icon-swal",
                title: "custom-title-swal",
                confirmButton: "custom-confirm-button-swal",
              },
              icon: "success",
              title: `<p class="w-auto pl-1 font-bold text-[25px]">Anda Berhasil Menolak Pesanan</p>`,
              html: `
                  <div class="absolute px-28 ml-4 top-0 mt-4">
                    <hr class="border border-black w-16 h-1 bg-slate-700 rounded-lg "/>
                  </div>
                `,
              width: "375px",
              showConfirmButton: true,
              confirmButtonText: "Kembali",
              confirmButtonColor: "#3FB648",
              allowOutsideClick: false,
            }).then((result) => {
              if (result.isConfirmed) {
                router.reload();
              }
            });
          })
          .catch((error) => {
            setLoading(false);
            Error401(error, router);
          });
      }
    });

    // If the user confirms, call the handleReject function
  };
  const handleAprovButtonClick = () => {
    Swal.fire({
      title: "Apakah Anda Yakin?",
      text: "Anda akan menyetujui pesanan. Tindakan ini tidak dapat dibatalkan.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3FB648",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Setujui Pesanan!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        if (!id || !token) {
          throw new Error("Missing required session data");
        }

        axios
          .put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}order/update/${id_order}`,
            {
              order_status: "terima",
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then(() => {
            setLoading(false);
            Swal.fire({
              position: "bottom",
              customClass: {
                popup: "custom-swal",
                icon: "custom-icon-swal",
                title: "custom-title-swal",
                confirmButton: "custom-confirm-button-swal",
              },
              icon: "success",
              title: `<p class="w-auto pl-1 font-bold text-[25px]">Anda Berhasil Menerima Pesanan</p><p class="w-auto pl-1 font-bold text-[25px]">Terima kasih telah membantu campaign kami</p>`,
              html: `
                  <div class="absolute px-28 ml-4 top-0 mt-4">
                    <hr class="border border-black w-16 h-1 bg-slate-700 rounded-lg "/>
                  </div>
                `,
              width: "375px",
              showConfirmButton: true,
              confirmButtonText: "Kembali",
              confirmButtonColor: "#3FB648",
              allowOutsideClick: false,
            }).then((result) => {
              if (result.isConfirmed) {
                router.reload();
              }
            });
          })
          .catch((error) => {
            setLoading(false);
            Error401(error, router);
          });
      }
    });
  };

  const calculateRemainingTime = (eventDate) => {
    const currentDate = new Date();
    const eventDateObject = new Date(eventDate);
    const timeDifference = eventDateObject - currentDate;

    // Calculate remaining time in days
    let remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (remainingDays < 0) {
      remainingDays = 0;
    }

    return remainingDays;
  };

  return (
    <>
      <div className="container mx-auto pt-14 bg-white h-full">
        <Header title="Detail Pesanan" backto="/merchant/pesanan" />
        <div className="place-content-center">
          {loading ? (
            <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-80 h-28 mx-auto">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-md bg-slate-200 h-16 w-16"></div>
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-2 bg-slate-200 rounded"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                      <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                    </div>
                    <div className="h-2 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
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
          )}

          {loading ? (
            <>
              <div class="p-2 rounded-md mt-2 px-4 animate-pulse">
                {/* <h5 class="text-xs mb-1 font-bold">Rangkuman Pesanan</h5> */}
                <div class="justify-between grid grid-cols-2 gap-2 ">
                  <div class="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                  <div class="text-right text-sm bg-gray-300 h-4 rounded"></div>
                  <div class="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                  <div class="text-right text-sm text-primary bg-gray-300 h-4 rounded"></div>
                  <div class="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                  <div class="text-right text-sm text-primary bg-gray-300 h-4 rounded"></div>
                </div>

                <hr class="h-px bg-gray-200 border-0 mt-2" />
                <div class="justify-between grid grid-cols-2 gap-2 py-4">
                  <div class="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                  <div class="text-right text-sm bg-gray-300 h-4 rounded"></div>
                  <div class="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                  <div class="text-right text-sm bg-gray-300 h-4 rounded"></div>
                </div>

                <hr class="h-px bg-gray-200 border-0" />
                <div class="justify-between grid grid-cols-2 gap-2 py-4">
                  <div class="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                  <div class="text-right text-sm bg-gray-300 h-4 rounded"></div>
                </div>
                <hr class="h-px bg-gray-200 border-0" />
                <div class="justify-between grid grid-cols-2 gap-2 py-4">
                  <div class="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                  <div class="flex gap-4">
                    <div class="text-right text-sm bg-gray-300 h-4 rounded"></div>
                    <a
                      href="#"
                      class="text-sm font-normal mb-12 text-red-500 bg-gray-300 h-4 rounded"
                    ></a>
                  </div>
                </div>
                <hr class="h-px bg-gray-200 border-0" />
                <div class="justify-between grid grid-cols-2 gap-2 py-4">
                  <div class="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                  <div class="text-right text-sm bg-gray-300 h-4 rounded"></div>
                </div>
                <hr class="h-px bg-gray-200 border-0" />
                <div class="py-4">
                  <div class="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                  <div class="font-normal mt-2 text-sm bg-gray-300 h-6 rounded"></div>
                </div>
              </div>
              <div className=" h-20 bottom-0 my-0 p-2rounded-md mt-2 mx-2 grid grid-cols-2 gap-4 place-content-center">
                <div
                  className={`bg-gray-200 text-white rounded-md h-10 w-full col-span-2`}
                >
                  --
                </div>
              </div>
            </>
          ) : (
            <div className="p-2 rounded-md mt-2 px-4">
              {/* <h5 className="text-xs mb-1 font-bold">Rangkuman Pesanan</h5> */}
              <div className="flex justify-between py-3">
                <p className="text-sm text-gray-400">Campaign</p>
                <p className="text-right text-sm">
                  {dataApi?.campaign.event_name}
                </p>
              </div>
              <hr />
              <div className="justify-between grid grid-cols-2 gap-2 py-3 ">
                <p className="text-sm text-gray-400">Target Donasi</p>
                <p className="text-right text-sm text-primary">
                  Rp.{" "}
                  {dataApi?.campaign.donation_target.toLocaleString("id-ID")}
                </p>
                <p className="text-sm text-gray-400">Donasi Terkumpul</p>
                <p className="text-right text-sm text-primary">
                  Rp.{" "}
                  {dataApi?.campaign.donation_collected.toLocaleString("id-ID")}
                </p>
                <p className="text-sm text-gray-400">Sisa Donasi</p>
                <p className="text-right text-sm text-primary">
                  Rp.{" "}
                  {dataApi?.campaign.donation_remaining.toLocaleString("id-ID")}
                </p>
              </div>

              <hr className="h-px bg-gray-200 border-0" />
              <div className="justify-between grid grid-cols-2 gap-2 py-4">
                <p className="text-sm text-gray-400">PIC</p>
                <p className="text-right text-sm">
                  {dataApi?.campaign.detonator.oauth.fullname}
                </p>
                <p className="text-sm text-gray-400"></p>
                <p className="text-right text-sm">
                  {dataApi?.campaign.detonator.oauth.phone}{" "}
                </p>
              </div>

              <hr className="h-px bg-gray-200 border-0" />
              <div className="justify-between grid grid-cols-2 gap-2 py-4">
                <p className="text-sm text-gray-400">Tanggal Pelaksanaan</p>
                <p className="text-right text-sm">
                  {`${moment(dataApi?.campaign?.event_date).format(
                    "DD MMM YYYY"
                  )} ${dataApi?.campaign?.event_time}`}
                </p>
              </div>
              <hr className="h-px bg-gray-200 border-0" />
              <div className="justify-between grid grid-cols-2 gap-2 py-4">
                <p className="text-sm text-gray-400">Tempat</p>
                <div className="flex gap-4">
                  <p className="text-right text-sm">
                    {dataApi?.campaign.address}
                  </p>
                  <Link
                    href={`/lokasi_camp/${dataApi?.campaign_id}`}
                    className="text-sm font-normal mb-12 text-red-500"
                  >
                    <IconMapPin />
                  </Link>
                </div>
              </div>
              <hr className="h-px bg-gray-200 border-0" />
              <div className="justify-between grid grid-cols-2 gap-2 py-4">
                <p className="text-sm text-primary">Pesanan Terkonfirmasi</p>
                <p className="text-right text-sm text-primary">
                  {confirmedOrder}
                </p>
              </div>
              <hr className="h-px bg-gray-200 border-0" />
              <div className="justify-between grid grid-cols-2 gap-2 py-4">
                <p className="text-sm text-primary">Total</p>
                <p className="text-right text-sm text-primary">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(dataApi?.total_amount)}
                </p>
              </div>
              <hr className="h-px bg-gray-200 border-0" />
              <div className="py-4">
                <p className="text-sm text-gray-400">Tentang Program</p>
                <p className={`font-normal mt-2 text-sm `}>
                  {dataApi?.campaign.description}
                </p>
              </div>
            </div>
          )}

          <div className=" h-20 bottom-0 my-0 p-2rounded-md mt-2 mx-2 grid grid-cols-2 gap-4 place-content-center">
            {dataApi?.order_status === "review" ? (
              <>
                <button
                  onClick={handleRejectButtonClick}
                  className="bg-white border-2 border-primary text-primary font-medium rounded-xl h-10"
                >
                  Tolak
                </button>
                <button
                  onClick={handleAprovButtonClick}
                  className="bg-primary border-2 border-primary text-white font-medium rounded-xl h-10"
                >
                  Terima
                </button>
              </>
            ) : dataApi?.order_status === "terima" ? (
              calculateRemainingTime(dataApi?.campaign?.event_date) > 1 ? (
                <div className="w-full col-span-2 flex flex-col gap-1">
                  <p className="instructions italic text-[10px] flex items-center">
                    <IconInfoCircle size={15} className="mr-1 text-red-600" />

                    <span className="text-red-600">
                      Konfirmasi pesanan dapat dibuat pada H-1 pelaksanaan
                      campaign
                    </span>
                  </p>
                  <button
                    disabled
                    className={`bg-gray-400 text-white rounded-md h-10 w-full col-span-2`}
                  >
                    Konfirmasi Pesanan
                  </button>
                </div>
              ) : (
                calculateRemainingTime(dataApi?.campaign?.event_date) <= 1 && (
                  <div className="w-full col-span-2 flex flex-col gap-1">
                    {dataApi?.campaign.donation_remaining <= 0 && (
                      <p className="instructions italic text-[10px] flex items-center">
                        <IconInfoCircle
                          size={15}
                          className="mr-1 text-red-600"
                        />

                        <span className="text-red-600">
                          Tidak ada sisa donasi yang tersisa
                        </span>
                      </p>
                    )}
                    <button
                      disabled={dataApi?.campaign.donation_remaining <= 0}
                      onClick={() => {
                        setLoading(true);
                        router.push(
                          `/merchant/order-confirmation?id=${id_order}`
                        );
                      }}
                      className={`${
                        dataApi?.campaign.donation_remaining <= 0
                          ? "bg-gray-400"
                          : "bg-primary"
                      } text-white rounded-md h-10 w-full col-span-2`}
                    >
                      Konfirmasi Pesanan
                    </button>
                  </div>
                )
              )
            ) : dataApi?.order_status === "diproses" ? (
              calculateRemainingTime(dataApi?.campaign?.event_date) > 0 ? (
                <div className="w-full col-span-2 flex flex-col gap-1">
                  <p className="instructions italic text-[10px] flex items-center">
                    <IconInfoCircle size={15} className="mr-1 text-red-600" />

                    <span className="text-red-600">
                      Bukti pengiriman dapat dibuat saat tanggal pelaksanaan
                    </span>
                  </p>
                  <button
                    disabled
                    className={`bg-gray-400 text-white rounded-md h-10 w-full col-span-2`}
                  >
                    Buat Bukti Pegiriman
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setLoading(true);
                    router.push(`/merchant/report?id=${id_order}`);
                  }}
                  className={`bg-primary text-white rounded-md h-10 w-full col-span-2`}
                >
                  Buat Bukti Pegiriman
                </button>
              )
            ) : dataApi?.order_status === "tolak" ? (
              <button
                disabled
                className="bg-red-500 text-white rounded-md h-10 col-span-2"
              >
                Pesanan Ditolak
              </button>
            ) : (
              dataApi?.order_status === "selesai" && (
                <button
                  disabled
                  className={`bg-gray-400 text-white rounded-md h-10 w-full col-span-2`}
                >
                  Pesanan Selesai
                </button>
              )
            )}
          </div>
        </div>
        {loading && <Loading />}
      </div>
    </>
  );
};

export default DetailPesanan;

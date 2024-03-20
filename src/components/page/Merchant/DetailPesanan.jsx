import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IconMapPin } from "@tabler/icons-react";
import CardPesanan from "@/components/CardPesanan";
import Header from "@/components/Header";
import moment from "moment/moment";
import Link from "next/link";
import Swal from "sweetalert2";
import { useAppState } from "../UserContext";

const DetailPesanan = () => {
  const router = useRouter();
  const { state, setReportMechant } = useAppState();
  const id_order = router.query.id;
  const [loading, setLoading] = useState(true);
  const [showFullText, setShowFullText] = useState(false);
  const [dataApi, setDataApi] = useState();

  const toggleReadMore = () => {
    setShowFullText((prevShowFullText) => !prevShowFullText);
  };

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    const token = sessionStorage.getItem("token");
    const status = sessionStorage.getItem("status");
    const id = sessionStorage.getItem("id");

    if (
      !role ||
      !token ||
      role !== "merchant" ||
      status !== "approved" ||
      !id
    ) {
      // Redirect to login if either role or token is missing or role is not 'detonator' or status is not 'approved'
      sessionStorage.clear();
      router.push("/login/merchant");
    } else {
      // Role is 'detonator' and token is present
      setLoading(false); // Set loading to false once the check is complete
    }
  }, [router]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          throw new Error("Missing required session data token");
        }
        if (!id_order) {
          throw new Error("Missing required session data id");
        }
        // console.log('id', id_order);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}order/fetch/${id_order}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDataApi(response.data.body);
        setLoading(false);
        // console.log('data', dataApi);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [loading, id_order]);
  const handleRejectButtonClick = async (e) => {
    e.preventDefault();

    // Show SweetAlert confirmation dialog
    const result = await Swal.fire({
      title: "Apakah Anda Yakin?",
      text: "Anda akan menolak pesanan. Tindakan ini tidak dapat dibatalkan.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Tolak Pesanan",
      cancelButtonText: "Batal",
    });

    // If the user confirms, call the handleReject function
    if (result.isConfirmed) {
      setLoading(false);
      try {
        const id = sessionStorage.getItem("id");
        const token = sessionStorage.getItem("token");

        if (!id || !token) {
          throw new Error("Missing required session data");
        }

        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}order/update/${id_order}`,
          {
            order_status: "tolak",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLoading(true);

        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handleAprovButtonClick = async (e) => {
    e.preventDefault();

    // Show SweetAlert confirmation dialog
    const result = await Swal.fire({
      title: "Apakah Anda Yakin?",
      text: "Anda akan menyetujui pesanan. Tindakan ini tidak dapat dibatalkan.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3FB648",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Setujui Pesanan!",
      cancelButtonText: "Batal",
    });

    // If the user confirms, call the handleReject function
    if (result.isConfirmed) {
      setLoading(false);
      try {
        const id = sessionStorage.getItem("id");
        const token = sessionStorage.getItem("token");

        if (!id || !token) {
          throw new Error("Missing required session data");
        }

        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}order/update/${id_order}`,
          {
            order_status: "diproses",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLoading(true);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
      // await handleAprov();
    }
  };
  const handleBuktiPengiriman = async (e) => {
    setLoading(true);
    // setReportMechant(dataApi);
    try {
      // Menggunakan setReportMechant untuk menyimpan data
      setReportMechant(dataApi);

      // Arahkan pengguna ke '/merchant/report'
      router.push("/merchant/report");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Gagal memasukkan data:", error);
      console.log("Tidak berhasil dimasukan");
    }
  };
  const getStatusIcon = () => {
    switch (dataApi?.order_status) {
      case "review":
        return "Review";
      case "diproses":
        return "Diproses";
      case "tolak":
        return "DiTolak";
      default:
        return null;
    }
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

  console.log(
    "remainingDays",
    calculateRemainingTime(dataApi?.campaign?.event_date)
  );

  return (
    <>
      <div className="container mx-auto pt-14 bg-white h-full">
        <Header title="Detail Pesanan" />
        <div className="place-content-center">
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
            status={dataApi?.order_status}
            setLoading={setLoading}
          />
          <div className="p-2 rounded-md mt-2 px-4">
            <h5 className="text-xs mb-1 font-bold">Rangkuman Pesanan</h5>

            <div className="justify-between grid grid-cols-2 gap-2 ">
              <p className="text-sm text-gray-400">Campaign</p>
              <p className="text-right text-sm">
                {dataApi?.campaign.event_name}
              </p>
              <p className="text-sm text-gray-400">Donation Target</p>
              <p className="text-right text-sm text-primary">
                Rp. {dataApi?.campaign.donation_target.toLocaleString("id-ID")}
              </p>
              <p className="text-sm text-gray-400">Donation Collected</p>
              <p className="text-right text-sm text-primary">
                Rp.{" "}
                {dataApi?.campaign.donation_collected.toLocaleString("id-ID")}
              </p>
            </div>

            <hr className="h-px bg-gray-200 border-0 mt-2" />
            <div className="justify-between grid grid-cols-2 gap-2 py-4">
              <p className="text-sm text-gray-400">PIC</p>
              <p className="text-right text-sm">
                {dataApi?.campaign.detonator.oauth.fullname}
              </p>
              <p className="text-sm text-gray-400">No Telp.</p>
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
              <p className="text-sm text-gray-400">Pesanan</p>
              <p className="text-right text-sm">
                {dataApi?.qty} x {dataApi?.merchant_product.name}
              </p>
            </div>
            <hr className="h-px bg-gray-200 border-0" />
            <div className="justify-between grid grid-cols-2 gap-2 py-4">
              <p className="text-sm text-gray-400">Total</p>
              <p className="text-right text-sm text-primary">
                Rp. {dataApi?.total_amount.toLocaleString("id-ID")}
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
            ) : dataApi?.order_status === "diproses" ? (
              calculateRemainingTime(dataApi?.campaign?.event_date) > 0 ? (
                <div className="w-full col-span-2 flex flex-col gap-1">
                  <p className="text-xs text-red-500">
                    Bukti pengiriman dapat dibuat saat tanggal pelaksanaan
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
                  onClick={handleBuktiPengiriman}
                  className={`bg-primary text-white rounded-md h-10 w-full col-span-2`}
                >
                  Buat Bukti Pegiriman
                </button>
              )
            ) : dataApi?.order_status === "tolak" ? (
              <button className="bg-red-500 text-white rounded-md h-10 col-span-2">
                Pesanan Ditolak
              </button>
            ) : (
              dataApi?.order_status === "selesai" && (
                <button
                  disabled
                  className="bg-blue-400 text-white rounded-md h-10 col-span-2"
                >
                  Pesanan Selesai
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailPesanan;

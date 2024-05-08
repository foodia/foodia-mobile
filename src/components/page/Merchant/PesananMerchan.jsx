import CardPesanan from "@/components/CardPesanan";
import Error401 from "@/components/error401";
import styles from "@/styles/Home.module.css";
import { IconBowlFilled, IconCirclePlus } from "@tabler/icons-react";
import axios from "axios";
import moment from "moment/moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const PesananMerchan = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dataApi, setDataApi] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("review");

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
    const fetchData = async () => {
      try {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        if (!id || !token) {
          throw new Error("Missing required session data");
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}order/filter?merchant_id=${id}&order_status=${selectedStatus}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const approvedPesanan = response.data.body.filter(
          (pesanan) => pesanan.campaign.status === "approved"
        );
        setDataApi(approvedPesanan);
        setFilteredData(approvedPesanan);
        setLoading(false);

        if (approvedPesanan.length === 0) {
          setHasMore(false);
        }
      } catch (error) {
        setLoading(false);
        Error401(error, router);
      }
    };

    fetchData();
  }, [loading, selectedStatus]);

  const handleFilterChange = (status = "review") => {
    setLoading(true);
    let filtered = [];

    if (status === "review") {
      filtered = dataApi.filter((data) => data.order_status === "review");
    } else if (status === "diproses") {
      filtered = dataApi.filter((data) => data.order_status === "diproses");
    } else if (status === "selesai") {
      filtered = dataApi.filter(
        (data) =>
          data.order_status === "canceled" || data.order_status === "selesai"
      );
    }

    setSelectedStatus(status);
  };
  return (
    <>
      <div className="container mx-auto h-screen">
        <div className="flex items-center justify-center px-6 pt-16">
          <div className={`bg-gray-100 rounded-2xl w-full p-3`}>
            <div className="flex justify-between items-center">
              {router.pathname === "/merchant" ? (
                <Link
                  href="/createmenu?step=1"
                  className="grid justify-items-center gap-1 w-24"
                >
                  <div className={`${styles.iconMenu}`}>
                    <IconCirclePlus />
                  </div>
                  <p className="text-xs font-normal text-black">Tambah Menu</p>
                </Link>
              ) : (
                router.pathname === "/merchant/pesanan" && (
                  <Link
                    href="/merchant"
                    className="grid justify-items-center gap-1 w-24"
                  >
                    <div className={`${styles.iconMenu}`}>
                      <IconBowlFilled />
                    </div>
                    <p className="text-xs font-normal text-black">
                      Daftar Menu
                    </p>
                  </Link>
                )
              )}
              <Link
                href="/merchant/pesanan"
                className="grid justify-items-center gap-1 w-24 "
              >
                <div className={`${styles.iconMenu}`}>
                  <Image
                    src={"/icon/pesanan.png"}
                    alt="Girl in a jacket"
                    width={30}
                    height={30}
                  />
                </div>
                <p className="text-xs font-normal text-black">Pesanan</p>
              </Link>
              <Link
                href="/merchant/saldo"
                className="grid justify-items-center gap-1 w-24 "
              >
                <div className={`${styles.iconMenu}`}>
                  <Image
                    src={"/icon/saldo.png"}
                    alt="Girl in a jacket"
                    width={30}
                    height={30}
                  />
                </div>
                <p className="text-xs font-normal text-black">Saldo</p>
              </Link>
              <Link
                href="/merchant/review"
                className="grid justify-items-center gap-1 w-24 "
              >
                <div className={`${styles.iconMenu}`}>
                  <Image
                    src={"/icon/ulasan.png"}
                    alt="Girl in a jacket"
                    width={30}
                    height={30}
                  />
                </div>
                <p className="text-xs font-normal text-black">Ulasan</p>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex justify-between px-7 pt-4 pb-2">
          <div
            className={`w-full cursor-pointer grid pb-2 text-sm font-medium justify-items-center ${
              selectedStatus === "review"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }`}
            onClick={() => handleFilterChange("review")}
          >
            <span>Pesanan</span>
          </div>
          <div
            className={`w-full cursor-pointer grid pb-2 text-sm font-medium justify-items-center ${
              selectedStatus === "diproses"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }`}
            onClick={() => handleFilterChange("diproses")}
          >
            <span>Berlangsung</span>
          </div>
          <div
            className={`w-full cursor-pointer grid pb-2 text-sm font-medium justify-items-center ${
              selectedStatus === "selesai"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }`}
            onClick={() => handleFilterChange("selesai")}
          >
            <span>History</span>
          </div>
        </div>

        {loading ? (
          <div className={`${styles.card}`}>
            {[...Array(4)].map((_, index) => (
              <div key={index} className={`${styles.loadingCard}`}>
                <div className={`${styles.shimmer}`}></div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`${styles.card} `}>
            {filteredData.length == 0 ? (
              <p className="text-gray-400">
                {selectedStatus === "review"
                  ? "Tidak Ada Pesanan"
                  : selectedStatus === "diproses"
                  ? "Tidak Ada Pesanan Berlangsung"
                  : selectedStatus === "selesai" && "Tidak Ada Pesanan Selesai"}
              </p>
            ) : (
              filteredData.map((data) => (
                <CardPesanan
                  key={data.id}
                  to={`/merchant/detailpesanan/${data.id}`}
                  idOrder={data.id}
                  img={
                    data.merchant_product.images.length > 0
                      ? `${process.env.NEXT_PUBLIC_URL_STORAGE}${data.merchant_product.images[0].image_url}`
                      : "/img/default-image.png"
                  }
                  title={data.campaign.event_name}
                  productName={data.merchant_product.name}
                  created_at={moment(data.campaign?.created_at).format(
                    "DD MMM YYYY hh:mm"
                  )}
                  date={`${moment(data.campaign?.event_date).format(
                    "DD MMM YYYY"
                  )} ${data.campaign?.event_time}`}
                  qty={data.qty}
                  price={data.merchant_product.price}
                  status={data.approval_status}
                  total_amount={data.total_amount}
                  setLoading={setLoading}
                />
              ))
            )}
          </div>
        )}
      </div>
      {/* <div
        id="infinite-scroll-trigger"
        className={`${styles.loadingCard}`}
      ></div> */}
    </>
  );
};

export default PesananMerchan;

import Header from "@/components/Header";
import styles from "@/styles/Home.module.css";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAppState } from "../UserContext";
import Error401 from "@/components/error401";

const OrderConfirmation = () => {
  const router = useRouter();
  const { state, setReportMechant } = useAppState();
  const id_order = router.query.id;
  const [loading, setLoading] = useState(true);
  const [showFullText, setShowFullText] = useState(false);
  const [dataApi, setDataApi] = useState();
  const [maxOrder, setMaxOrder] = useState(0);
  const [qty, setQty] = useState(0);

  const toggleReadMore = () => {
    setShowFullText((prevShowFullText) => !prevShowFullText);
  };

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
      router.push("/login/merchant");
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
          setLoading(false);
          setDataApi(response.data.body);
          setLoading(false);

          setMaxOrder(
            response.data.body.campaign.donation_collected /
              response.data.body.merchant_product.price
          );
        })
        .catch((error) => {
          setLoading(false);
          Error401(error, router);
        });
    }
  }, [id_order]);

  return (
    <>
      <div className="h-screen mx-auto pt-14 bg-white">
        <Header title="Konfirmasi Pesanan" />
        <div className="h-full flex flex-col justify-between px-4">
          <div className="w-full">
            <div className="flex flex-col w-full py-10 gap-3">
              <div className="w-full justify-between flex flex-row">
                <p>Sisa Donasi</p>
                <p className="text-primary">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(dataApi?.campaign?.donation_collected || 0)}
                </p>
              </div>
              <hr className="border-gray-300 border-[1px] h-2px" />
              <div className="w-full justify-between flex flex-row">
                <p>Maksimal Pesanan</p>
                <p className="text-primary">{maxOrder}</p>
              </div>
              <div className="w-full justify-between flex flex-row">
                <p>Pesanan Terkonfirmasi</p>
                <p className="text-primary">{qty}</p>
              </div>
              <hr className="border-gray-300 border-[1px] h-2px" />
              <div className="w-full justify-between flex flex-row">
                <p>Total Pesanan</p>
                <p className="text-primary">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(qty * dataApi?.merchant_product?.price || 0)}
                </p>
              </div>
            </div>
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
              <div className="text-black rounded-2xl inline-flex items-center px-2 py-2 mb-2 w-full border-[1.5px] border-primary">
                <div className="flex h-30 w-full gap-2">
                  <img
                    className={`grid grid-cols-3 gap-4 place-items-end text-gray-500 rounded-lg object-cover ${styles.img_card}`}
                    src={
                      dataApi?.merchant_product?.images.length > 0
                        ? `${process.env.NEXT_PUBLIC_URL_STORAGE}${dataApi?.merchant_product?.images[0].image_url}`
                        : "/img/default-image.png"
                    }
                    alt=""
                  />
                  <div className="flex flex-col justify-between w-full">
                    <div className="text-left place-items-start">
                      <div className="text-primary font-bold capitalize">
                        {dataApi?.merchant_product?.name}
                      </div>
                      <div className="mb-1 font-sans text-[11px]">
                        Max Kuota: {dataApi?.merchant_product?.qty}
                      </div>
                      <div className="mb-1 font-sans text-[11px]">
                        {dataApi?.merchant_product?.description}
                      </div>
                    </div>
                    <div className="mt-2 flex flex-row gap-2 justify-between">
                      <p className="font-bold text-xl text-[#6CB28E]">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(dataApi?.merchant_product?.price || 0)}
                      </p>
                      <div className="grid place-items-center">
                        <div className="flex items-center">
                          <button
                            className=" text-black px-1 py-1 rounded-l hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                            onClick={() => setQty(qty - 1)}
                          >
                            <IconMinus size={15} />
                          </button>
                          <span className="px-4 text-blue-700 font-bold border rounded-md border-blue-900">
                            {qty}
                          </span>
                          <button
                            className=" text-black px-1 py-1 rounded-r hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                            onClick={() => setQty(qty + 1)}
                          >
                            <IconPlus size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="w-full p-2 rounded-md items-end flex pb-10">
            <button
              className={`bg-primary text-white font-bold rounded-xl h-10 w-full `}
            >
              Konfirmasi
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;

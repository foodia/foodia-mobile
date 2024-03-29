import styles from "@/styles/Home.module.css";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

const CardPesanan = (props) => {
  const {
    to,
    img,
    title,
    productName,
    total_amount,
    created_at,
    date,
    status,
    price,
    qty,
    idOrder,
    setLoading,
  } = props;

  const formatPrice = (price) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

    return formatter.format(price);
  };
  const getStatusIcon = () => {
    switch (status) {
      case "review":
        return "Review";
      case "diproses":
        return "Diproses";
      case "canceled":
        return "Canceled";
      case "selesai":
        return "Selesai";
      default:
        return null;
    }
  };
  const handleRejectButtonClick = async (e) => {
    e.preventDefault();

    // Show SweetAlert confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to reject the order. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject it!",
    });

    // If the user confirms, call the handleReject function
    if (result.isConfirmed) {
      setLoading(false);
      await handleReject();
    }
  };
  const handleReject = async () => {
    try {
      const id = sessionStorage.getItem("id");
      const token = sessionStorage.getItem("token");

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}order/update/${idOrder}`,
        {
          order_status: "canceled", // Add the data object here
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
      if (error.response && error.response.status === 401) {
        // Unauthorized error (e.g., token expired)
        sessionStorage.clear();
        router.push("/login/merchant");
      }
    }
  };
  const handleAprovButtonClick = async (e) => {
    e.preventDefault();

    // Show SweetAlert confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to approve the order. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3FB648",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, approve it!",
    });

    // If the user confirms, call the handleReject function
    if (result.isConfirmed) {
      setLoading(false);
      await handleAprov();
    }
  };
  const handleAprov = async () => {
    try {
      const id = sessionStorage.getItem("id");
      const token = sessionStorage.getItem("token");

      if (!id || !token) {
        throw new Error("Missing required session data");
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}order/update/${idOrder}`,
        {
          order_status: "diproses", // Add the data object here
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
  };

  const router = useRouter();

  const Card = () => {
    return (
      <div className="flex justify-between items-center w-80">
        <div className="flex items-center w-full p-1">
          <img
            src={img}
            className={`grid grid-cols-3 gap-4 place-items-end text-gray-500 rounded-lg object-cover ${styles.img_card}`}
            alt=""
          />
          <div className="text-left ml-2 w-full">
            <div className="flex justify-between">
              <p className="text-primary font-bold text-md capitalize">
                {title}
              </p>
              {/* <div className={`flex justify-center items-center rounded-full ${status === 'review' ? 'text-blue-600' : status === 'diproses' ? 'text-green-500' : status === 'canceled' ? 'text-red-500' : ''}`}>
                    <p className="">{getStatusIcon()}</p>
                  </div> */}
            </div>

            <div className="flex flex-col gap-1 italic">
              <div className="flex flex-row gap-1">
                <p className="font-sans text-xs text-gray-500">
                  Campaign Dibuat:{" "}
                </p>{" "}
                <p className="font-medium text-xs text-black">{created_at}</p>
              </div>
              <div className="flex flex-row gap-1">
                <p className="font-sans text-xs text-gray-500">Pelaksanaan: </p>{" "}
                <p className="font-medium text-xs text-black">{date}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex flex-col">
                <p className="text-gray-500 font-normal text-xs italic">{`${qty} x ${productName}`}</p>
                <span className="text-primary font-medium text-md">
                  {formatPrice(total_amount)}
                </span>
              </div>
              <div
                className={`flex justify-center items-center rounded-2xl w-auto h-5 px-2 py-0 ${
                  status === "review"
                    ? "bg-blue-600"
                    : status === "diproses"
                    ? "bg-green-500"
                    : status === "canceled"
                    ? "bg-red-500"
                    : status === "selesai"
                    ? "bg-blue-900"
                    : ""
                }`}
              >
                <p className="text-gray-100 font-medium text-[10px]">
                  {getStatusIcon()}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid place-items-center"></div>
      </div>
    );
  };

  return (
    <div className="flex justify-center mt-1 w-full mb-2 items-center">
      {router.pathname === "/merchant/pesanan" ? (
        <Link
          href={to}
          className={`bg-white flex hover:bg-gray-100 text-black rounded-2xl items-center border border-primary shadow-lg w-80 p-1`}
        >
          <Card />
        </Link>
      ) : (
        <div
          className={`bg-white flex  text-black rounded-2xl items-center border border-primary shadow-lg w-80 p-1`}
        >
          <Card />
        </div>
      )}
    </div>
  );
};

export default CardPesanan;

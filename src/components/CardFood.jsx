import styles from "@/styles/Home.module.css";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import Swal from "sweetalert2";

// key = { item.id }
// data = { item }
// to = {`food/${item.id}`}
// img = "/img/card/rectangle_70.png"
// title = { item.merchant_product.name }
// price = { item.merchant_product.price }
// name = "Warung Makan Amar"
// qty = { item.qty }
// status = { item.order_status }

const CardFood = (props) => {
  const {
    idProduct,
    to,
    img,
    title,
    address,
    date,
    status,
    description = "",
    price,
    qty = 0,
  } = props;

  const totalPrice = qty * price;
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
      case "waiting":
        // return <IconClockFilled size={22} />;
        return "Reviewed";
      case "approved":
        // return <IconCircleCheck size={22} />;
        return "Approved";
      case "rejected":
        // return <IconPlaystationX size={22} />;
        return "Rejected";
      default:
        return null;
    }
  };

  const onDeleteMenu = () => {
    Swal.fire({
      icon: "question",
      title: `Hapus Menu ${title}`,
      text: `Kamu Yakin Menghapus Menu Ini?`,
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: "Batal",
      confirmButtonText: "Hapus",
      confirmButtonColor: "#3fb648",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            process.env.NEXT_PUBLIC_API_BASE_URL +
              `merchant-product/delete/${idProduct}`,
            {
              headers: {
                authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => {
            Swal.fire({
              icon: "success",
              title: "Berhasil Menghapus Menu",
              showConfirmButton: false,
              timer: 2000,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Gagal Menghapus Menu",
              showConfirmButton: false,
              timer: 2000,
            });
          });
      }
    });
  };

  return (
    <div className="flex justify-center mt-1 w-full mb-2 items-center">
      <div
        className={`bg-white flex text-black rounded-2xl items-center border border-primary shadow-lg w-80 p-1`}
      >
        <div className="flex justify-between items-center w-80">
          <div className="flex items-center p-1">
            <img
              src={img}
              className={`grid grid-cols-3 gap-4 place-items-end text-gray-500 rounded-lg object-cover ${styles.img_card}`}
              alt=""
            />
            <div className={`text-left ml-2 w-56`}>
              <div className="flex justify-between pr-2">
                <p className="text-primary font-bold text-md capitalize">
                  {title}
                </p>
                {status !== "approved" ? (
                  <div
                    className={`flex justify-center items-center rounded-full h-5 ${
                      status === "waiting"
                        ? "bg-blue-600"
                        : status === "approved"
                        ? "bg-green-500"
                        : status === "rejected"
                        ? "bg-red-500"
                        : ""
                    }`}
                  >
                    <p className="text-white font-medium text-[10px] px-2">
                      {getStatusIcon()}
                    </p>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <p className="font-medium text-[10px] italic text-black mr-2 truncate ">
                {description}
              </p>
              {/* <div
                        className={`font-sans text-xs text-white rounded-lg w-14 h-10 flex justify-center items-center ${status == 'waiting' ? 'bg-blue-600' : status == 'approved' ? 'bg-green-500' : status == 'Rejected' ? 'bg-red-500' : ''
                            }`}
                    >
                        <p className="">{status}</p>
                    </div> */}
              <div className="flex justify-between w-full">
                <p className="mb-1 text-primary font-sans font-semibold text-sm truncate">
                  {formatPrice(price)}
                </p>
                {status == "approved" ? (
                  <div className="flex pr-2 gap-1">
                    <Link
                      href={`merchant/product/edit/${idProduct}`}
                      className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-medium py-3 p-2 text-sm h-2 rounded"
                    >
                      <IconEdit size={15} />
                    </Link>
                    {/* <button
                      onClick={() => onDeleteMenu()}
                      className="flex items-center bg-red-500 hover:bg-red-700 text-white font-medium py-3 p-2 text-sm h-2 rounded"
                    >
                      <IconTrash size={15} />
                    </button> */}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardFood;

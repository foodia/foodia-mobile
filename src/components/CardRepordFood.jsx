import styles from "@/styles/Home.module.css";
import {
    IconCheck,
    IconCircleCheck,
    IconClockFilled,
    IconHourglassEmpty,
    IconPackageExport,
    IconPlaystationX,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CardRepordFood = (props) => {
    const {
        id_order = "#",
        detonator_id,
        img,
        title,
        date,
        approval_status = "",
        price,
        qty = 0,
        nameMerchant = "",
        order_status = "",
        is_rating,
        is_report,
    } = props;
    const router = useRouter();
    const { id } = router.query;
    const [role, setRole] = useState();
    const [id_detonator, setIdDetonator] = useState();

    useEffect(() => {
        const role = sessionStorage.getItem("role");
        setIdDetonator(sessionStorage.getItem("id"));
        setRole(role);
        console.log("role", role);
    }, []);

    const totalPrice = qty * price;
    const formatPrice = (price) => {
        const formatter = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        });

        return formatter.format(price);
    };
    const getorder_status = () => {
        switch (order_status) {
            case "review":
                return <IconHourglassEmpty size={22} />;
            case "diproses":
                return <IconPackageExport size={22} />;
            case "selesai":
                return <IconCheck size={22} />;
            case "tolak":
                return <IconPlaystationX size={22} />;
            default:
                return null;
        }
    };
    const handleButoon = () => {
        if (order_status === "tolak") {
            if (is_rating) {
                return;
            } else {
                if (role === "detonator" && parseInt(detonator_id) === parseInt(id_detonator)) {
                    // console.log("to", to);
                    // console.log("cek iddetonator", detonator_id);
                    router.push(`/detonator/ganti-menu?ord=${id_order}&cmp=${id}&step=1`);

                } else {
                    return;
                }
            }
        } else {
            return;
        }

        // if (role === 'detonator') {
        //     router.push(`${to}`);
        // } else {
        //     return
        // }
    };

    return (
        <div className="flex justify-center mt-2 w-full mb-2">
            <div

                className={`bg-white  text-black rounded-lg inline-flex items-center shadow-lg w-80 p-1`}
            >
                <div className="flex justify-between w-80">
                    <div className="flex p-1">
                        <img
                            src={img}
                            className={`grid grid-cols-3 gap-4 place-items-end text-gray-500 w-14 h-14 object-cover rounded-full`}
                            alt=""
                        />
                        <div className={`text-left ml-2`}>
                            <div className="flex justify-between">
                                <p className=" text-primary font-sans font-bold text-xs truncate capitalize">
                                    {title}
                                </p>
                                {/* <div className={`flex justify-center items-center rounded-full  ${order_status === 'review' ? 'bg-blue-600' : order_status === 'approved' ? 'bg-green-500' : order_status === 'rejected' ? 'bg-red-500' : ''}`}>
                                    <p className="text-white">{getorder_status()}</p>
                                    <p className="text-white">{`${order_status === 'review' ? '' : order_status === 'approved' ? 'bg-green-500' : order_status === 'rejected' ? 'bg-red-500' : ''}`}</p>
                                </div> */}
                            </div>
                            <p className="mb-1 text-black font-sans font-bold text-xs truncate">
                                {nameMerchant}
                            </p>
                            <div className="flex">
                                <p className="font-sans text-xs  mr-2">{`jumlah :${qty}`}</p>
                                <div
                                    className={`font-sans text-xs  rounded-lg w-16 flex justify-center items-center px-2 ${approval_status === "waiting"
                                        ? "bg-blue-600"
                                        : approval_status == "approved"
                                            ? "bg-green-500"
                                            : approval_status == "rejected"
                                                ? "bg-red-500"
                                                : ""
                                        }`}
                                >
                                    <p className="text-black">{approval_status}</p>
                                </div>
                            </div>
                            {/* <p className="mb-1 text-black font-sans font-semibold text-sm truncate">{formatPrice(totalPrice)}</p> */}
                        </div>
                    </div>

                    <div className="grid place-items-center mr-2 mt-2">
                        {order_status === "tolak" && role === "detonator" ? (
                            <div onClick={handleButoon} className={`rounded-full ${detonator_id != id_detonator ? "cursor-not-allowed hover:bg-gray-300" : "cursor-pointer hover:bg-blue-300"}`}>
                                <div
                                    className={`flex justify-center items-center rounded-full ${order_status === "review"
                                        ? "text-blue-600"
                                        : order_status === "diproses"
                                            ? "text-orange-500"
                                            : order_status === "tolak"
                                                ? "text-primary border border-primary"
                                                : order_status === "selesai"
                                                    ? "text-primary"
                                                    : ""
                                        }`}
                                >
                                    <p className="mr-1">{getorder_status()}</p>
                                    <p className="w-16 break-words text-xs font-bold">{`${order_status === "review"
                                        ? "review"
                                        : order_status === "diproses"
                                            ? "Makanan Di Proses"
                                            : order_status === "tolak"
                                                ? "Ganti Menu"
                                                : order_status === "selesai"
                                                    ? "Telah Sampai"
                                                    : ""
                                        }`}</p>
                                    {/* <p className="w-16">tes deskripsi ini panjang</p> */}
                                </div>
                            </div>
                        ) : (
                            <div
                                className={`flex justify-center items-center rounded-full ${order_status === "review"
                                    ? "text-blue-600"
                                    : order_status === "diproses"
                                        ? "text-orange-500"
                                        : order_status === "selesai"
                                            ? "text-primary"
                                            : ""
                                    }`}
                            >
                                <p className="mr-1">
                                    {order_status === "tolak" ? "" : getorder_status()}
                                </p>
                                <p className="w-16 break-words text-xs font-bold">{`${order_status === "review"
                                    ? "review"
                                    : order_status === "diproses"
                                        ? "Makanan Di Proses"
                                        : order_status === "selesai"
                                            ? "Telah Sampai"
                                            : ""
                                    }`}</p>
                                {/* <p className="w-16">tes deskripsi ini panjang</p> */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardRepordFood;
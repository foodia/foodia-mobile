import styles from "@/styles/Home.module.css";
import { IconCircleCheck, IconClockFilled, IconEdit, IconPaint, IconPlaystationX, IconTrash, } from "@tabler/icons-react";
import Link from "next/link";


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
    const { to, img, title, address, date, status, description = '', price, qty = 0 } = props;

    const totalPrice = qty * price;
    const formatPrice = (price) => {
        const formatter = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        });

        return formatter.format(price);
    };
    const getStatusIcon = () => {
        switch (status) {
            case 'waiting':
                // return <IconClockFilled size={22} />;
                return 'Reviewed';
            case 'approved':
                // return <IconCircleCheck size={22} />;
                return 'Approved';
            case 'rejected':
                // return <IconPlaystationX size={22} />;
                return 'Rejected';
            default:
                return null;
        }
    };

    return (
        <div className="flex justify-center mt-1 w-full mb-2">

            <Link href={to} className={`bg-white hover:bg-gray-100 text-black rounded-lg items-center border shadow-lg w-80 p-1`}>
                <div className="flex justify-between w-80">
                    <div className="flex p-1">
                        <img
                            src={img}
                            className={`grid grid-cols-3 gap-4 place-items-end text-gray-500 rounded-lg object-cover ${styles.img_card}`}
                            alt=""
                        />
                        <div className={`text-left ml-1 w-56`}>
                            <div className="flex justify-between">
                                <p className="mb-1 text-black font-sans font-semibold text-sm truncate">{title}</p>
                                <div className={`flex justify-center items-center rounded-full  ${status === 'waiting' ? 'bg-blue-600' : status === 'approved' ? 'bg-green-500' : status === 'rejected' ? 'bg-red-500' : ''}`}>
                                    <p className="text-white  text-xs px-2">{getStatusIcon()}</p>
                                </div>
                            </div>
                            <div className="flex inline-block mt-1 ">
                                <p className="font-sans text-xs text-gray-500 mr-2 line-clamp-2 ">{description}</p>
                                {/* <div
                                    className={`font-sans text-xs text-white rounded-lg w-14 h-10 flex justify-center items-center ${status == 'waiting' ? 'bg-blue-600' : status == 'approved' ? 'bg-green-500' : status == 'Rejected' ? 'bg-red-500' : ''
                                        }`}
                                >
                                    <p className="">{status}</p>
                                </div> */}
                            </div>
                            <div className="flex justify-between mt-1 w-full mb-2">

                                <p className="mb-1 text-black font-sans font-semibold text-sm truncate">{formatPrice(price)}</p>
                                <div className="flex">
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 m-1 rounded"><IconEdit /></button>
                                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold p-1 m-1 rounded"><IconTrash /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid place-items-center"></div>
                </div>
            </Link>

        </div>
    );
};

export default CardFood;

import styles from "@/styles/Home.module.css";
import { IconCircleCheck, IconClockFilled, IconPlaystationX, } from "@tabler/icons-react";
import Link from "next/link";


// key = { item.id }
// data = { item }
// to = {`food/${item.id}`}
// img = "/img/card/rectangle_70.png"
// title = { item.merchant_product.name }
// price = { item.merchant_product.price }
// name = "Warung Makan Amar"
// qty = { item.qty }

const CardRepordFood = (props) => {
    const { to, img, title, date, approval_status = '', price, qty = 0, nameMerchant = '', order_status = '' } = props;

    const totalPrice = qty * price;
    const formatPrice = (price) => {
        const formatter = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        });

        return formatter.format(price);
    };
    const getorder_status = () => {
        switch (order_status) {
            case 'incoming':
                return <IconClockFilled size={22} />;
            case 'approved':
                return <IconCircleCheck size={22} />;
            case 'rejected':
                return <IconPlaystationX size={22} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex justify-center mt-1 w-full mb-2">

            <Link href={to} className={`bg-white hover:bg-gray-100 text-black rounded-lg inline-flex items-center ${styles.item_card}`}>
                <div className="flex justify-between w-80">
                    <div className="flex p-1">
                        <img
                            src={img}
                            className={`grid grid-cols-3 gap-4 place-items-end text-gray-500 rounded-lg object-cover ${styles.img_card}`}
                            alt=""
                        />
                        <div className={`text-left ml-1 ${styles.text_card}`}>
                            <div className="flex justify-between">
                                <p className="mb-1 text-primary font-sans font-semibold text-base truncate">{title}</p>
                                <div className={`flex justify-center items-center rounded-full  ${order_status === 'incoming' ? 'bg-blue-600' : order_status === 'approved' ? 'bg-green-500' : order_status === 'rejected' ? 'bg-red-500' : ''}`}>
                                    <p className="text-white">{getorder_status()}</p>
                                    <p className="text-white">{`${order_status === 'incoming' ? '' : order_status === 'approved' ? 'bg-green-500' : order_status === 'rejected' ? 'bg-red-500' : ''}`}</p>
                                </div>
                            </div>
                            <p className="mb-1 text-black font-sans font-semibold text-sm truncate">{nameMerchant}</p>
                            <div className="flex">
                                <p className="font-sans text-xs text-gray-500 mr-2">{`qty :${qty}`}</p>
                                <div
                                    className={`font-sans text-xs text-white rounded-lg w-14 flex justify-center items-center ${approval_status == 'waiting' ? 'bg-blue-600' : approval_status == 'approved' ? 'bg-green-500' : approval_status == 'Rejected' ? 'bg-red-500' : ''
                                        }`}
                                >
                                    <p className="">{approval_status}</p>
                                </div>
                            </div>
                            {/* <p className="mb-1 text-black font-sans font-semibold text-sm truncate">{formatPrice(totalPrice)}</p> */}
                        </div>
                    </div>
                    <div className="grid place-items-center"></div>
                </div>
            </Link>

        </div>
    );
};

export default CardRepordFood;

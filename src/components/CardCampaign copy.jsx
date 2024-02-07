import styles from "@/styles/Home.module.css";
import Link from "next/link";

const CardCampaign = (props) => {
    const { to, img, title, address, date, status } = props;
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
                            <p className="mb-1 text-black font-sans font-semibold text-sm truncate">{title}</p>
                            <div className="flex">
                                <p className="font-sans text-xs text-gray-500 mr-2">{date}</p>
                                <div
                                    className={`font-sans text-xs text-white rounded-lg w-14 flex justify-center items-center ${status == 'waiting' ? 'bg-blue-600' : status == 'Approved' ? 'bg-green-500' : status == 'Rejected' ? 'bg-red-500' : ''
                                        }`}
                                >
                                    <p className="">{status}</p>
                                </div>
                            </div>
                            <p className="font-sans text-xs text-gray-500 mr-2 ">{address}</p>
                        </div>
                    </div>
                    <div className="grid place-items-center"></div>
                </div>
            </Link>

        </div>
    );
};

export default CardCampaign;

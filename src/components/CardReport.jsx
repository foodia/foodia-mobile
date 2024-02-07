import styles from "@/styles/Campaign.module.css"
import { IconCaretDown, IconCaretUp } from '@tabler/icons-react';
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from 'react';

const CardReport = ({ data }) => {
    const router = useRouter();
    const { id } = router.query;
    const [showFullText, setShowFullText] = useState(false);
    const toggleReadMore = () => {
        setShowFullText((prevShowFullText) => !prevShowFullText);
    };
    return (
        <div className="block m-2  bg-white rounded-lg hover:shadow-md border bg-blue-100">
            <div className="flex p-2 ">
                <div className="w-1/3 mr-2">
                    <img
                        src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${data.images[0]?.image_url}`}
                        className={`rounded-lg object-cover ${styles.img_card}`}
                        alt=""
                    />
                </div>
                <div className="">
                    <h5 className="mb-2 text-sm font-bold tracking-tight text-gray-900">{`Paket ${data.title} Sudah sampai`}</h5>
                    <p className="text-xs text-gray-900">{data.created_at}</p>



                    <p className={`font-normal text-gray-700 text-xs  ${showFullText ? '' : styles.report_truncate}`}>
                        {data.description} Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                    </p>
                    <div className="bg-white hover:bg-gray-100 w-full grid place-content-center rounded-sm text-primary text-xs mt-2">
                        <button className="flex" onClick={toggleReadMore}>
                            Selengkapnya {showFullText ? <IconCaretUp size={20} /> : <IconCaretDown size={20} />}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default CardReport;
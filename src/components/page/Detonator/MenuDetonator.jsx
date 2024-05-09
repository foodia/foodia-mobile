import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import Error401 from "@/components/error401";


const MenuDetonator = (MenuDetonator) => {
    const router = useRouter();
    const pathname = router.pathname;
    const [jumlah, setJumlah] = useState(0);
    const [loading, setLoading] = useState(true);
    // console.log("router", router.pathname);
    useEffect(() => {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");
        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}rating/not-reviewed?type=detonator&id=${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                setLoading(false);
                console.log("review", res.data.body);
                setJumlah(res.data.body.length);
            }).catch((error) => {
                setLoading(false);
                Error401(error, router);
            })
    }, [pathname])

    const [menu, setMenu] = useState("campaign-list");
    // const [loading, setLoading] = useState(true);
    return <div className="flex flex-row items-center justify-around bg-gray-100 rounded-xl py-2 w-full">
        <div className="flex justify-center gap-5 px-1 py-3">
            {router.pathname === "/detonator" ? (
                <Link
                    // onClick={() => setLoading(true)}
                    href={"/createcampaign?step=1"}
                    className="grid gap-3 justify-items-center w-24"
                >
                    <div className={`${styles.iconMenu}`}>
                        <Image
                            src={"/icon/creat_camp.png"}
                            alt="creat_camp"
                            width={30}
                            height={30}
                        />
                    </div>
                    <p className="text-sm text-gray-600 font-normal">
                        Buat Campaign
                    </p>
                </Link>
            ) : (
                <Link
                    onClick={() => setMenu("campaign-list")}
                    href={"/detonator"}
                    className="grid gap-3 justify-items-center w-24"
                >
                    <div className={`${styles.iconMenu}`}>
                        <Image
                            src={"/icon/campaint.png"}
                            alt="creat_camp"
                            width={30}
                            height={30}
                        />
                    </div>
                    <p className="text-sm text-gray-600 font-normal">
                        List Campaign
                    </p>
                </Link>
            )}
        </div>
        <div className="flex justify-center gap-5 px-1 py-3">
            <Link
                href="/detonator/review"
                className="flex flex-col items-center justify-center gap-1 w-24"
            >
                <div className="relative w-[48px] h-[48px] rounded-md bg-menu text-green flex items-center justify-center">
                    <div className="absolute top-0 right-0 h-[13px] w-[13px] bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        <span>{loading ? '...' : jumlah}</span>
                    </div>
                    <Image
                        src={"/icon/ulasan.png"}
                        alt="Ulasan"
                        width={30}
                        height={30}
                    />

                </div>
                <p className="text-xs font-normal text-black">Ulasan</p>
            </Link>
        </div>
    </div>;
}

export default MenuDetonator;
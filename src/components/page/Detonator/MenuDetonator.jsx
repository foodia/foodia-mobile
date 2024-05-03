import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "@/styles/Home.module.css";


const MenuDetonator = (MenuDetonator) => {
    const router = useRouter();
    console.log("router", router.pathname);

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
                onClick={() => setMenu("review-list")}
                href={"/detonator/review"}
                className="grid gap-3 justify-items-center w-24"
            >
                <div className={`${styles.iconMenu}`}>
                    <Image
                        src={"/icon/review.png"}
                        alt="review"
                        width={30}
                        height={30}
                    />
                </div>
                <p className="text-sm text-gray-600 font-normal">Ulasan</p>
            </Link>
        </div>
    </div>;
}

export default MenuDetonator;
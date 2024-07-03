import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { IconMapPin } from "@tabler/icons-react";
import { useRouter } from "next/router";
import QRCode from "qrcode.react";
import { useEffect, useState } from "react";

const QrKupon = (QrKupon) => {
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(false);
    const [urlPrev, setUrlPrev] = useState(null);

    useEffect(() => {
        setUrlPrev(localStorage.getItem("urlPrev"));
    }, [urlPrev]);

    return (
        <div className="my-0 mx-auto max-w-480 bg-white flex flex-col h-screen">
            <Header title="Qr Kupon" backto={urlPrev ? urlPrev : "/beneficiaries"} />
            <div className="container mx-auto mt-16 bg-white pb-32">
                <div className="flex justify-center mb-[16px] ">
                    <IconMapPin className="mr-2 text-red-500" />
                    <div className="text-center">
                        <p className="text-[14px] font-semibold">Warung Makan Amar </p>
                        <p className="text-[14px] font-regular">Nasi Kuning</p>
                    </div>

                </div>

                <div className="flex justify-center text-primary font-bold text-2xl ">
                    <div className="flex justify-center items-center w-[328px] h-[328px]  border-2 border-primary rounded-lg ">
                        <QRCode value={id} size={276} />
                    </div>

                </div>

                <div className="mobile-w fixed flex justify-center pb-16 bottom-11 my-0 mx-auto w-full max-w-screen-sm ">
                    <div className="kotak shadow-inner px-4">
                        <button className="bg-white text-primary w-full h-12 rounded-xl font-bold border-4 border-primary text-[18px]" onClick={() => router.push("/beneficiaries")}>TUTUP</button>

                    </div>
                </div>
            </div>
            {loading && <Loading />}
        </div>
    );
}

export default QrKupon;
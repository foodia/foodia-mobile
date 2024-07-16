import CardPesanan from "@/components/CardPesanan";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import CardKupon from "@/components/page/Merchant/CardKupon";
import { IconCamera, IconMapPin } from "@tabler/icons-react";
import axios from "axios";
import moment from "moment";
import 'moment/locale/id';
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useRef, } from "react";
import { Carousel } from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Modal from 'react-modal';


const pelaporan = () => {
    const router = useRouter();
    const id_order = router.query.id;
    const [loading, setLoading] = useState(true);
    const [dataApi, setDataApi] = useState();
    const [confirmedOrder, setConfirmedOrder] = useState(0);
    const [prevPath, setPrevPath] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imgMakan, setImgMakan] = useState([]);
    const [imgPenerima, setImgPenerima] = useState([]);
    const [dataCarousel, setDataCarousel] = useState('');

    useEffect(() => {
        const FotoMakan = localStorage.getItem("imgMakanan");
        const FotoPenerima = localStorage.getItem("imgPenerima");
        if (FotoMakan) {
            setImgMakan(JSON.parse(FotoMakan));
        }
        if (FotoPenerima) {
            setImgPenerima(JSON.parse(FotoPenerima));
        }
    }, [])

    useEffect(() => {
        const prevPath = localStorage.getItem("prevPath");
        if (prevPath !== "order_confirmation") {
            setPrevPath(prevPath);
        } else if (prevPath === "order_confirmation") {
            setPrevPath("/merchant");
        }
    }, [])

    useEffect(() => {
        const role = localStorage.getItem("role");
        const token = localStorage.getItem("token");
        const status = localStorage.getItem("status");
        const id = localStorage.getItem("id");

        if (
            !role ||
            !token ||
            role !== "merchant" ||
            status !== "approved" ||
            !id
        ) {
            // Redirect to login if either role or token is missing or role is not 'detonator' or status is not 'approved'
            localStorage.clear();
            router.push("/login");
        }
    }, [router]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setLoading(true);
        if (id_order) {
            axios
                .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}order/fetch/${id_order}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    setDataApi(response.data.body);
                    setLoading(false);

                    setConfirmedOrder(response.data.body.qty);
                })
                .catch((error) => {
                    setLoading(false);
                    Error401(error, router);
                });
        }
    }, [id_order]);

    const openModal = (identifier, event) => {
        event.preventDefault(); // Menghentikan propagasi event
        event.stopPropagation(); // Menghentikan propagasi event

        const index = parseInt(identifier.split('_')[1]);

        if (identifier.startsWith('makan')) {
            setDataCarousel('makan');
            setCurrentImageIndex(index);
            setIsModalOpen(true);
        } else if (identifier.startsWith('penerima')) {
            setDataCarousel('penerima');
            setCurrentImageIndex(index);
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleAprovButtonClick = () => {
        Swal.fire({
            title: "Apakah Anda Yakin?",
            text: "Anda akan menyetujui pesanan. Tindakan ini tidak dapat dibatalkan.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3FB648",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Setujui Pesanan!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                const id = localStorage.getItem("id");
                const token = localStorage.getItem("token");

                if (!id || !token) {
                    throw new Error("Missing required session data");
                }

                axios
                    .put(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}order/update/${id_order}`,
                        {
                            order_status: "terima",
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    )
                    .then(() => {
                        setLoading(false);
                        Swal.fire({
                            position: "bottom",
                            customClass: {
                                popup: "custom-swal",
                                icon: "custom-icon-swal",
                                title: "custom-title-swal",
                                confirmButton: "custom-confirm-button-swal",
                            },
                            icon: "success",
                            title: `<p className="w-auto pl-1 font-bold text-[25px]">Anda Berhasil Menerima Pesanan</p><p className="w-auto pl-1 font-bold text-[15px] text-gray-400">Terima kasih telah membantu campaign kami</p>`,
                            html: `
                  <div className="absolute px-28 ml-4 top-0 mt-4">
                    <hr className="border border-black w-16 h-1 bg-slate-700 rounded-lg "/>
                  </div>
                `,
                            width: "375px",
                            showConfirmButton: true,
                            confirmButtonText: "Kembali",
                            confirmButtonColor: "#3FB648",
                            allowOutsideClick: false,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                router.reload();
                            }
                        });
                    })
                    .catch((error) => {
                        setLoading(false);
                        Error401(error, router);
                    });
            }
        });
    };

    return (
        <>
            <div className="container mx-auto pt-14 bg-white overflow-hidden max-h-screen" >
                <Header title="Detail Pesanan" backto={prevPath ? prevPath : ""} />
                <div className="">
                    {loading ? (
                        <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-80 h-28 mx-auto">
                            <div className="animate-pulse flex space-x-4">
                                <div className="rounded-md bg-slate-200 h-16 w-16"></div>
                                <div className="flex-1 space-y-6 py-1">
                                    <div className="h-2 bg-slate-200 rounded"></div>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                                            <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                                        </div>
                                        <div className="h-2 bg-slate-200 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <CardKupon
                            key={dataApi?.id}
                            to={""}
                            idOrder={dataApi?.id}
                            img={
                                dataApi?.merchant_product.images.length > 0
                                    ? `${process.env.NEXT_PUBLIC_URL_STORAGE}${dataApi?.merchant_product.images[0].image_url}`
                                    : "/img/default-image.png"
                            }
                            title={dataApi?.campaign.event_name}
                            productName={dataApi?.merchant_product.name}
                            created_at={moment(dataApi?.campaign?.created_at).format(
                                "DD MMM YYYY hh:mm"
                            )}
                            date={`${moment(dataApi?.campaign?.event_date).format(
                                "DD MMM YYYY"
                            )} ${dataApi?.campaign?.event_time}`}
                            qty={dataApi?.qty}
                            price={dataApi?.merchant_product.price}
                            total_amount={dataApi?.total_amount}
                            status={dataApi?.order_status}
                            setLoading={setLoading}
                        />
                    )}

                    {loading ? (
                        <>
                            <div className="p-2 rounded-md mt-2 px-4 animate-pulse">
                                {/* <h5 className="text-xs mb-1 font-bold">Rangkuman Pesanan</h5> */}
                                <div className="justify-between grid grid-cols-2 gap-2 ">
                                    <div className="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div className="text-right text-sm bg-gray-300 h-4 rounded"></div>
                                    <div className="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div className="text-right text-sm text-primary bg-gray-300 h-4 rounded"></div>
                                    <div className="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div className="text-right text-sm text-primary bg-gray-300 h-4 rounded"></div>
                                </div>

                                <hr className="h-px bg-gray-200 border-0 mt-2" />
                                <div className="justify-between grid grid-cols-2 gap-2 py-4">
                                    <div className="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div className="text-right text-sm bg-gray-300 h-4 rounded"></div>
                                    <div className="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div className="text-right text-sm bg-gray-300 h-4 rounded"></div>
                                </div>

                                <hr className="h-px bg-gray-200 border-0" />
                                <div className="justify-between grid grid-cols-2 gap-2 py-4">
                                    <div className="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div className="text-right text-sm bg-gray-300 h-4 rounded"></div>
                                </div>
                                <hr className="h-px bg-gray-200 border-0" />
                                <div className="justify-between grid grid-cols-2 gap-2 py-4">
                                    <div className="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div className="flex gap-4">
                                        <div className="text-right text-sm bg-gray-300 h-4 rounded"></div>
                                        <a
                                            href="#"
                                            className="text-sm font-normal mb-12 text-red-500 bg-gray-300 h-4 rounded"
                                        ></a>
                                    </div>
                                </div>
                                <hr className="h-px bg-gray-200 border-0" />
                                <div className="justify-between grid grid-cols-2 gap-2 py-4">
                                    <div className="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div className="text-right text-sm bg-gray-300 h-4 rounded"></div>
                                </div>
                                <hr className="h-px bg-gray-200 border-0" />
                                <div className="py-4">
                                    <div className="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div className="font-normal mt-2 text-sm bg-gray-300 h-6 rounded"></div>
                                </div>
                            </div>
                            <div className=" h-20 bottom-0 my-0 p-2rounded-md mt-2 mx-2 grid grid-cols-2 gap-4 place-content-center">
                                <div
                                    className={`bg-gray-200 text-white rounded-md h-10 w-full col-span-2`}
                                >
                                    --
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="px-[16px] flex flex-col h-screen justify-between">
                            {dataApi?.order_status === "review" ? (
                                <>
                                    <div className="">
                                        <Link href="/merchant/kupon/upload-bukti?makanan" className="bg-gray-200 text-white rounded-md p-[16px] w-full border-2 border-primary flex justify-between my-2">
                                            <div className="w-[52px] h-[52px] bg-primary rounded-md flex justify-center items-center"><IconCamera size={20} /></div>
                                            {imgMakan.length > 0 ? (
                                                <div className="  rounded-md my-auto flex">
                                                    {imgMakan.slice(0, imgMakan.length).map((item, index) => (

                                                        <img key={index} onClick={(event) => openModal(`makan_${index}`, event)} className="w-[52px] h-[52px] object-cover rounded-md mx-1"
                                                            src={item}
                                                        />
                                                    ))}
                                                </div>
                                            ) :
                                                <div className="flex flex-col items- my-auto w-[234px]">
                                                    <p className="text-black text-[12px] font-bold ">Foto Makanan yang Disajikan </p>
                                                    <p className="text-primary text-[10px] font-bold">Minimal 1 foto</p>
                                                </div>
                                            }
                                        </Link>

                                        <Link href="/merchant/kupon/upload-bukti?penerima" className="bg-gray-200 text-white rounded-md p-[16px] w-full border-2 border-primary flex justify-between">
                                            <div className="w-[52px] h-[52px] bg-primary rounded-md flex justify-center items-center"><IconCamera size={20} /></div>
                                            {imgPenerima.length > 0 ? (
                                                <div className=" rounded-md my-auto flex">
                                                    {imgPenerima.slice(0, imgPenerima.length).map((item, index) => (

                                                        <img key={index} onClick={(event) => openModal(`penerima_${index}`, event)} className="w-[52px] h-[52px] object-cover rounded-md mx-1"
                                                            src={item}
                                                        />
                                                    ))}
                                                </div>
                                            ) :
                                                <div className="flex flex-col items- my-auto w-[234px]">
                                                    <p className="text-black text-[12px] font-bold ">Foto Makanan dengan Penerima Manfaat </p>
                                                    <p className="text-primary text-[10px] font-bold">Minimal 2 foto</p>
                                                </div>
                                            }
                                        </Link>
                                    </div>
                                    <div className="w-full text-center my-2 mb-52">
                                        <button
                                            onClick={handleAprovButtonClick}
                                            className="bg-primary border-2 border-primary text-white font-medium rounded-lg h-10 px-2"
                                        >
                                            Pesana  Telah Selesai
                                        </button>
                                    </div>


                                    {/* <Link href="/merchant/kupon/upload-bukti?penerima" className="bg-gray-200 text-white rounded-md p-[16px] w-full border-2 border-primary flex justify-between">
                                        <div className="w-[52px] h-[52px] bg-primary rounded-md flex justify-center items-center"><IconCamera size={20} /></div>
                                        {imgPenerima.length > 0 ? (
                                            <div className=" bg-red-500 rounded-md my-auto">
                                                {imgPenerima.slice(0, imgPenerima.length).map((item, index) => (

                                                    <img key={index} onClick={() => openModal(`penerima_${index}`)} className="w-[52px] h-[52px] object-cover rounded-md"
                                                        src={item}
                                                    />
                                                ))}
                                            </div>
                                        ) :
                                            <div className="flex flex-col items- my-auto w-[234px]">
                                                <p className="text-black text-[12px] font-bold ">Foto Makanan dengan Penerima Manfaat </p>
                                                <p className="text-primary text-[10px] font-bold">Minimal 2 foto</p>
                                            </div>
                                        }
                                    </Link> */}


                                </>
                            ) : dataApi?.order_status === "claimed" ? (
                                <>
                                    <button
                                        onClick={handleAprovButtonClick}
                                        className="bg-primary border-2 border-primary text-white font-medium rounded-xl h-10"
                                    >
                                        Pesana  Telah Selesai
                                    </button>
                                </>

                            ) : null}
                        </div>
                    )}


                </div>
                {loading && <Loading />}
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Image Carousel"
                    className='modal'
                    overlayClassName='overlay'
                >
                    <button className='close-modal-button' onClick={closeModal}>Close</button>
                    <Carousel selectedItem={currentImageIndex}>
                        {dataCarousel === "makan" ? imgMakan.map((src, index) => (
                            <div key={index}>
                                <img
                                    className='img-carousel'
                                    src={src}
                                    alt={`Captured ${index + 1}`}
                                />
                            </div>
                        )) : imgPenerima.map((src, index) => (
                            <div key={index}>
                                <img
                                    className='img-carousel'
                                    src={src}
                                    alt={`Captured ${index + 1}`}
                                />
                            </div>
                        ))}

                    </Carousel>
                </Modal>
            </div>

        </>
    );
};

export default pelaporan;

// {imgSrc.map((src, index) => (
//     <div key={index}>
//         <img
//             className={styles['img-carousel']}
//             src={src}
//             alt={`Captured ${index + 1}`}
//         />
//     </div>
// ))}

// {imgMakan.length > 0 ? (
//     imgMakan.map((src, index) => (
//         <div key={index}>
//             <img
//                 className='img-carousel'
//                 src={src}
//                 alt={`Captured ${index + 1}`}
//             />
//         </div>
//     ))
// ) : imgPenerima.length > 0 ? (
//     imgPenerima.map((src, index) => (
//         <div key={index}>
//             <img
//                 className='img-carousel'
//                 src={src}
//                 alt={`Captured ${index + 1}`}
//             />
//         </div>
//     ))
// ) : null}
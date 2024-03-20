import styles from "@/styles/Campaign.module.css";
import {
  IconArrowNarrowRight,
  IconBellRingingFilled,
  IconChevronDown,
  IconChevronUp,
  IconClock,
  IconClockFilled,
  IconMapPin,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAppState } from "./UserContext";
import Loading from "../Loading";

const DetailCamp = ({ data }) => {
  const router = useRouter();
  const idCamp = router.query.id;
  const [showFullText, setShowFullText] = useState(false);
  const [loading, setloading] = useState(true);
  const { state, setDonation } = useAppState();
  const [nominalDonasi, setNominalDonasi] = useState(0);
  const toggleReadMore = () => {
    setShowFullText((prevShowFullText) => !prevShowFullText);
  };

  const formatUang = (nominal) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

    return formatter.format(nominal);
  };

  const calculateRemainingTime = (eventDate) => {
    const currentDate = new Date();
    const eventDateObject = new Date(eventDate);
    const timeDifference = eventDateObject - currentDate;

    // Calculate remaining time in days
    const remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return remainingDays;
  };

  useEffect(() => {
    if (data) {
      // Handle the case where data is not available yet
      setloading(false);
    }
  });

  const showSweetAlert = async () => {
    const swal = Swal.mixin({
      customClass: {
        popup: "custom-swal",
        icon: "custom-icon-swal",
        confirmButton: "custom-confirm-button-swal", // Custom class for styling
      },
      didRender: () => {
        const nominalInput = document.querySelector('input[name="nominal"]');
        const donationRadios = document.querySelectorAll(
          'input[name="donation"]'
        );

        // Menambahkan event listener untuk setiap radio button nominal
        donationRadios.forEach((radio) => {
          radio.addEventListener("click", () => {
            // Menghapus nilai input nominal jika opsi nominal dipilih
            nominalInput.value = "";
          });
        });

        // Menghapus nilai input nominal jika pengguna mulai mengetik di dalamnya
        nominalInput.addEventListener("input", () => {
          // Format input nominal dengan titik setiap 3 digit
          nominalInput.value = formatNominal(nominalInput.value);
          donationRadios.forEach((radio) => {
            radio.checked = false;
          });
        });
      },
    });

    await swal
      .fire({
        position: "bottom",
        html: `
      <div class="absolute px-24 ml-10 top-0 mt-4">
      <hr class="border border-gray-400 w-10 h-1 bg-gray-400 rounded-lg "/>
    </div>
    <div class="mt-4">
      <p class="text-md font-bold">Pilih Nominal Donasi</p>
      <div class="flex flex-col space-y-2 pt-5">
      <label>
      <input type="radio" name="donation" id="donation_20000" class="hidden peer" value="20000"  ${
        20000 + data.donation_collected > data.donation_target ? "disabled" : ""
      }/>
      <div class=" ${
        data.donation_collected + 20000 > data.donation_target
          ? "cursor-not-allowed bg-gray-300"
          : "cursor-pointer peer-checked:bg-blue-900 peer-checked:text-white bg-gray-100"
      }   py-2 px-4 rounded-lg font-semibold">Rp 20.000</div>
  </label>
  <label>
      <input  type="radio" name="donation" id="donation_50000" class="hidden peer" value="50000"  ${
        50000 + data.donation_collected > data.donation_target ? "disabled" : ""
      }/>
      <div class=" ${
        data.donation_collected + 50000 > data.donation_target
          ? "cursor-not-allowed bg-gray-300"
          : "cursor-pointer peer-checked:bg-blue-900 peer-checked:text-white bg-gray-100"
      }   py-2 px-4 rounded-lg font-semibold">Rp 50.000</div>
  </label>
  <label>
      <input  type="radio" name="donation" id="donation_100000" class="hidden peer" value="100000"  ${
        100000 + data.donation_collected > data.donation_target
          ? "disabled"
          : ""
      }/>
      <div class=" ${
        data.donation_collected + 100000 > data.donation_target
          ? "cursor-not-allowed bg-gray-300"
          : "cursor-pointer peer-checked:bg-blue-900 peer-checked:text-white bg-gray-100"
      }   py-2 px-4 rounded-lg font-semibold">Rp 100.000</div>
  </label>
  <label>
      <input  type="radio" name="donation" id="donation_200000" class="hidden peer" value="200000"  ${
        200000 + data.donation_collected > data.donation_target
          ? "disabled"
          : ""
      }/>
      <div class=" ${
        data.donation_collected + 200000 > data.donation_target
          ? "cursor-not-allowed bg-gray-300"
          : "cursor-pointer peer-checked:bg-blue-900 peer-checked:text-white bg-gray-100"
      }   py-2 px-4 rounded-lg font-semibold">Rp 200.000</div>
  </label>
  
          <div class="bg-gray-100 p-3 rounded-lg">
            <label class=" items-center text-base ">
              Nominal Donasi Lainnya
            </label>
            <div class="pl-5 gap-4 flex flex-row items-center mt-2 bg-white text-sm rounded-xl focus:ring-blue-500 ">
              <label class="w-6">Rp </label>

              
              <input type="text" name="nominal" class="p-2.5 focus:border-blue-500 dark:placeholder-gray-400 outline-none w-full rounded-xl" > 
            </div>
            <p class="text-xs text-primary font-semibold">Sisa maksimal donasi Rp. ${new Intl.NumberFormat(
              "id-ID"
            ).format(data.donation_target - data.donation_collected)}</p>

          </div>
      </div>
    </div>
        `,
        width: "375px",
        showConfirmButton: true,
        confirmButtonText: "Donasi",
        confirmButtonColor: "#3FB648",
        preConfirm: () => {
          const radioValue = document.querySelector(
            'input[name="donation"]:checked'
          );
          if (!radioValue) {
            const nominalValue = document.querySelector(
              'input[name="nominal"]'
            );
            if (nominalValue && nominalValue.value) {
              handleSubmit(nominalValue.value.replace(/\./g, ""));
            } else {
              return "input nominal value";
            }
          } else {
            handleSubmit(radioValue.value);
          }
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          const radioValue = document.querySelector(
            'input[name="donation"]:checked'
          );
          const nominalValue = document.querySelector('input[name="nominal"]');

          if (!radioValue && nominalValue && nominalValue.value) {
            handleSubmit(nominalValue.value.replace(/\./g, ""));
          } else if (radioValue) {
            handleSubmit(radioValue.value);
          } else {
            Swal.fire(
              "Melewati Target Donasi",
              "Nominal donasi tidak dapat melebihi target donasi.",
              "error"
            );
          }
        }
      });
  };

  function formatNominal(value) {
    value = value.replace(/[.,]/g, "");
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const handleSubmit = (value) => {
    setNominalDonasi(parseInt(value));
    const totalDonasi = parseInt(data.donation_collected);
    const DonasiNominal = parseInt(value);
    if (data.donation_target < totalDonasi + DonasiNominal) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Donasi melebihi batas target`,
      });
    } else {
      const data = {
        amount: parseInt(value),
        payment_channel: "",
        success_url: `${process.env.NEXT_PUBLIC_URL_PAYMEN}`,
        detail: {
          campaign_id: idCamp,
          description: "Donation",
          donation_type: "campaign",
        },
      };
      setDonation(data);
      router.push("/metode_pembayaran");
    }
  };

  useEffect(() => {
    console.log("data", data);
    console.log("donatur data", data?.campaign_donation);
  }, [data]);

  const cart = data?.campaign_donation || [];
  const [showAll, setShowAll] = useState(false);

  // Mengurutkan item dalam keranjang belanja
  const sortedCart = [...cart].reverse();

  const calculateTimeAgo = (createdAt) => {
    const now = new Date();
    const createdAtDate = new Date(createdAt);
    const difference = now - createdAtDate;

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return ` ${days} hari lalu`;
    } else if (hours > 0) {
      return ` ${hours} jam lalu`;
    } else if (minutes > 0) {
      return ` ${minutes} menit lalu`;
    } else {
      return ` ${seconds} detik lalu`;
    }
  };

  const formatToRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const remainingDays = calculateRemainingTime(data.event_date);
  return (
    <>
      <div className="container mx-auto pt-24 px-3 bg-white h-full">
        <div className="place-content-center px-2">
          <img
            src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${data.image_url}`}
            alt=""
            className="rounded-lg"
            style={{ width: "390px", height: "195px", objectFit: "cover" }}
          />
        </div>

        <div className="place-content-center mt-0 p-2 flex flex-col gap-5">
          <div>
            <h1 className="font-bold text-lg">{data.event_name}</h1>
          </div>
          <div className="flex flex-row gap-9 items-center mb-1">
            <p className="text-sm font-normal">{data.address}</p>
            <Link
              href={`/lokasi_camp/${idCamp}`}
              className="text-sm font-normal mb-12 text-red-500"
            >
              <IconMapPin />
            </Link>
          </div>
          <div>
            <div className="flex justify-between">
              <p className="font-sans text-sm">
                Tanggal Kegiatan :
                <span className="font-sans text-sm font-medium text-blue-800 ml-1">
                  {`${("0" + new Date(data.event_date).getDate()).slice(-2)}-${(
                    "0" +
                    (new Date(data.event_date).getMonth() + 1)
                  ).slice(-2)}-${new Date(data.event_date).getFullYear()}`}
                </span>
              </p>
            </div>
            <div className="flex justify-between">
              <p className="font-sans text-sm">
                Target Donasi :
                <span className="font-sans text-sm font-medium text-blue-800 ml-1">
                  {formatUang(data.donation_target ? data.donation_target : 0)}
                </span>
              </p>
              <div className="flex items-center font-medium text-blue-800 font-sans text-sm">
                <IconClock size={11} />
                <p className="font-sans ml-1">
                  {remainingDays > 0 ? remainingDays : 0} Hari
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <p className="font-sans text-sm">
                Donasi Terkumpul :
                <span className="font-sans text-sm font-medium text-blue-800 ml-1">
                  {formatUang(
                    data.donation_collected > data.donation_target
                      ? data.donation_target
                      : data.donation_collected
                      ? data.donation_collected
                      : 0
                  )}
                </span>
              </p>
            </div>
            <button
              onClick={showSweetAlert}
              className="w-full h-14 mt-4 text-white rounded-2xl inline-flex items-center justify-center px-2.5 py-2.5 bg-primary font-bold"
            >
              Donasi
            </button>
          </div>
        </div>
        <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />

        <div className="items-center justify-center mt-1 w-full">
          {/* Detonator */}
          <div
            href={`/food/${idCamp}`}
            className="w-full h-16 bg-white hover:bg-gray-100  text-black rounded-lg inline-flex items-center px-2.5 py-2.5 "
          >
            <div className="flex justify-between w-full">
              <div className="flex">
                {/* <IconSoup className=" w-7 h-7" /> */}
                <div className="w-12 h-12 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600">
                  {data.detonator.self_photo ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${data.detonator.self_photo}`}
                      className="grid grid-cols-3 gap-4 place-items-end text-gray-500 w-12 h-12 object-cover rounded-full"
                      alt="NotFound"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <IconUser className="grid grid-cols-3 gap-4 place-items-end text-gray-500" />
                  )}
                </div>
                <div className="text-left place-items-start">
                  <div className="mb-1 text-primary">
                    {data.detonator?.oauth?.fullname}
                  </div>
                  <div className="-mt-1 font-sans text-xs text-gray-500">
                    Verified Campaigner{" "}
                  </div>
                </div>
              </div>
              {/* <div className="grid place-items-center">
                <IconArrowNarrowRight className=" grid grid-cols-3 gap-4 place-items-end text-gray-500" />
              </div> */}
            </div>
          </div>
          <hr className="w-80 h-0.5 mx-auto mt-2 mb-2 bg-gray-100 border-0 rounded" />
          {/* Merchants */}
          <Link
            href={`/food/${idCamp}`}
            className="w-full h-16 bg-white hover:bg-gray-100  text-black rounded-lg inline-flex items-center px-2.5 py-2.5 "
          >
            <div className="flex justify-between w-full">
              <div className="flex">
                {/* <IconSoup className=" w-7 h-7" /> */}
                <div className="w-12 h-12 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600">
                  <img
                    src="/img/icon/icon_food_order.png"
                    alt=""
                    className="w-8 h-8"
                  />
                </div>
                <div className="text-left place-items-start">
                  <div className="mb-1 text-primary">Lacak Merchant</div>
                  <div className="-mt-1 font-sans text-xs text-gray-500">
                    {data.orders ? data.orders.length : 0} Verified Merchants{" "}
                  </div>
                </div>
              </div>
              <div className="grid place-items-center">
                <IconArrowNarrowRight className=" grid grid-cols-3 gap-4 place-items-end text-gray-500" />
              </div>
            </div>
          </Link>
          <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />
          <Link
            href={`/report/${idCamp}`}
            className="w-full h-16 bg-white hover:bg-gray-100  text-black rounded-lg inline-flex items-center px-2.5 py-2.5 mt-2"
          >
            <div className="flex justify-between w-full">
              <div className="flex">
                <div className="text-left place-items-start">
                  <div className="mb-1 text-primary flex">
                    Kabar Terbaru{" "}
                    <IconBellRingingFilled
                      size={10}
                      className="text-blue-600"
                    />
                  </div>
                  <div className="-mt-1 font-sans text-xs text-gray-500">
                    Terahir Update 18 Oktober 2023
                  </div>
                </div>
              </div>
              <div className="grid place-items-center">
                <IconArrowNarrowRight className=" grid grid-cols-3 gap-4 place-items-end text-gray-500" />
              </div>
            </div>
          </Link>
        </div>
        <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />
        <div className="block mt-1 p-2 bg-white">
          <h5 className="mb-2 text-md tracking-tight text-primary">
            Tentang Program
          </h5>
          <p
            className={`font-normal text-gray-700 text-xs  ${
              showFullText ? "" : styles.truncate
            }`}
          >
            {data.description}
          </p>
          <hr className="w-full h-0.5 mx-auto mt-2 bg-gray-100 border-0 rounded" />
          <div className="bg-white grid place-content-center rounded-sm text-primary text-xs mt-2">
            {showFullText ? (
              <button className="flex" onClick={toggleReadMore}>
                Lebih Sedikit <IconChevronUp size={20} />
              </button>
            ) : (
              <button className="flex" onClick={toggleReadMore}>
                Selengkapnya <IconChevronDown size={20} />
              </button>
            )}
          </div>
        </div>

        <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />
        <div className="w-full rounded-lg items-center px-2 py-2.5 mt-4">
          <div className="flex mb-4">
            <p className="text-base font-bold text-black">Donasi</p>
            <div className="bg-green-300 px-1 rounded-lg ml-2 flex items-center">
              <p className="text-xs font-bold text-primary">{cart.length}</p>
            </div>
          </div>
          {/* Looping untuk menampilkan item yang dimuat dalam keranjang belanja */}
          {(showAll ? sortedCart : sortedCart.slice(0, 4)).map(
            (item, index) => (
              <div
                key={index}
                className="w-full h-16 text-black flex flex-col mb-1 items-center"
              >
                <div className="flex justify-between w-full rounded-lg">
                  <div className="flex">
                    {/* <IconSoup className=" w-7 h-7" /> */}
                    <div className="w-12 h-12 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600">
                      <img src="/icon/user.png" alt="" className="w-6 h-6" />
                    </div>
                    <div className="text-left place-items-start">
                      <div className="text-primary text-sm font-bold">
                        {" "}
                        {item.transaction.sender_name}
                      </div>
                      <div className="font-sans text-xs text-gray-500">
                        Berdonasi Sebesar{" "}
                        <span className="font-bold">
                          {formatToRupiah(item.amount)}
                        </span>
                      </div>
                      <div className="flex mt-1 font-sans text-xs items-center gap-1 text-gray-500">
                        <IconClockFilled size={12} className="mt-0.5" />
                        {calculateTimeAgo(item.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
          <hr className="w-full h-0.5 mx-auto mt-2 bg-gray-100 border-0 rounded" />
          <div className="block mt-1 p-2 ">
            <div className="bg-white grid place-content-center rounded-sm text-primary text-xs mt-2">
              {!showAll ? (
                <button
                  className="flex focus:outline-none"
                  onClick={() => setShowAll(true)}
                >
                  Selengkapnya <IconChevronDown size={20} />
                </button>
              ) : (
                <button
                  className="flex focus:outline-none"
                  onClick={() => setShowAll(false)}
                >
                  Lebih Sedikit <IconChevronUp size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
        {loading && <Loading />}
      </div>
    </>
  );
};

export default DetailCamp;

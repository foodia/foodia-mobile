import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import axios from "axios";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import moment from "moment/moment";
import { IconChevronDown } from "@tabler/icons-react";

const mydonation = () => {
  const router = useRouter();
  const [data, setData] = useState();
  const [history, setHistory] = useState();
  const [month, setMonth] = useState(moment().format("YYYY-MM"));
  const [loading, setLoading] = useState(true);
  const [isChecked, setIsChecked] = useState();
  const [isCheckedSuccess, setIsCheckedSuccess] = useState();
  const [isOpenedMonthOptions, setIsOpenedMonthOptions] = useState(false);

  const toggleSwitch = () => {
    setIsChecked((prevState) => !prevState);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}wallet/agnostic-permission`,
        { is_permission_manage: !isChecked },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        setIsCheckedSuccess((prevState) => !prevState);
      })
      .catch((error) => {
        Error401(error, router);
      });
  };

  const getHistory = (month) => {
    setLoading(true);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL
        }donation/list?start=${month}-01&end=${month}-${new Date(
          moment(month, "YYYY-MM").format("YYYY"),
          moment(month, "YYYY-MM").format("MM"),
          0
        ).getDate()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        setData(response.data.body);
        if (response.data.body.is_permission_manage === 1) {
          setIsChecked(true);
          setIsCheckedSuccess(true);
        } else {
          setIsCheckedSuccess(false);
        }

        const sortedData = response.data.body.donation_history.sort(
          (a, b) => b.transaction.id - a.transaction.id
        );

        setHistory(sortedData);
      })
      .catch((error) => {
        setLoading(false);
        Error401(error, router);
      });
  };

  useEffect(() => {
    getHistory(month);
  }, []);

  const onChangeMonth = (bulan) => {
    setMonth(bulan);
    getHistory(bulan);
    setIsOpenedMonthOptions(!isOpenedMonthOptions);
  };

  return (
    <>
      <div className="overflow-hidden max-w-480 bg-white flex flex-col">
        {/* <Header title="Donasi Saya" backto="/home" /> */}
        <div className="bg-white h-screen px-4">
          <p className="text-center font-bold text-lg py-4">Donasi Saya</p>
          <div className="bg-[#1D5882] w-full px-4 py-2 mt-2 rounded-xl">
            <div className="flex justify-between items-center text-white font-semibold text-base">
              <div className="">
                <p className="font-bold">Tabunganku</p>
              </div>

              <p className="">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(data?.agnostic_balance || 0)}
              </p>
            </div>
          </div>
          <div className="bg-transparent w-full px-4 pb-2 mt-2 rounded-xl">
            <div className="flex justify-between items-center text-base">
              <p className="text-sm font-bold">Izinkan Dikelola Foodia</p>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isCheckedSuccess}
                  onChange={toggleSwitch}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <div className="bg-primary w-full px-4 py-2 flex flex-col gap-1 min-h-[22px] rounded-xl">
            <div className="flex justify-between text-white font-semibold text-base">
              <p>Total Donasi</p>
              <p>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(data?.total_donation || 0)}
              </p>
            </div>
            <hr className="mt-2 h-[1px] bg-white" />
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-col gap-1 text-white font-semibold text-base">
                <p>Donasi Bulan Ini</p>

                <button
                  onClick={() => setIsOpenedMonthOptions(!isOpenedMonthOptions)}
                  className="flex flex-row text-[12px] font-semibold text-white custom-select w-20 h-[25px] rounded-md bg-transparent border-[1px] border-white outline-none justify-between items-center px-[3.5px]"
                >
                  <p>{moment(month, "YYYY-MM").format("MMM YYYY")}</p>
                  <IconChevronDown size={"17px"} />
                </button>
                {isOpenedMonthOptions && (
                  <div className="absolute overflow-auto p-1 flex flex-col top-[222px] items-start w-24 pl-2 rounded-md bg-transparent border-[1px] bg-white outline-none">
                    {data?.year_filters?.map((bulan, index) => (
                      <button
                        onClick={() => {
                          onChangeMonth(bulan);
                        }}
                        className={`${moment(bulan, "YYYY-MM").format("MMM YYYY") ===
                          moment(month, "YYYY-MM").format("MMM YYYY")
                          ? "text-primary"
                          : "text-black"
                          } text-[12px] w-full text-left font-semibold`}
                      >
                        {moment(bulan, "YYYY-MM").format("MMM YYYY")}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-white font-semibold">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(data?.donation_this_month || 0)}
              </p>
            </div>
          </div>


          {loading ? (
            <div className={`${styles.card} `}>
              {[...Array(4)].map((_, index) => (
                <div key={index} className={`${styles.loadingCard}`}>
                  <div className={`${styles.shimmer}`}></div>
                </div>
              ))}
            </div>
          ) : data?.donation_history ? (
            <div className={`overflow-auto h-screen px-1 pb-[400px]`}>
              {history.map((data) => (
                <div className="w-full px-2 py-2 mt-2.5 rounded-lg shadow-[0px_0px_8px_0px_#00000024]">
                  <div className="flex justify-between items-center font-semibold text-[10px]">
                    <div className="">
                      <p className="font-bold">Tanggal Donasi</p>
                      <p className="italic">
                        {moment(data?.date).format("DD MMM YYYY HH:mm") +
                          " WIB"}
                      </p>
                    </div>
                    <p
                      className={`text-[16px] font-bold ${data.type_donation === "booster"
                        ? "text-[#1D5882]"
                        : "text-primary"
                        }`}
                    >
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(data?.total || 0)}
                    </p>
                  </div>
                  <hr className="mt-2 h-[1px] bg-gray-100" />
                  <div className="py-1">
                    <h1 className=" font-bold text-sm">
                      {data?.campaign?.event_name}
                    </h1>
                    <p className=" font-normal text-xs">
                      {data?.campaign?.address}
                    </p>
                  </div>
                  <hr className="mt-2 h-[1px] bg-gray-100" />
                  <div class="flex justify-between items-center font-semibold text-xs mt-1 text-primary">
                    <button
                      onClick={() => {
                        localStorage.setItem("prevPath", "/mydonation");
                        router.push(
                          `/bukti_pembayaran?external_id=${data?.transaction?.external_id}`
                        );
                      }}
                      class="text-xs font-semibold w-full focus:outline-none"
                    >
                      Detail Donasi
                    </button>
                    <hr class="w-1 h-5 bg-gray-100 mx-2" />
                    <button
                      onClick={() => {
                        localStorage.setItem("prevPath", "/mydonation");
                        router.push(`/campaign/${data?.campaign?.id}`);
                      }}
                      class="text-xs font-semibold w-full focus:outline-none"
                    >
                      Campaign
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p
              className={`mt-26 text-sm text-[#A1A5C1] items-center justify-center flex flex-col h-[50%]`}
            >
              Yuk bantu saudara kita dengan
              <p> berdonasi :&#41;</p>
            </p>
          )}
        </div>
      </div>
      {loading && <Loading />}
      <BottomNav />
    </>
  );
};

export default mydonation;

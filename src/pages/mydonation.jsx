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

const mydonation = () => {
  const router = useRouter();
  const [data, setData] = useState();
  const [history, setHistory] = useState();
  const [bulanOptions, setBulanOptions] = useState([]);
  const [month, setMonth] = useState(`0${new Date().getMonth() + 1}`);
  const [year, setYear] = useState(`${new Date().getFullYear()}`);
  const [loading, setLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(true);

  const toggleSwitch = () => {
    setIsChecked((prevState) => !prevState);
  };

  const getHistory = (month, year, lastDay) => {
    setLoading(true);
    axios
      .get(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }donation/list?start=${year}-${month}-01&end=${year}-${month}-${new Date(
          year,
          month,
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

        const sortedData = response.data.body.donation_history.sort(
          (a, b) => b.transaction.id - a.transaction.id
        );

        // sortedData.map((e) => {
        //   const dateString = e.date;
        //   const monthYear =
        //     dateString.split(" ")[1] + " " + dateString.split(" ")[2];
        //   console.log("history ===", monthYear);
        // });

        setHistory(sortedData);
      })
      .catch((error) => {
        setLoading(false);
        Error401(error, router);
      });
  };

  // Fungsi untuk mengambil lima bulan terbaru
  const getLatestMonths = () => {
    const today = new Date();
    const months = [...bulanOptions];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];

    for (let i = 0; i < 5; i++) {
      let month = today.getMonth() - i;
      let year = today.getFullYear();
      if (month < 0) {
        month += 12;
        year -= 1;
      }
      months.push({
        id: i,
        MonthLabel: monthNames[month],
        MonthValue: `${month + 1 < 10 ? `0${month + 1}` : `${month}`}`,
      });
    }

    setBulanOptions(months);
  };

  useEffect(() => {
    getHistory(month, year);
    getLatestMonths();
  }, []);

  const onChangeMonth = (e) => {
    const monthVal = e.target.value;
    setMonth(monthVal);
    getHistory(monthVal, year);
  };

  return (
    <>
      <div className="container mx-auto h-screen max-w-480 bg-white flex flex-col">
        <Header title="Donasi Saya" />
        <div className="bg-white h-screen px-4 pt-14">
          <div className="bg-primary w-full px-4 py-2 flex flex-col gap-1 rounded-xl">
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
                <p>Total Donasi</p>
                <select
                  onChange={(e) => onChangeMonth(e)}
                  class="text-[12px] font-semibold text-white custom-select w-20 h-[25px] rounded-md bg-transparent border-[1px] border-white outline-none"
                >
                  {/* <option value="" className="bg-white">Mar 2024</option> */}
                  {bulanOptions.map((bulan, index) => (
                    <option
                      key={index}
                      value={bulan.MonthValue}
                      className="text-black"
                    >
                      {bulan.MonthLabel} 2024
                    </option>
                  ))}
                </select>
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
          <div className="bg-[#1D5882] w-full px-4 py-2 mt-2 rounded-xl">
            <div className="flex justify-between items-center text-white font-semibold text-base">
              <div className="">
                <p className="font-bold">Tabunganku</p>
                {/* <p className="text-xs">Akan dikelola oleh Foodia</p> */}
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
                  checked={isChecked}
                  onChange={toggleSwitch}
                />
                <span className="slider round"></span>
              </label>
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
            <div className={`${styles.card} px-1 `}>
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
                    <p className="text-[16px] font-bold text-[#1D5882]">
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
                      onClick={() =>
                        router.push(
                          `/bukti_pembayaran?external_id=${data?.transaction?.external_id}`
                        )
                      }
                      class="text-xs font-semibold w-full focus:outline-none"
                    >
                      Detail Donasi
                    </button>
                    <hr class="w-1 h-5 bg-gray-100 mx-2" />
                    <button
                      onClick={() =>
                        router.push(`/campaign/${data?.campaign?.id}`)
                      }
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

import styles from "@/styles/Home.module.css";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import CardCampaign from "../CardCampaign";
import Error401 from "../error401";
import Loading from "../Loading";

const Detonator = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dataApi, setDataApi] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("DRAFT");
  const [menu, setMenu] = useState("campaign-list");
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const [errorCode, setErrorCode] = useState(null);

  useEffect(() => {
    const authenticateUser = async () => {
      // const role = localStorage.getItem('role');
      const token = localStorage.getItem("token");
      // const status = localStorage.getItem('status');
      // const id = localStorage.getItem('id');
      // console.log("token", token);
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Akses Dibatasi",
          text: ` Mohon untuk login kembali menggunakan akun Detonator.`,
          showConfirmButton: true,
          confirmButtonText: "Login",
          confirmButtonColor: "green",
          showCancelButton: true,
          cancelButtonText: "Tutup",
          cancelButtonColor: "red",
          // timer: 2000,
        }).then((result) => {
          if (result.isConfirmed) {
            // console.log("clicked");
            setLoading(true);
            router.push("/login");
          } else if (result.isDismissed) {
            // console.log("denied");
            router.push("/home");
          }
        });
        // setTimeout(() => {
        //   router.push("/home");
        // }, 2000);
      } else {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/check-register-status`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const cekData = response.data.body;
          console.log("cekData", cekData);

          if (!cekData.detonator) {
            // console.log('/register/detonator');
            Swal.fire({
              icon: "warning",
              title: "Akun Belum Terdaftar sebagai Detonator",
              text: `Mohon untuk registrasi sebagai Detonator.`,
              showConfirmButton: true,
              confirmButtonColor: "green",
              confirmButtonText: "Registrasi",
              showCancelButton: true,
              cancelButtonColor: "red",
              cancelButtonText: "Tutup",
              // timer: 2000,
            }).then((result) => {
              if (result.isConfirmed) {
                // console.log("clicked");
                router.push("/detonator/syarat");
              } else if (result.isDismissed) {
                // console.log("denied");
                router.push("/home");
              }
            });
            // setTimeout(() => {
            //   router.push("/registrasi/detonator?step=1");
            // }, 2000);
          } else {
            if (cekData.detonator.status == "waiting") {
              localStorage.setItem("id", cekData.detonator.detonator_id);
              localStorage.setItem("role", "detonator");
              localStorage.setItem("status", cekData.detonator.status);
              localStorage.setItem("note", cekData.detonator.note);
              //       localStorage.setItem("id", responeData.id || " ");
              // localStorage.setItem("status", responeData.status || " ");
              // localStorage.setItem("note", responeData.note || " ");

              Swal.fire({
                icon: "warning",
                title: "Detonator Belum Terverifikasi",
                text: ` Mohon tunggu konfirmasi dari admin kami.`,
                showConfirmButton: false,
                timer: 2000,
              });
              setTimeout(() => {
                router.push("/home");
              }, 2000);
            } else if (cekData.detonator.status == "rejected") {
              setLoading(false);
              localStorage.setItem("id", cekData.detonator.detonator_id);
              localStorage.setItem("role", "detonator");
              localStorage.setItem("status", cekData.detonator.status);
              localStorage.setItem("note", cekData.detonator.note);
              Swal.fire({
                icon: "warning",
                title: "Detonator Ditolak",
                text: `${cekData.detonator.note}`,
                showConfirmButton: false,
                timer: 2000,
              });
              setTimeout(() => {
                router.push("/detonator/edit");
              }, 2000);
            } else {
              localStorage.setItem("id", cekData.detonator.detonator_id);
              localStorage.setItem("role", "detonator");
              localStorage.setItem("status", cekData.detonator.status);
              localStorage.setItem("note", cekData.detonator.note);
            }
          }
          console.log("data", cekData);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            Error401(error, router);
            // localStorage.clear();
            // localStorage.removeItem("cart");
            // localStorage.removeItem("formData");
            // router.push("/login");
          }
        }
      }
    };

    authenticateUser();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/filter?detonator_id=${id}&campaign_status=${selectedStatus}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setDataApi(res.data.body);
        setFilteredData(res.data.body);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          Error401(error, router);
          localStorage.clear();
          localStorage.removeItem("cart");
          localStorage.removeItem("formData");
          router.push("/login");
          router.push("/login");
        }
        console.log(error);
      });
  }, [selectedStatus, loading]);

  const handleFilterChange = (status) => {
    let filtered = [];
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    setLoading(true);
    setSelectedStatus(status);
    if (status === "DRAFT") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/filter?detonator_id=${id}&campaign_status=${status}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setDataApi(response.data.body);
          setFilteredData(response.data.body);
          setLoading(false);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            Error401(error, router);
            localStorage.clear();
            localStorage.removeItem("cart");
            localStorage.removeItem("formData");
            router.push("/login");
            router.push("/login");
          }
          console.error("Error fetching data:", error);
        });
    } else if (status === "OPEN,INPROGRESS") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/filter?detonator_id=${id}&campaign_status=${status}`,
          {
            headers: {
              Authorization: `Bearer ${token + "dwwdw"}`,
            },
          }
        )
        .then((response) => {
          setDataApi(response.data.body);
          setFilteredData(response.data.body);
          setLoading(false);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            Error401(error, router);
            localStorage.clear();
            localStorage.removeItem("cart");
            localStorage.removeItem("formData");
            router.push("/login");
          }
          console.error("Error fetching data:", error);
        });
    } else if (status === "FINISHED") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/filter?detonator_id=${id}&campaign_status=${status}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setDataApi(response.data.body);
          setFilteredData(response.data.body);
          setLoading(false);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            Error401(error, router);
            // localStorage.clear();
            // localStorage.removeItem("cart");
            // localStorage.removeItem("formData");
            // router.push("/login");
          }
          console.error("Error fetching data:", error);
        });
    }

    // setFilteredData(filtered);
  };

  const handleRequestError = (error) => {
    console.error("Error fetching data:", error);

    if (error.response && error.response.status === 401) {
      localStorage.clear();
      router.push("/login/detonator");
    }

    setLoading(false);
    setFilteredData([]);
  };

  return (
    <>
      <div className="bg-white h-screen pt-10">
        <div className="flex items-center justify-center px-6 my-2">
          <div className="flex flex-row items-center justify-around bg-gray-100 rounded-xl py-2 w-full">
            <div className="flex justify-center gap-5 px-1 py-3">
              {menu === "campaign-list" ? (
                <Link
                  onClick={() => setLoading(true)}
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
                <button
                  onClick={() => setMenu("campaign-list")}
                  // href={"/createcampaign?step=1"}
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
                </button>
              )}
            </div>
            <div className="flex justify-center gap-5 px-1 py-3">
              <button
                onClick={() => setMenu("review-list")}
                // href={"/createcampaign?step=1"}
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
              </button>
            </div>
          </div>
        </div>

        {menu === "campaign-list" ? (
          <>
            <div className="flex flex-row px-6 py-4 justify-between items-end">
              <div
                className={`cursor-pointer text-center pb-2 ${
                  selectedStatus === "DRAFT"
                    ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
                    : "text-gray-400 font-bold"
                }`}
                onClick={() => handleFilterChange("DRAFT")}
              >
                <p>Campaign Baru</p>
              </div>
              <div
                className={`cursor-pointer text-center pb-2 ${
                  selectedStatus === "OPEN,INPROGRESS"
                    ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
                    : "text-gray-400 font-bold"
                }`}
                onClick={() => handleFilterChange("OPEN,INPROGRESS")}
              >
                <p>Campaign Berjalan</p>
              </div>
              <div
                className={`cursor-pointer text-center pb-2 ${
                  selectedStatus === "FINISHED"
                    ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
                    : "text-gray-400 font-bold"
                }`}
                onClick={() => handleFilterChange("FINISHED")}
              >
                <p>Campaign Selesai</p>
              </div>
            </div>
            {loading ? (
              <div className={`${styles.card}`}>
                {[...Array(4)].map((_, index) => (
                  <div key={index} className={`${styles.loadingCard}`}>
                    <div className={`${styles.shimmer}`}></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`${styles.card}`}>
                {filteredData.map((dataFilter) => {
                  // console.log(`Key: ${dataFilter.id}`);
                  return (
                    <CardCampaign
                      key={dataFilter.id}
                      to={`detonator/campaign/${dataFilter.id}`}
                      img={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataFilter.image_url}`}
                      title={dataFilter.event_name}
                      description={dataFilter.description}
                      date={dataFilter.event_date}
                      status={dataFilter.status}
                      address={dataFilter.address}
                      rating={false}
                      donation_target={dataFilter.donation_target}
                      donation_collected={dataFilter.donation_collected}
                    />
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex flex-row px-6 py-4 justify-between items-end">
              <div
                className={`cursor-pointer text-center w-full pb-2 ${
                  selectedStatus === "DRAFT"
                    ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
                    : "text-gray-400 font-bold"
                }`}
                onClick={() => handleFilterChange("DRAFT")}
              >
                <p>Kasih Ulasan</p>
              </div>
              <div
                className={`cursor-pointer text-center w-full pb-2 ${
                  selectedStatus === "OPEN,INPROGRESS"
                    ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
                    : "text-gray-400 font-bold"
                }`}
                onClick={() => handleFilterChange("OPEN,INPROGRESS")}
              >
                <p>Ulasan Selesai</p>
              </div>
            </div>
            {loading ? (
              <div className={`${styles.card}`}>
                {[...Array(4)].map((_, index) => (
                  <div key={index} className={`${styles.loadingCard}`}>
                    <div className={`${styles.shimmer}`}></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`${styles.card}`}>
                <CardCampaign
                  // key={dataFilter.id}
                  to={`detonator/rating`}
                  img={`img/card/rectangle_70.png`}
                  title={"TEBAR 1000 PAKET NASI JUMAT BERKAH"}
                  description={"sfsfsf"}
                  date={"sfsfs"}
                  // status={}
                  address={
                    "Kav Barokah, Gg. Ceria I, Bahagia, Kec. Babelan, Kabupaten Bekasi, Jawa Barat 17121"
                  }
                  rating={true}
                  // donation_target={false}
                  // donation_collected={false}
                />
              </div>
            )}
          </>
        )}
        {loading && <Loading />}
      </div>
    </>
  );
};

export default Detonator;

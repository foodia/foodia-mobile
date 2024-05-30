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
import MenuDetonator from "./Detonator/MenuDetonator";

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
            setLoading(true);
            router.push("/login");
          } else if (result.isDismissed) {
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

          if (!cekData.detonator) {
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
                router.push("/detonator/syarat");
              } else if (result.isDismissed) {
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
    if (menu == "campaign-list") {
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
        });
    } else if (menu == "review-list") {

      // let filtered = [];
      axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}rating/not-reviewed?type=detonator&id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          // setSelectedStatus()
          setDataApi(res.data.body);

          // setFilteredData(res.data.body);
          setLoading(false);
        }).catch((error) => {
          Error401(error, router);
        })
    }

  }, [selectedStatus, loading]);

  useEffect(() => {
    let filtered = [];
    if (selectedStatus == "KirimUlasan") {
      filtered = dataApi.filter(
        (data) => data.approval_status === "approved" && data.is_rating === false
      )

      setFilteredData(filtered);
    } else if (selectedStatus == "OPEN,INPROGRESS") {
      setMenu("campaign-list");

    }
  }, [dataApi, selectedStatus]);

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
          }
          console.error("Error fetching data:", error);
        });
    } else if (status === "KirimUlasan") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}rating/not-reviewed?type=detonator&id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        .then((response) => {
          filtered = response.data.body.filter((data) => data.approval_status === "approved" && data.is_rating === false)
          setDataApi(filtered);
          setFilteredData(filtered);
          setLoading(false);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            Error401(error, router);
          }
        })
    } else if (status === "UlasanSelesai") {
      setDataApi([]);
      setFilteredData([]);
      setLoading(false);
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
          <MenuDetonator />
        </div>

        {menu === "campaign-list" ? (
          <>
            <div className="flex flex-row px-6 py-4 justify-between items-end">
              <div
                className={`cursor-pointer text-center pb-2 ${selectedStatus === "DRAFT"
                  ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
                  : "text-gray-400 font-bold"
                  }`}
                onClick={() => handleFilterChange("DRAFT")}
              >
                <p>Campaign Baru</p>
              </div>
              <div
                className={`cursor-pointer text-center pb-2 ${selectedStatus === "OPEN,INPROGRESS"
                  ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
                  : "text-gray-400 font-bold"
                  }`}
                onClick={() => handleFilterChange("OPEN,INPROGRESS")}
              >
                <p>Campaign Berjalan</p>
              </div>
              <div
                className={`cursor-pointer text-center pb-2 ${selectedStatus === "FINISHED"
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
                className={`cursor-pointer text-center w-full pb-2 ${selectedStatus === "KirimUlasan"
                  ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
                  : "text-gray-400 font-bold"
                  }`}
                onClick={() => handleFilterChange("KirimUlasan")}
              >
                <p>Kasih Ulasan</p>
              </div>
              <div
                className={`cursor-pointer text-center w-full pb-2 ${selectedStatus === "UlasanSelesai"
                  ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
                  : "text-gray-400 font-bold"
                  }`}
                onClick={() => handleFilterChange("UlasanSelesai")}
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

                {filteredData.map((dataFilter) => {
                  return (
                    <CardCampaign
                      // dataReview={dataFilter}
                      // key={dataFilter.id}
                      to={`detonator/rating`}
                      img={`img/card/rectangle_70.png`}
                      title={dataFilter.event_name}
                      description={"sfsfsf"}
                      date={"sfsfs"}
                      // status={}
                      address={
                        "Kav Barokah, Gg. Ceria I, Bahagia, Kec. Babelan, Kabupaten Bekasi, Jawa Barat 17121"
                      }
                      rating={true}
                    />
                  );
                })}


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

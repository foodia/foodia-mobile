import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { IconCirclePlus } from "@tabler/icons-react";
import SlideCard from "../SlideCard";
import styles from "@/styles/Home.module.css";
import CardCampaign from "../CardCampaign";
import Swal from "sweetalert2";
import Image from "next/image";

const Detonator = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dataApi, setDataApi] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("DRAFT");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const [errorCode, setErrorCode] = useState(null);

  useEffect(() => {
    const authenticateUser = async () => {
      // const role = sessionStorage.getItem('role');
      const token = sessionStorage.getItem("token");
      // const status = sessionStorage.getItem('status');
      // const id = sessionStorage.getItem('id');
      console.log("token", token);
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

          if (cekData.detonator.detonator_id == 0) {
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
                router.push("/registrasi/detonator?step=1");
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
              sessionStorage.setItem("id", cekData.detonator.detonator_id);
              sessionStorage.setItem("role", "detonator");
              sessionStorage.setItem("status", cekData.detonator.status);
              sessionStorage.setItem("note", cekData.detonator.note);

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
              sessionStorage.setItem("id", cekData.detonator.detonator_id);
              sessionStorage.setItem("role", "detonator");
              sessionStorage.setItem("status", cekData.detonator.status);
              sessionStorage.setItem("note", cekData.detonator.note);
              Swal.fire({
                icon: "warning",
                title: "Detonator Ditolak",
                text: `${cekData.detonator.note}`,
                showConfirmButton: false,
                timer: 2000,
              });
              setTimeout(() => {
                router.push("/home");
              }, 2000);
            } else {
              sessionStorage.setItem("id", cekData.detonator.detonator_id);
              sessionStorage.setItem("role", "detonator");
              sessionStorage.setItem("status", cekData.detonator.status);
              sessionStorage.setItem("note", cekData.detonator.note);
            }
          }
          console.log("data", cekData);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            sessionStorage.clear();
            localStorage.removeItem("cart");
            localStorage.removeItem("formData");
            router.push("/login");

          }
        }


      }
    };

    authenticateUser();
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const id = sessionStorage.getItem("id");
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
          sessionStorage.clear();
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
    const id = sessionStorage.getItem("id");

    setLoading(true);
    setSelectedStatus(status);
    if (status === "DRAFT") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/filter?detonator_id=${id}&campaign_status=${status}`
        )
        .then((response) => {
          setDataApi(response.data.body);
          setFilteredData(response.data.body);
          setLoading(false);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            sessionStorage.clear();
            localStorage.removeItem("cart");
            localStorage.removeItem("formData");
            router.push("/login");
            router.push("/login");

          }
          console.error("Error fetching data:", error);
        });
    } else if (status === "INPROGRESS") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/filter?detonator_id=${id}&campaign_status=${status}`
        )
        .then((response) => {
          setDataApi(response.data.body);
          setFilteredData(response.data.body);
          setLoading(false);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            sessionStorage.clear();
            localStorage.removeItem("cart");
            localStorage.removeItem("formData");
            router.push("/login");

          }
          console.error("Error fetching data:", error);
        });
    } else if (status === "FINISHED") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/filter?detonator_id=${id}&campaign_status=${status}`
        )
        .then((response) => {
          setDataApi(response.data.body);
          setFilteredData(response.data.body);
          setLoading(false);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            sessionStorage.clear();
            localStorage.removeItem("cart");
            localStorage.removeItem("formData");
            router.push("/login");

          }
          console.error("Error fetching data:", error);
        });
    }

    // setFilteredData(filtered);
  };

  const handleRequestError = (error) => {
    console.error("Error fetching data:", error);

    if (error.response && error.response.status === 401) {
      sessionStorage.clear();
      router.push("/login/detonator");
    }

    setLoading(false);
    setFilteredData([]);
  };

  // useEffect(() => {
  //     console.log('Data', filteredData);
  // }, [filteredData]);

  return (
    <>
      <div className="bg-white h-screen pt-10">
        <div className="flex items-center justify-center px-6 my-2">
          <div className="bg-gray-100 rounded-xl py-2 w-full">
            <div className="flex justify-center gap-5 px-1 py-3">
              <Link
                href={"/creatcampaign?step=1"}
                className="grid gap-2 justify-items-center w-24"
              >
                <div className={`${styles.iconMenu}`}>
                  <Image
                    src={"/icon/creat_camp.png"}
                    alt="creat_camp"
                    width={30}
                    height={30}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Buat Campaign
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* <div className={`px-6 flex my-2  ${styles.slide_card}`}>
                <SlideCard to={"/campaign/1"}
                    img="/img/card/rectangle_70.png"
                    title="Makanan Untuk Semua"
                    address="Bersama-sama Kita Bisa Mengakhiri Kelaparan."
                    date="30/10/2022"
                    status="Pending"
                />
                <SlideCard to={"/campaign/1"}
                    img="/img/card/rectangle_70.png"
                    title="TEBAR 1000 PAKET NASI JUMAT BERKAH"
                    address="Kav Barokah, Gg. Ceria I, Bahagia, Kec. Babelan, Kabupaten Bekasi, Jawa Barat 17121"
                    date="30/10/2022"
                    status="Approved"
                />
                <SlideCard to={"/campaign/1"}
                    img="/img/card/rectangle_70.png"
                    title="TEBAR 1000 PAKET NASI JUMAT BERKAH"
                    address="Kav Barokah, Gg. Ceria I, Bahagia, Kec. Babelan, Kabupaten Bekasi, Jawa Barat 17121 ppppppppppppppppppppppppppppppppppppppp"
                    date="30/10/2022"
                    status="Rejected"
                />

                <SlideCard to={"/campaign/1"}
                    img="/img/card/rectangle_70.png"
                    title="TEBAR 1000 PAKET NASI JUMAT BERKAH"
                    address="Kav Barokah, Gg. Ceria I, Bahagia, Kec. Babelan, Kabupaten Bekasi, Jawa Barat 17121"
                    date="30/10/2022"
                    status="Approved"
                />
            </div> */}

        <div className="flex flex-row px-6 py-4 justify-between items-end">
          <div
            className={`cursor-pointer text-center ${selectedStatus === "DRAFT"
              ? "text-primary text-center border border-t-0 border-x-0 border-b-primary"
              : "text-gray-500"
              }`}
            onClick={() => handleFilterChange("DRAFT")}
          >
            <span>Campaign Baru</span>
          </div>
          <div
            className={`cursor-pointer text-center ${selectedStatus === "OPEN"
              ? " text-primary text-center border border-t-0 border-x-0 border-b-primary"
              : "text-gray-500"
              }`}
            onClick={() => handleFilterChange("OPEN")}
          >
            <span>Campaign Berjalan</span>
          </div>
          <div
            className={`cursor-pointer text-center ${selectedStatus === "FINISHED"
              ? "text-primary text-center border border-t-0 border-x-0 border-b-primary"
              : "text-gray-500"
              }`}
            onClick={() => handleFilterChange("FINISHED")}
          >
            <span>Campaign Selesai</span>
          </div>
        </div>

        {/* <div className="place-content-center px-6">
                <div className="flex my-5">

                    <div
                        className={`mr-2 grid justify-items-center ${selectedStatus === 'NewCamp' ? 'text-blue-500 ' : ''}`}
                        onClick={() => handleFilterChange('NewCamp')}
                    >
                        <span>New Campaign</span>
                        <div className={`w-32 h-0.5 mt-2 ${selectedStatus === 'NewCamp' ? 'bg-blue-500 ' : 'bg-black'}`}></div>
                    </div>
                    <div
                        className={`mr-2 grid justify-items-center ${selectedStatus === 'History' ? 'text-blue-500' : ''}`}
                        onClick={() => handleFilterChange('History')}
                    >
                        <span>History Campaign</span>
                        <div className={`w-32 h-0.5 mt-2 ${selectedStatus === 'History' ? 'bg-blue-500 ' : 'bg-black'}`}></div>
                    </div>

                </div>
            </div> */}

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
                  donation_target={dataFilter.donation_target}
                  donation_collected={dataFilter.donation_collected}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Detonator;

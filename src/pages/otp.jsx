import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useAppState } from "@/components/page/UserContext";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import Swal from "sweetalert2";

const OTP = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [codes, setCodes] = useState();
  const { state } = useAppState();
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownTime, setCountdownTime] = useState(Date.now() + 120000);
  const registrasi = state.registrasi;

  useEffect(() => {
    let countdownInterval;

    if (showCountdown) {
      countdownInterval = setInterval(() => {
        setCountdownTime((prevTime) => prevTime);
      });
    }

    return () => clearInterval(countdownInterval);
  }, [showCountdown]);

  useEffect(() => {
    if (countdownTime > 0) {
      setShowCountdown(true);
    } else {
      setShowCountdown(false);
    }
  }, []);

  const renderer = ({ hours, minutes, seconds }) => {
    return (
      <span>
        {minutes}:{seconds}
      </span>
    );
  };

  const handleChange = (event) => {
    const value = event.target.value;
    if (value.length < 7) {
      setCodes(value);
    }
    if (value.length === 6) {
      const otp = {
        email: registrasi.email,
        code: value,
      };
      handleSubmit(otp);
    }
  };

  const handleResend = () => {
    setLoading(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/resend-otp`,
        { email: sessionStorage.getItem("email") },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer YOUR_ACCESS_TOKEN",
          },
        }
      )
      .then(() => {
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "OTP Sent",
          text: `please check your email`,
          showConfirmButton: false,
          timer: 2000,
        });
      });
  };

  const handleSubmit = async (otp) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/verify-otp`,
        otp,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer YOUR_ACCESS_TOKEN",
          },
        }
      );
      const imageUrl = "/img/illustration/checklist.png";
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
        title: `<p class="w-auto pl-1 font-bold text-md">Akun Berhasil Di Buat</p><p class="text-sm w-auto pl-1 font-light">Terima kasih telah mendaftar untuk menjadi penolong sesama</p>`,
        html: `
          <div class="absolute px-28 ml-4 top-0 mt-4">
            <hr class="border border-black w-16 h-1 bg-slate-700 rounded-lg "/>
          </div>
        `,
        width: "375px",
        showConfirmButton: true,
        confirmButtonText: "Masuk",
        confirmButtonColor: "#3FB648",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
        }
      });
    } catch (error) {
      console.log("error", error.response.data.error[0].field);
      if (error.response.data.error[0].field === "email") {
        Swal.fire({
          icon: "error",
          title: "Gagal Membuat Akun",
          text: "Email Tidak ditemukan silahkan login kembali",
          width: "375px",
          showConfirmButton: true,
          confirmButtonText: "login",
          confirmButtonColor: "#3b82f6",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/login");
          }
        });
        setLoading(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Membuat Akun",
          text: "Kode OTP Tidak Sesuai Atau Expired",
          width: "375px",
          showConfirmButton: true,
          confirmButtonText: "Tutup",
          confirmButtonColor: "#ef4444",
        });
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto bg-white h-screen ">
      <div className="grid justify-items-center w-full">
        <Header />
        <form className="justify-center pt-24 p-2 mt-5 w-full h-full">
          <h5 className="flex justify-center text-4xl text-primary font-bold ">
            Verifikasi
          </h5>
          <h5 className="mt-4 flex justify-center text-center text-sm font-normal">
            Ketikan Kode Verifikasi Yang Telah Dikirimkan Ke Email Anda:{" "}
          </h5>
          <h5 className="flex justify-center text-sm font-normal">
            {registrasi.email}
          </h5>

          <div className="mt-4 flex flex-row items-center px-0 bg-gray-100 text-gray-400 text-sm rounded-lg w-full focus:border-none">
            <input
              onChange={handleChange}
              value={codes}
              name="codes"
              type="number"
              id="codes"
              className="w-full p-0 py-4 bg-transparent focus:border-none text-center" // Menambahkan kelas text-center di sini
              placeholder="* * * * * *"
              required
            />
          </div>

          <div className="flex items-center flex-col justify-center pt-10">
            <div
              style={{
                display: "flex",
                gap: "5px",
                justifyContent: "center",
              }}
              className="font-bold"
            >
              <p>Input Sebelum :</p>
              {showCountdown && (
                <Countdown date={countdownTime} renderer={renderer} />
              )}
            </div>
            <br />
            <p className="text-sm text-center text-black font-light">
              Tidak menerima OTP?
            </p>
            <button
              onClick={() => handleResend()}
              className="text-sm text-cyan-500 hover:underline"
            >
              Kirim Ulang Kode OTP
            </button>
          </div>
          <div className="grid place-items-center mt-40">
            <button
              type="button"
              onClick={() =>
                handleSubmit({ email: registrasi.email, code: codes })
              } // Menggunakan arrow function untuk memanggil handleSubmit saat tombol diklik
              className="text-white w-full bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-bold rounded-xl py-3 text-center"
            >
              Kirim
            </button>
          </div>
        </form>
      </div>
      {loading && <Loading />}
    </div>
  );
};

export default OTP;

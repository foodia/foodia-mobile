import {
  IconEye,
  IconEyeClosed,
  IconLock,
  IconMail,
} from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Header from "../Header";
import Loading from "../Loading";
import { useAppState } from "./UserContext";
import Error401 from "../error401";

const LoginPage = () => {
  const [inputEmail, setEmail] = useState("");
  const [inputPassword, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { state, setRegistrasi } = useAppState();
  const [showPassword, setShowPassword] = useState(true);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const Toast = Swal.mixin({
    toast: true,
    position: "center",
    iconColor: "white",
    customClass: {
      popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const status = localStorage.getItem("status");

    if (role === "detonator" && token && status === "approved") {
      router.push("/detonator");
    } else if (role === "merchant" && token && status === "approved") {
      router.push("/merchant");
    }
  }, [router]);

  const handleSubmit = () => {
    setLoading(true); // Set loading to true when starting authentication

    if (inputPassword.length < 8) {
      Toast.fire({
        icon: "error",
        title: "Password must be at least 8 characters",
        iconColor: "bg-black",
      });
      setLoading(false);
      return;
    }

    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}auth/login`, {
        email: inputEmail,
        password: inputPassword,
      })
      .then((response) => {
        const responseData = response.data.body;

        if (responseData.is_active) {
          axios
            .get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/check-register-status`,
              {
                headers: {
                  Authorization: `Bearer ${responseData.token}`,
                },
              }
            )
            .then((res) => {
              const { detonator, merchant } = res.data.body;

              if (detonator?.status === "approved" && detonator.detonator_id) {
                localStorage.setItem("id_detonator", detonator.detonator_id);
              } else {
                localStorage.setItem("id_detonator", '-');
              }
              if (merchant?.status === "approved" && merchant.merchant_id) {
                localStorage.setItem("id_merchant", merchant.merchant_id);
              } else {
                localStorage.setItem("id_merchant", '-');
              }

              localStorage.setItem("Session", "start");
              localStorage.setItem("fullname", responseData.fullname);
              localStorage.setItem("phone", responseData.phone);
              localStorage.setItem("email", responseData.email);
              localStorage.setItem("role", responseData.role);
              localStorage.setItem("token", responseData.token);
              localStorage.setItem("id", responseData.user_id || " ");
              localStorage.setItem("status", responseData.status || " ");
              localStorage.setItem("note", responseData.note || " ");
              setLoading(false);
              Swal.fire({
                icon: "success",
                title: "Login Success",
                text: `Welcome ${responseData.fullname}`,
                showConfirmButton: false,
                timer: 2000,
              });
              setTimeout(() => {
                router.push("/home");
              }, 2000);
            })
            .catch(() => {
              setLoading(false);
              Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: "Please check your email and password and try again.",
                showConfirmButton: false,
                timer: 2000,
              });
            });
        } else {
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: "Account Inactive",
            text: "Your account is not active. Please contact support.",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        const messages = {
          title: "Login Failed",
          text: "Please check your email and password or try again",
        };
        Error401(error, router, messages);
      });
  };

  return (
    <div className="container mx-auto mt-24 overflow-hidden">
      <Header backto="/" />
      <div className="flex justify-center ">
        <h1 className="text-4xl text-primary font-bold">FOODIA</h1>
      </div>

      <div className="p-4 mt-32 flex flex-col gap-2">
        <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          <IconMail />
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            id="email"
            className="text-black ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Email"
            required
          />
        </div>
        <div className="flex flex-row items-center p-4 pr-2 py-0 bg-gray-100 text-sm rounded-lg focus:ring-blue-500 w-full text-gray-400">
          <IconLock />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "password" : "text"}
            id="password"
            className="text-black ml-2 w-full p-0 py-4 pl-1 bg-transparent"
            placeholder="Password"
            required
          />
          <button onClick={handleClickShowPassword}>
            {showPassword ? <IconEye /> : <IconEyeClosed />}
          </button>
        </div>
        <div className="flex items-start mb-4">
          <Link
            href="/forgot-password"
            htmlFor="remember"
            className="text-xs font-bold text-blue-800 hover:underline"
          >
            Lupa Kata Sandi?
          </Link>
        </div>
        <div className=" grid gap-6 content-center">
          <button
            disabled={!inputEmail || !inputPassword}
            onClick={handleSubmit}
            type="submit"
            className={`text-white ${!inputEmail || !inputPassword ? "bg-slate-400" : "bg-primary"
              } outline-none focus:ring-gray-300 font-bold rounded-xl text-md w-full sm:w-auto py-2 text-center `}
          >
            Masuk
          </button>
        </div>
      </div>

      <div className="mobile-w flex gap-1 justify-center pt-32">
        <label className="font-light text-sm">Tidak memiliki akun?</label>
        <Link
          className="text-blue-950 font-bold hover:underline text-sm"
          href="/registrasi"
        >
          Daftar
        </Link>
      </div>
      {loading && <Loading />}
    </div>
  );
};

export default LoginPage;

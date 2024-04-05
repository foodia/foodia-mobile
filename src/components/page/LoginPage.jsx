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

    if (!inputEmail || !inputPassword) {
      Toast.fire({
        icon: "error",
        title: "Please fill in all fields",
        iconColor: "bg-black",
      });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(inputEmail)) {
      Toast.fire({
        icon: "error",
        title: "Invalid email address",
        iconColor: "bg-black",
      });
      return;
    }
    if (inputPassword.length < 8) {
      // window.alert("Password must be at least 8 characters");
      Toast.fire({
        icon: "error",
        title: "Password must be at least 8 characters",
        iconColor: "bg-black",
      });
      return;
    }

    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}auth/login`, {
        email: inputEmail,
        password: inputPassword,
      })
      .then((response) => {
        const responeData = response.data.body;

        if (responeData.is_active) {
          localStorage.setItem("Session", "start");
          localStorage.setItem("fullname", responeData.fullname);
          localStorage.setItem("phone", responeData.phone);
          localStorage.setItem("email", responeData.email);
          localStorage.setItem("role", responeData.role);
          localStorage.setItem("token", responeData.token);
          localStorage.setItem("id", responeData.id || " ");
          localStorage.setItem("status", responeData.status || " ");
          localStorage.setItem("note", responeData.note || " ");
          Swal.fire({
            icon: "success",
            title: "Login Success",
            text: `Welcome ${responeData.fullname}`,
            showConfirmButton: false,
            timer: 2000,
          });
          setTimeout(() => {
            router.push("/home");
          }, 2000);
        } else {
          setRegistrasi(responeData);
          localStorage.setItem("email", responeData.email);
          Swal.fire({
            icon: "warning",
            title: "Login Failed",
            text: `please activate your account by login first to access this page`,
            showConfirmButton: false,
            timer: 2000,
          });
          setTimeout(() => {
            router.push("/otp");
          }, 2000);
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Please check your email and password and try again.",
          showConfirmButton: false,
          timer: 2000,
        });
        setLoading(false);
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
        {/* <div className="flex items-start mb-4">
          <Link
            href=""
            htmlFor="remember"
            className="text-xs font-bold text-blue-800 hover:underline"
          >
            Forgot password?
          </Link>
        </div> */}
        <div className=" grid gap-6 content-center">
          <button
            onClick={handleSubmit}
            type="submit"
            className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-bold rounded-xl text-md w-full sm:w-auto py-4 text-center "
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

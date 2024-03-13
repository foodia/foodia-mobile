// registrasi.js
import Header from "@/components/Header";
import InputForm from "@/components/Imput";
import Loading from "@/components/Loading";
import { useAppState } from "@/components/page/UserContext";
import {
  IconDeviceMobile,
  IconEye,
  IconEyeClosed,
  IconLock,
  IconMail,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Swal from "sweetalert2";

const Registrasi = () => {
  const router = useRouter();
  const { state, setRegistrasi } = useAppState();
  const [loading, setLoading] = useState(false);

  // Set initial state values or use the values from global state if available
  const [fullname, setfullname] = useState(
    () => state.registrasi?.fullname || ""
  );
  const [phone, setPhone] = useState(() => state.registrasi?.phone || "");
  const [email, setEmail] = useState(() => state.registrasi?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  const Toast = Swal.mixin({
    toast: true,
    position: 'center',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  })

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handlefullnameChange = (event) => {
    setfullname(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();


    // Validation checks
    if (!fullname || !phone || !email || !password || !confirmPassword) {
      Toast.fire({
        icon: 'error',
        title: 'Please fill in all fields',
        iconColor: 'bg-black',
      })
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      Toast.fire({
        icon: 'error',
        title: 'Invalid email address',
        iconColor: 'bg-black',
      })
      return;
    }

    if (!/^08\d{8,13}$/.test(phone)) { // Mengubah ekspresi reguler untuk memeriksa nomor telepon yang diawali dengan '08' dan panjangnya antara 10 hingga 13 karakter
      Toast.fire({
        icon: 'error',
        title: 'Phone number must start with "08" and contain only digits, with length between 10 and 13 characters',
        iconColor: 'bg-black',
      });
      return;
    }

    if (password.length < 8) {
      // window.alert("Password must be at least 8 characters");
      Toast.fire({
        icon: 'error',
        title: 'Password must be at least 8 characters',
        iconColor: 'bg-black',
      })
      return;
    }

    if (password !== confirmPassword) {
      Toast.fire({
        icon: 'error',
        title: 'Password and confirm password do not match',
        iconColor: 'bg-black',
      })
      return;
    }

    // Create an object with the form data
    const formData = {
      fullname,
      phone,
      email,
      password,
    };
    try {
      setLoading(true);
      // Assuming the API response includes data about the user or a token.
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Assuming the response includes a user object or token.
      const userData = response.data.body;

      // Save user data to global state
      console.log(userData);
      console.log("status", userData.is_active);
      setRegistrasi(userData);
      if (userData.is_active) {
        // router.push('/login');
        console.log("login success");
        sessionStorage.setItem("fullname", userData.fullname);
        sessionStorage.setItem("phone", userData.phone);
        sessionStorage.setItem("email", userData.email);
        sessionStorage.setItem("role", userData.role);
        sessionStorage.setItem("token", userData.token);
        Swal.fire({
          icon: "success",
          title: "Akun telah terdaftar",
          text: "silahkan login",
          showConfirmButton: false,
          timer: 2000,
        });
        setRegistrasi(userData);
        router.push("/home");
      } else {
        Swal.fire({
          icon: "warning",
          title: "Akun telah dibuat",
          text: "silahkan aktivasi akun anda terlebih dahulu",
          showConfirmButton: false,
          timer: 2000,
        });
        setRegistrasi(userData);
        setLoading(false);
        router.push("/otp");
      }
      // Redirect to OTP page
    } catch (error) {
      // console.error('Registration failed:', error.response);
      const ResError = error;
      console.log("ResError", ResError);

      Swal.fire({
        icon: "error",
        title: "Gagal Membuat Akun",
        text: ResError,
        showConfirmButton: false,
        timer: 2000,
      });
      setLoading(false);
      setRegistrasi(formData);
    }

    // Save the form data to the registrasi state

    // Clear form fields after submission
    // setfullname('');
    // setPhone('');
    // setEmail('');
    // setPassword('');
    // setConfirmPassword('');
  };

  return (
    <main className="my-0 mx-auto min-h-full mobile-w">
      <div className="mx-auto bg-white h-screen text-primary">
        {/* <Header /> */}
        <div className="flex justify-center py-20">
          <h1 className="text-4xl text-primary font-bold">FOODIA</h1>
        </div>
        <div className="flex flex-col items-center w-full">
          <div
            className="p-2 w-full flex flex-col gap-3"
          // onSubmit={handleSubmit}
          >
            {/* ... (your existing code) */}
            <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
              <IconUser />
              <input
                value={fullname}
                onChange={handlefullnameChange}
                type="text"
                id="fullname"
                className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
                placeholder="Nama Lengkap"
                required
              />
            </div>
            <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
              <IconDeviceMobile />
              <input
                value={phone}
                onChange={handlePhoneChange}
                type="text"
                id="phone"
                className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
                placeholder="Nomor Hp"
                required
              />
            </div>
            <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
              <IconMail />
              <input
                value={email}
                onChange={handleEmailChange}
                type="text"
                id="email"
                className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
                placeholder="Email"
                required
              />
            </div>
            <div className="flex flex-row items-center p-4 pr-3 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
              <IconLock />
              <input
                value={password}
                onChange={handlePasswordChange}
                type={showPassword ? "password" : "text"}
                id="password"
                className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
                placeholder="Password"
                required
              />
              <button onClick={handleClickShowPassword}>
                {showPassword ? <IconEye /> : <IconEyeClosed />}
              </button>
            </div>
            <div className="flex flex-row items-center p-4 pr-3 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
              <IconLock />
              <input
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                type={showConfirmPassword ? "password" : "text"}
                id="password"
                className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
                placeholder="Confirm Password"
                required
              />
              <button onClick={handleClickShowConfirmPassword}>
                {showConfirmPassword ? <IconEye /> : <IconEyeClosed />}
              </button>
            </div>

            <div className="grid gap-4 content-center">
              <button
                onClick={handleSubmit}
                type="submit"
                className="text-white text-center font-bold rounded-xl bg-primary py-3"
              >
                Daftar
              </button>
            </div>
          </div>
          <div className="mobile-w flex gap-1 justify-center pt-14">
            <label className="font-light text-sm text-black">
              Sudah memiliki akun?
            </label>
            <Link
              className="text-blue-950 font-bold hover:underline text-sm"
              href="/login"
            >
              Masuk
            </Link>
          </div>
        </div>
        {loading && <Loading />}
      </div>
    </main>
  );
};

export default Registrasi;

import Swal from "sweetalert2";

const Error401 = (errCode, router) => {
  console.log("errCode", errCode?.response?.data?.code);
  const code = errCode?.response?.data?.code;

  if (code === 401) {
    sessionStorage.clear();
    Swal.fire({
      icon: "error",
      title: "Sesi Anda Berakhir",
      text: `Silakan Login Kembali untuk Melanjutkan`,
      showConfirmButton: true,
      confirmButtonText: "Login",
      confirmButtonColor: "green",
      showCancelButton: true,
      cancelButtonText: "Tutup",
      cancelButtonColor: "red",
      // timer: 2000,
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        router.push("/login");
      } else if (result.isDismissed) {
        sessionStorage.clear();
        router.push("/home");
      }
    });
    // router.push('/login');
  } else if (errCode.code === "ERR_NETWORK") {
    Swal.fire({
      icon: "error",
      title: "Koneksi Bermasalah",
      text: `Silakan Cek Koneksi Anda, dan Coba Lagi`,
      showConfirmButton: true,
      confirmButtonText: "Coba Lagi",
      confirmButtonColor: "green",
      showCancelButton: false,
      // timer: 2000,
    });
    console.log("network error");
  }

  return null;
};

export default Error401;

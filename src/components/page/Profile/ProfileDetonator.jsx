import axios from "axios";
import { useEffect, useState } from "react";

const ProfileDetonator = ({ id }) => {
  const [data, setData] = useState();

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}detonator/fetch/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setData(response.data.body);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          Error401(error, router);
        }
      });
  }, [id]);
  console.log(data);
  return (
    <>
      <div class="card md:flex flex-col max-w-lg">
        <div class="flex-grow text-center md:text-left">
          <div className="mt-2 mb-3">
            <p class="font-bold">KTP</p>
            <p>{data?.ktp_number}</p>
          </div>
        </div>
        <div class="flex-grow text-center md:text-left">
          <div className="mt-2 mb-3">
            <p class="font-bold">Alamat</p>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti
              quo reprehenderit, porro rerum perspiciatis pariatur voluptas ex
              quas excepturi similique atque, animi autem consectetur. Facere
              dolore commodi mollitia maiores fuga.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDetonator;

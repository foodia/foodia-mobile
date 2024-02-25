import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import ProfileDetonator from "@/components/page/Profile/ProfileDetonator";
import ProfileMerchant from "@/components/page/Profile/ProfileMerchant";
import ProfileUser from "@/components/page/Profile/ProfileUser";
import { IconEdit, IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const profile = (profile) => {
    const router = useRouter();
    const [role, setRole] = useState('');
    const [dataUser, setDataUser] = useState();


    useEffect(() => {
        const sesionRole = sessionStorage.getItem('role');
        const userData = {
            fullname: sessionStorage.getItem('fullname'),
            phone: sessionStorage.getItem('phone'),
            email: sessionStorage.getItem('email'),
            role: sessionStorage.getItem('role'),
            token: sessionStorage.getItem('token'),
            id: sessionStorage.getItem('id')
        }
        setDataUser(userData);

        if (sesionRole) {
            setRole(sesionRole);
        } else {
            router.push('/login');
        }
    }, [role]);

    const btnLogout = () => {
        sessionStorage.clear();
        localStorage.removeItem('cart');
        localStorage.removeItem('formData');
        router.push('/home');
    };

    console.log(dataUser);

    return (<>
        <main className="my-0 mx-auto min-h-full mobile-w">
            <Header title="Profile" />
            <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col mt-20 p-4">
                <div class="mx-auto">
                    <div class="card flex justify-between items-center mb-2">
                        <div class="flex  items-center">
                            <div class="w-20 h-20 mr-6 ">
                                <img class="object-cover rounded-full" src="https://tailwindflex.com/public/images/user.png" />
                            </div>
                            <div class="flex-grow text-center md:text-left">
                                <h3 class="text-lg font-bold text-primary">{`${dataUser?.fullname}`}</h3>
                                <p class="text-sm">
                                    {/* {role === 'user' && 'Welcome, User'} */}
                                    {role === 'detonator' && 'Verified Campaigner'}
                                    {role === 'merchant' && 'Verified Campaigner'}
                                </p>
                            </div>
                        </div>
                        <div class="flex">
                            <button onClick={btnLogout} class="flex ">

                                <IconEdit className="mr-2" />
                            </button>
                        </div>
                    </div>

                    <div class="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow mb-2">

                        <h5 class=" text-lg font-bold text-gray-900 ">Email</h5>
                        <p class="mb-2 font-normal text-gray-700 ">{`${dataUser?.email}`}</p>

                        <h5 class=" text-lg font-bold text-gray-900 ">Nomer HP</h5>
                        <p class="mb-2 font-normal text-gray-700 ">{`${dataUser?.phone}`}</p>

                        <h5 class=" text-lg font-bold text-gray-900 ">Alamat</h5>
                        <p class="font-normal text-gray-700 ">
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti quo reprehenderit, porro rerum perspiciatis pariatur voluptas ex quas excepturi similique atque, animi autem consectetur. Facere dolore commodi mollitia maiores fuga.
                        </p>
                    </div>

                    {role === 'user' && (
                        <ProfileUser />
                    )}

                    {role === 'detonator' && (
                        <ProfileDetonator />
                    )}

                    {role === 'merchant' && (
                        <ProfileMerchant />
                    )}

                    <div class="card md:flex max-w-lg">
                        <div class="flex-grow text-center md:text-left">
                            <div className="mt-2 mb-3">
                                {/* <p class="font-bold">log out</p> */}
                                <button onClick={btnLogout} className="flex justify-center items-center align-center btn btn-primary bg-red-500 rounded-lg w-full h-10"><IconLogout />Log Out</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <BottomNav />
        </main>
        {/* <BottomNav /> */}
    </>
    );
}

export default profile;
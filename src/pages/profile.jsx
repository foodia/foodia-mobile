import BottomNav from "@/components/BottomNav";
import ProfileDetonator from "@/components/page/Profile/ProfileDetonator";
import ProfileMerchant from "@/components/page/Profile/ProfileMerchant";
import ProfileUser from "@/components/page/Profile/ProfileUser";
import { IconLogout } from "@tabler/icons-react";
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
        <div class="container mx-auto mt-24 bg-white h-screen border bg-neutral-100 p-4 rounded-lg max-w-full ">
            <div class="mx-auto">
                <div class="card md:flex max-w-lg">
                    <div class="w-20 h-20 mx-auto mb-6 md:mr-6 flex-shrink-0">
                        <img class="object-cover rounded-full" src="https://tailwindflex.com/public/images/user.png" />
                    </div>
                    <div class="flex-grow text-center md:text-left">
                        <p class="font-bold">
                            {role === 'user' && (
                                'Welcome, User'
                            )}

                            {role === 'detonator' && (
                                'Detonator'
                            )}

                            {role === 'merchant' && (
                                'Merchant'
                            )}
                        </p>
                        <h3 class="text-xl heading">{`${dataUser?.fullname}`}</h3>

                    </div>
                </div>
                <div class="card md:flex max-w-lg">
                    <div class="flex-grow text-center md:text-left">
                        <div className="mt-2 mb-3">
                            <p class="font-bold">Email</p>
                            <p >{`${dataUser?.email}`}</p>
                        </div>
                    </div>
                </div>
                <div class="card md:flex max-w-lg">
                    <div class="flex-grow text-center md:text-left">
                        <div className="mt-2 mb-3">
                            <p class="font-bold">Nomer HP</p>
                            <p >{`${dataUser?.phone}`}</p>
                        </div>
                    </div>
                </div>

                <div class="card md:flex max-w-lg">
                    <div class="flex-grow text-center md:text-left">
                        <div className="mt-2 mb-3">
                            <p class="font-bold">Alamat</p>
                            <p >Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti quo reprehenderit, porro rerum perspiciatis pariatur voluptas ex quas excepturi similique atque, animi autem consectetur. Facere dolore commodi mollitia maiores fuga.</p>
                        </div>
                    </div>
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
                            <button onClick={btnLogout} className="flex items-center align-center btn btn-primary bg-red-500 rounded-lg w-full h-10"><IconLogout />Log Out</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* <BottomNav /> */}
    </>
    );
}

export default profile;
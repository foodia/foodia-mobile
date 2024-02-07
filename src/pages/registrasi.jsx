// registrasi.js
import InputForm from "@/components/Imput";
import { useAppState } from "@/components/page/UserContext";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Swal from "sweetalert2";

const Registrasi = () => {
    const router = useRouter();
    const { state, setRegistrasi } = useAppState();

    // Set initial state values or use the values from global state if available
    const [fullname, setfullname] = useState(() => state.registrasi?.fullname || '');
    const [phone, setPhone] = useState(() => state.registrasi?.phone || '');
    const [email, setEmail] = useState(() => state.registrasi?.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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
            window.alert('All fields are required');
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            window.alert('Invalid email format');
            return;
        }

        if (!/^\d+$/.test(phone)) {
            window.alert('Phone number must contain only digits');
            return;
        }

        if (password.length < 8) {
            window.alert('Password must be at least 8 characters');
            return;
        }

        if (password !== confirmPassword) {
            window.alert('Passwords do not match');
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
            // Assuming the API response includes data about the user or a token.
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/register`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Assuming the response includes a user object or token.
            const userData = response.data.body;

            // Save user data to global state
            console.log(userData);
            console.log('status', userData.is_active);
            if (userData.is_active) {
                // router.push('/login');
                console.log('login success');
                setRegistrasi(userData);
                sessionStorage.setItem('fullname', userData.fullname);
                sessionStorage.setItem('phone', userData.phone);
                sessionStorage.setItem('email', userData.email);
                sessionStorage.setItem('role', userData.role);
                sessionStorage.setItem('token', userData.token);
                Swal.fire({
                    icon: 'success',
                    title: 'Akun telah terdaftar',
                    text: 'silahkan login',
                    showConfirmButton: false,
                    timer: 2000,
                });
                setRegistrasi(userData);
                router.push('/home');

            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Akun telah dibuat',
                    text: 'silahkan aktivasi akun anda terlebih dahulu',
                    showConfirmButton: false,
                    timer: 2000,
                });
                setRegistrasi(userData);
                router.push('/otp');
            }
            // Redirect to OTP page
        } catch (error) {
            // console.error('Registration failed:', error.response);
            const ResError = error;
            console.log('ResError', ResError);

            Swal.fire({
                icon: 'error',
                title: 'Gagal Membuat Akun',
                text: ResError,
                showConfirmButton: false,
                timer: 2000,
            });
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
        <div className="container mx-auto mt-24 bg-white h-screen text-primary">
            <div className="grid justify-items-center w-full">
                <h1>Campaign: 1</h1>
                <form className='p-2 mt-10 w-full' onSubmit={handleSubmit}>
                    {/* ... (your existing code) */}
                    <div className="mb-2">
                        <label htmlFor='fullname' className="text-sm font-medium text-gray-900">Full Name</label>
                        <InputForm
                            cssInput={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                            label="fullname" type="text" name="fullname" value={fullname} onChange={handlefullnameChange} placeholder="Full Name"
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor='Phone' className="text-sm font-medium text-gray-900">Phone Number</label>
                        <InputForm
                            cssInput={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                            label="Phone" type="text" name="Phone" value={phone} onChange={handlePhoneChange} placeholder="Phone Number"
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor='Email' className="text-sm font-medium text-gray-900">Email Address</label>
                        <InputForm
                            cssInput={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                            label="Email" type="text" name="Email" value={email} onChange={handleEmailChange} placeholder="Email Address"
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor='Password' className="text-sm font-medium text-gray-900">Password</label>
                        <InputForm
                            cssInput={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                            label="Password" type="password" name="Password" value={password} onChange={handlePasswordChange} placeholder="Password"
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor='ConfirmPassword' className="text-sm font-medium text-gray-900">Confirm Password</label>
                        <InputForm
                            cssInput={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                            label="ConfirmPassword" type="password" name="ConfirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} placeholder="Confirm Password"
                        />
                    </div>

                    <div className="grid gap-4 content-center">
                        <button
                            type="submit"
                            className='text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center'>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Registrasi;

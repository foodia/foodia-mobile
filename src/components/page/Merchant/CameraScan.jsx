import { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import axios from 'axios';
import Error401 from '@/components/error401';
import { useRouter } from 'next/router';
import { IconSquareRoundedX } from '@tabler/icons-react';
import Swal from 'sweetalert2';
import Loading from '@/components/Loading';

const CameraScan = () => {
    const router = useRouter();
    const webcamRef = useRef(null);
    const [data, setData] = useState('No result');
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [aspectRatio, setAspectRatio] = useState(16 / 9);
    const [loading, setLoading] = useState(true);
    const [processedCodes, setProcessedCodes] = useState(new Set());

    const handleDevices = (mediaDevices) => {
        const videoDevices = mediaDevices.filter(({ kind }) => kind === "videoinput");
        setDevices(videoDevices);

        if (videoDevices.length > 0) {
            // Automatically select the rear camera if available
            const rearCamera = videoDevices.find(device => device.label.toLowerCase().includes('back')) || videoDevices[0];
            setSelectedDevice(rearCamera.deviceId);
        }
        setLoading(false);
    };

    useEffect(() => {
        // Request camera access permission when the component is mounted
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(() => {
                navigator.mediaDevices.enumerateDevices().then(handleDevices);
            })
            .catch((error) => {
                console.error('Permission denied or not supported:', error);
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'akses kamera ditolak',
                    text: 'Mohon aktifkan akses kamera browser anda.',
                }).then(() => {
                    router.back(); // Navigate back if permission is denied
                });
            });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (webcamRef.current) {
                const imageSrc = webcamRef.current.getScreenshot();
                if (imageSrc) {
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    const img = new Image();
                    img.onload = () => {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        context.drawImage(img, 0, 0, img.width, img.height);
                        const imageData = context.getImageData(0, 0, img.width, img.height);
                        const code = jsQR(imageData.data, img.width, img.height);
                        if (code) {
                            const qrCode = code.data;
                            if (!processedCodes.has(qrCode)) {
                                setProcessedCodes(prev => new Set(prev).add(qrCode));
                                PostCode(qrCode);
                            }
                        }
                    };
                    img.src = imageSrc;
                }
            }
        }, 1000); // Check every second

        return () => clearInterval(interval);
    }, [webcamRef, processedCodes]);

    const PostCode = (code) => {
        console.log('post code', code);

        if (code) {
            axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}coupon/scan`, {
                qr_code: code,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then((response) => {
                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'QR Code Scanned Successfully',
                            timer: 2000,
                        }).then(() => {
                            router.push('/merchant/kupon');
                        });
                    } else {
                        Error401(response, router);
                    }
                })
                .catch((error) => {
                    Error401(error, router);
                });
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setAspectRatio(window.innerWidth <= 768 ? 4 / 3 : 16 / 9);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleClose = () => {
        router.back();
    };

    const videoConstraints = {
        deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
        aspectRatio: aspectRatio,
    };

    return (
        <div className="w-full flex flex-col items-center bg-white h-screen">
            <div className="flex justify-between items-center w-full px-2 my-2">
                <h1>QR Code Scanner</h1>
                <div onClick={handleClose} className="bg-[#DE0606] rounded-md p-1 font-bold flex items-center justify-center cursor-pointer">
                    <IconSquareRoundedX size={15} className="text-black" />
                </div>
            </div>
            <div className="bg-gray-300 p-2 rounded-md">
                {loading ? (
                    <Loading />
                ) : (
                    selectedDevice && (
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            width={320}
                            height={320}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                        />
                    )
                )}
            </div>
            <select
                className="my-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={e => setSelectedDevice(devices.find(device => device.deviceId === e.target.value)?.deviceId)}
                value={selectedDevice || ""}
            >
                {devices.map(device => (
                    <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Device ${device.deviceId}`}
                    </option>
                ))}
            </select>
            <p className="text-center text-gray-600 my-2">
                {data === 'No result' ? (
                    <span className="text-red-500 font-semibold">Kode QR tidak terbaca</span>
                ) : (
                    <span className="text-green-500 font-semibold">{data}</span>
                )}
            </p>
        </div>
    );
};

export default CameraScan;
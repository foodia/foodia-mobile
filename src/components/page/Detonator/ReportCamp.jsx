import styles from "@/styles/Campaign.module.css"
import { IconCirclePlus } from '@tabler/icons-react';
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from 'react';
import axios from 'axios';
import CardReport from "@/components/CardReport";
import CardReting from "@/components/CardReting";
const ReportCamp = () => {
    const router = useRouter();
    const { id } = router.query;
    console.log('rout', id);
    const [dataApi, setDataApi] = useState([]);
    const [dataCamp, setdataCamp] = useState([]);
    const [loading, setLoading] = useState(true);
    const [jumlahOrder, setJumlahOrder] = useState(0);
    const [jumlahTrue, setJumlahTrue] = useState(0);
    const [dataReting, setDataReting] = useState([]);
    const [dataReport, setDataReport] = useState([]);
    const [ReportDetonator, setReportDetonator] = useState([]);
    const [buttonStatus, setButtonStatus] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        setToken(token);

    }, []);

    //get data campaign
    useEffect(() => {
        const fetchData = async () => {
            // const token = sessionStorage.getItem('token');
            try {
                if (!id) {
                    throw new Error('Missing required session data');
                }

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/fetch/${id}`,

                );

                console.log('data res', response.data.body.orders);
                setDataApi(response.data.body.orders);
                setdataCamp(response.data.body);
                setLoading(false);

            } catch (error) {
                handleRequestError(error);
                console.log('error =', error);
            }
        };

        fetchData();
    }, [id]);
    // console.log('data api', dataCamp);

    //get data rating
    useEffect(() => {
        const fetchData = async () => {
            // const token = sessionStorage.getItem('token');
            try {
                if (!id) {
                    throw new Error('Missing required session data');
                }

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}rating/filter?campaign_id=${id}`,
                    // {
                    //     headers: {
                    //         Authorization: `Bearer ${token}`,
                    //     },
                    // }
                );

                console.log('data Reting', response.data.body);
                setDataReting(response.data.body);
                setLoading(false);

            } catch (error) {
                handleRequestError(error);
            }
        };

        fetchData();
    }, [id]);
    // console.log('data reting', dataReting);


    //get data report
    useEffect(() => {
        const fetchData = async () => {
            // const token = sessionStorage.getItem('token');
            try {
                if (!id) {
                    throw new Error('Missing required session data');
                }

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign-report/filter?campaign_id=${id}&type=merchant`,
                    // {
                    //     headers: {
                    //         Authorization: `Bearer ${token}`,
                    //     },
                    // }
                );

                console.log('data Report', response.data.body);
                setDataReport(response.data.body);
                setLoading(false);

            } catch (error) {
                handleRequestError(error);
            }
        };

        fetchData();
    }, [id]);
    useEffect(() => {
        const fetchData = async () => {
            // const token = sessionStorage.getItem('token');
            try {
                if (!id) {
                    throw new Error('Missing required session data');
                }

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign-report/filter?campaign_id=${id}&type=detonator&per_page=1`,
                    // {
                    //     headers: {
                    //         Authorization: `Bearer ${token}`,
                    //     },
                    // }
                );

                console.log('data Report', response.data.body);
                setReportDetonator(response.data.body);
                setLoading(false);

            } catch (error) {
                handleRequestError(error);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        setJumlahOrder(dataApi.length);
        setJumlahTrue(dataApi.filter((data) => data.is_report === true).length);

        if (jumlahTrue === jumlahOrder) {
            setButtonStatus(true);
            if (ReportDetonator.length > 0) {
                setButtonStatus(false);
            }
        } else {
            setButtonStatus(false);
        }


        console.log('jum', dataApi.length, 'true', dataApi.filter((data) => data.is_rating === true).length, `jumlah order`, jumlahOrder, 'button', buttonStatus);
        console.log('data', dataApi);
    }, [dataApi]);
    const handleRequestError = (error) => {
        console.error('Error fetching data:', error);

        if (error.response && error.response.status === 401) {
            sessionStorage.clear();
            router.push('/login/detonator');
        }

        setLoading(false);
        setdataCamp([]);
    };

    return (
        <>
            <div className="container mx-auto mt-24 bg-white h-screen">

                <div className="mx-auto text-center p-2 text-primary">
                    <h1 className="font-bold">Report Campaigner</h1>
                    <h1>{dataCamp.event_name}</h1>
                </div>
                <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />

                <h1 className="m-2 font-bold">{`Merchant Report(${jumlahTrue}/${jumlahOrder}) `}</h1>

                {loading && <p>Loading...</p>}

                {/* {dataReting.map((item) => (
                    <CardReting key={item.id} data={item} />
                ))} */}

                {dataReport.map((item) => (
                    <CardReport key={item.id} data={item} />
                ))}
                <h1 className="m-2 mt-4 font-bold">{`Detonator Report `}</h1>
                {ReportDetonator.map((item) => (
                    <CardReport key={item.id} data={item} />
                ))}
                {/* {dataReting.map((item) => (
                    <CardReport key={item.id} data={item} />
                ))} */}

            </div>
            <div className="mobile-w fixed flex justify-center h-20 bottom-0 my-0 mx-auto w-full max-w-screen-sm ">

                {token && (
                    <div className="w-full grid place-content-center p-2">
                        {buttonStatus ? (
                            <Link href={`/detonator/createreport/${id}`} className="bg-primary text-white font-bold py-2 px-4 rounded-full flex items-center">
                                <IconCirclePlus className="mr-2" />
                                Buat Laporan
                            </Link>
                        ) : (
                            <button className="bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded-full cursor-not-allowed" disabled>
                                Buat Laporan
                            </button>
                        )}
                    </div>
                )}



            </div>

        </>

    );
}

export default ReportCamp;
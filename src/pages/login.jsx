
import Header from "@/components/Header";
import LoginPage from "@/components/page/LoginPage";

const login = (login) => {
    return (
        <main className=" ">
            {/* <Header /> */}
            <div className="container my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
                <LoginPage />
            </div>


        </main>
    );
}

export default login;
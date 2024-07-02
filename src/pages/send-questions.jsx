import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { useRouter } from "next/router";
import { useState } from "react";

const sendQuestions = (profile) => {
  const router = useRouter();
  const [questions, setQuestions] = useState("");

  return (
    <>
      <div className="bg-white flex flex-col w-full">
        <Header title="Kirim Pertanyaan" />
        <div className="pt-16 pb-32 flex flex-col p-5 overflow-auto h-screen gap-2">
          <div className="flex flex-row p-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none pr-2">
            <textarea
              maxLength={120}
              onChange={(e) => setQuestions(e.target.value)}
              value={questions}
              type="text"
              className="w-full text-black min-h-[95px] p-0 py-4 bg-transparent focus:border-none outline-none"
              placeholder="Pertanyaan"
              required
              style={{ resize: "none" }}
            />
          </div>
          <p className="text-gray-400 text-start text-xs mb-8">
            Kami akan membalas pertanyaanmu melalui Email
          </p>
          <button
            disabled={!questions}
            // onClick={() => handleSubmit()}
            type="submit"
            className={
              !questions
                ? "text-white bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-xl text-xl w-full sm:w-auto px-5 py-2.5 text-center"
                : "text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-xl text-xl w-full sm:w-auto px-5 py-2.5 text-center"
            }
          >
            Kirim
          </button>
        </div>
      </div>
      <BottomNav />
    </>
  );
};

export default sendQuestions;

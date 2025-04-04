import React, { useState } from "react";
import faqs from "./faq_api";
import './faq.css'
import { FaChevronDown } from "react-icons/fa";

const Faq = () => {
  const [ansId, setAnsId] = useState(-1);

  const toggleAns = (id) => {
    setAnsId(ansId === id ? -1 : id);
  };

  return (
    <div className="faqContainer flex flex-col items-center bg-white min-h-screen py-10">
      <div className="faqHead text-4xl font-semibold text-black mb-8">
        Frequently Asked Questions
      </div>
      <div className="faqCards w-[60%] flex flex-col gap-5">
        {faqs.map((fq) => (
          <div
            key={fq.id}
            className="faqCard border rounded-md p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div
              className="questionContainer flex justify-between items-center text-2xl text-black cursor-pointer"
              onClick={() => toggleAns(fq.id)}
            >
              <div className="question">{fq.question}</div>
              <FaChevronDown
                className={`transition-transform ${ansId === fq.id ? "rotate-180" : ""}`}
                style={{ color: "#6B63FF" }}
              />
            </div>

            {ansId === fq.id && (
              <div className="ansDiv mt-4 text-lg text-black p-4 border-t border-gray-200">
                {fq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
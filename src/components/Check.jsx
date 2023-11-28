import React, { useEffect, useState } from "react";

const Check = () => {
  const [showPopup, setShowPopup] = useState(
    localStorage.getItem("popupShown") !== "true"
  );
  const [response, setResponse] = useState("");

  const handleButtonClick = async () => {
    try {
      const response = await fetch(
        "https://netflyer-backend.nesbeer.repl.co/api/handleButtonClick",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setResponse(data.success ? "Thank You." : "Thanks");
      setTimeout(() => {
        setShowPopup(false);
        localStorage.setItem("popupShown", "true");
      }, 3000);
    } catch (error) {
      console.error("Error handling button click:", error);
      setResponse("Error handling button click");
    }
  };

  useEffect(() => {
    setShowPopup(localStorage.getItem("popupShown") !== "true");
  }, []);

  return (
    <>
      {showPopup && (
        <div className="fixed top-0 left-0 w-full z-50 h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md">
            <p>Has anyone using this website?</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md"
              onClick={handleButtonClick}
            >
              Yes
            </button>
            <p className="font-500">{response}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Check;

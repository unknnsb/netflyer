import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from "@nextui-org/react";
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
      setResponse(data.success ? "Thank You." : "Thank You Again.");
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
        <Modal className="text-white" placement="auto" isOpen={showPopup}>
          <ModalHeader>What's This?</ModalHeader>
          <ModalContent>
            <ModalBody>
              This is popup to know if anyone is using this website.
            </ModalBody>
            <ModalFooter>
              {response ? (
                <Button auto flat color="success" disabled>
                  <Spinner color="success" />
                </Button>
              ) : (
                <Button onClick={handleButtonClick} auto flat color="danger">
                  I'm Using
                </Button>
              )}
              {response && (
                <Button auto flat color="success" disabled>
                  {response}
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default Check;

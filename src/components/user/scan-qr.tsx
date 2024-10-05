"use client";

import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";

const ScanQR = () => {
  const handleOnScan = (detectedCodes: IDetectedBarcode[]) => {
    console.log("detectedCodes", detectedCodes);
  };

  return (
    <div className="flex items-center justify-center h-[50vh]">
      <Scanner onScan={handleOnScan} />
    </div>
  );
};

export default ScanQR;

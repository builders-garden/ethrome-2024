"use client";

import {
  IDetectedBarcode,
  Scanner,
  useDevices,
  boundingBox,
} from "@yudiel/react-qr-scanner";
import { useEffect, useState } from "react";

const ScanQR = () => {
  const devices = useDevices();
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);

  const handleOnScan = (detectedCodes: IDetectedBarcode[]) => {
    console.log("detectedCodes", detectedCodes);
  };
  const handleScanError = (error: unknown) => {
    console.error("Error scanning QR code", error);
  };

  if (!devices || devices.length === 0) {
    return <div>No devices found</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-[50vh]">
      <select onChange={(e) => setDeviceId(e.target.value)}>
        <option value={undefined}>Select a device</option>
        {devices.map((device, index) => (
          <option key={index} value={device.deviceId}>
            {device.label}
          </option>
        ))}
      </select>
      <div className="w-full h-[50vh]">
        {deviceId && deviceId !== undefined && (
          <Scanner
            onScan={handleOnScan}
            onError={handleScanError}
            constraints={{
              deviceId: deviceId,
            }}
            components={{
              audio: true,
              onOff: true,
              torch: true,
              zoom: true,
              finder: true,
              tracker: boundingBox,
            }}
            allowMultiple={true}
            scanDelay={2000} // delay in ms
            formats={[
              "qr_code",
              "micro_qr_code",
              "rm_qr_code",
              "maxi_code",
              "pdf417",
              "aztec",
              "data_matrix",
              "matrix_codes",
              "dx_film_edge",
              "databar",
              "databar_expanded",
              "codabar",
              "code_39",
              "code_93",
              "code_128",
              "ean_8",
              "ean_13",
              "itf",
              "linear_codes",
              "upc_a",
              "upc_e",
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default ScanQR;

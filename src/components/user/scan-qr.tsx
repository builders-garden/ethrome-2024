"use client";

import {
  IDetectedBarcode,
  Scanner,
  useDevices,
  boundingBox,
} from "@yudiel/react-qr-scanner";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { APP_URL } from "@/lib/utils";

const ScanQR = () => {
  const router = useRouter();
  const devices = useDevices();
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);

  const handleOnScan = (detectedCodes: IDetectedBarcode[]) => {
    const link = detectedCodes[0].rawValue;
    console.log("scanned link", link);
    if (link.startsWith(`${APP_URL}/user/`)) {
      router.push(link);
    }
  };
  const handleScanError = (error: unknown) => {
    console.error("Error scanning QR code", error);
  };

  if (!devices || devices.length === 0) {
    return <div>No devices found</div>;
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-[50vh] px-2 py-4">
      <Select onValueChange={(value) => setDeviceId(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select a device" />
        </SelectTrigger>
        <SelectContent>
          {devices.map((device, index) => {
            if (device.deviceId) {
              return (
                <SelectItem key={index} value={device.deviceId}>
                  {device.label}
                </SelectItem>
              );
            } else {
              return null;
            }
          })}
        </SelectContent>
      </Select>
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

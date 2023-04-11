import { Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Html5QrcodeScanType } from "html5-qrcode/esm/core";
import React, { useEffect, useRef, useState } from "react";
import { useFetchCameras } from "./utils/useFetchCameras";
import {
  HtmlQrcodeAdvancedPlugin,
  IHtmlQrcodePluginForwardedRef,
} from "./Html5QrcodePlugin";
import Spinner from "./Spinner";

import { MdSmsFailed } from "react-icons/md";
import { IoIosSad } from "react-icons/io";

interface IInfoProps {
  title: string;
}

const CONFIG = {
  fps: 4,
  qrbox: { width: 300, height: 200 },
  formatsToSupport: [
    Html5QrcodeSupportedFormats.CODE_128,
    Html5QrcodeSupportedFormats.QR_CODE,
  ],
  rememberLastUsedCamera: true,
  supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
};

const QRCODE_REGION = "QRCODE_SCANNER_REGION";

interface IQrcodeScannerProps {
  onCodeScanned: (code: string) => void;
}

export const QrcodeScanner: React.FC<IQrcodeScannerProps> = ({
  onCodeScanned,
  className,
}: IQrcodeScannerProps) => {
  const {
    fetchCameras,
    state: { loading, error, cameraDevices },
  } = useFetchCameras();

  useEffect(() => {
    fetchCameras();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ref = useRef<IHtmlQrcodePluginForwardedRef>(null);

  const [selectedCameraId, setSelectedCameraId] = useState<string | undefined>(
    undefined
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center ">
        <Spinner />
        <h3>Detecting available cameras...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center">
        <MdSmsFailed size={35} />
        <h3>Failed to detect cameras</h3>
        <small>
          &#10004; Other applications may be using your camera. Please close
          those applications first.
        </small>
        <small>
          &#10004; Permission to use the camera may not have been given.
        </small>
        <small>&#10004; Your device might not have a camera.</small>
      </div>
    );
  }

  if (cameraDevices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <IoIosSad />
        <h3>No available cameras</h3>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${className ? className : ""}`}>
      <HtmlQrcodeAdvancedPlugin
        ref={ref}
        config={CONFIG}
        onCodeScanned={onCodeScanned}
        qrcodeRegionId={QRCODE_REGION}
        cameraId={selectedCameraId || cameraDevices[0].id}
        className={`w-full h-full ${className ? className : ""}`}
      />

      {/* {cameraDevices.length > 1 && (
        <select
          defaultValue={cameraDevices[0].id}
          onChange={(event) => {
            setSelectedCameraId(event.target.value);
          }}
          className="focus:outline-none transition ease-in-out duration-300 rounded-lg my-1 bg-gray-200 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 p-2 text-sm w-min"
        >
          {cameraDevices.map((device) => (
            <option key={device.id} value={device.id} label={device.label} />
          ))}
        </select>
      )} */}
    </div>
  );
};

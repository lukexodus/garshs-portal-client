import { Html5Qrcode } from "html5-qrcode";
import { useCallback, useState } from "react";

const defaultState = {
  loading: false,
  cameraDevices: [],
};

export const useFetchCameras = () => {
  const [state, setState] = useState(defaultState);
  const fetchCameras = useCallback(async () => {
    try {
      if (!state.loading) {
        setState((prevState) => ({ ...prevState, loading: true }));
        const result = await Html5Qrcode.getCameras();
        setState({
          loading: false,
          cameraDevices: result,
        });
      }
    } catch (error) {
      setState({
        loading: false,
        error: new Error("Not permitted"),
        cameraDevices: [],
      });
    }
  }, [state.loading]);

  return { state, fetchCameras };
};

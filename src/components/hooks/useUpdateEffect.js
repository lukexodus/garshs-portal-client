import { useEffect, useRef } from "react";
import { NODE_ENV } from "../../config/config";

// export default function useUpdateEffect(callback, dependencies) {
//   const firstRenderRef = useRef(true);
//   const effectRan = useRef(false);

//   useEffect(() => {
//     if (effectRan.current === true || NODE_ENV !== "development") {
//       if (firstRenderRef.current) {
//         firstRenderRef.current = false;
//         return;
//       }
//       callback();
//     }
//     return () => {
//       effectRan.current = true;
//     };
//   }, dependencies);
// }

export default function useUpdateEffect(callback, dependencies) {
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    callback();
  }, dependencies);
}

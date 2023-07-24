import React, { useRef, useState } from "react";
// import CustomToast from "../components/CustomToast";
import silentFetch from "./silentFetch";

const useBaseApi = () => {
  const [inProgress, setInProgress] = useState(false);
  let result = useRef();
  // let toast = CustomToast();
  // const parseGenericRespone = (response) => {
  //   switch (response.messageType) {
  //     case "WARNING":
  //       toast.toast("WARNING", response.message);
  //       return true;

  //     case "SUCCESS":
  //       toast.toast("SUCCESS", response.message);
  //       return true;

  //     case "ERROR":
  //       toast.toast("ERROR", response.message);
  //       return true;

  //     default:
  //       break;
  //   }
  // };
  let invoke = (endPoint, method, data) => {
    setInProgress(true);
    return new Promise(async (resolve, reject) => {
      let requestBody = null;
      if (endPoint && method && data) {
        requestBody = JSON.stringify({
          data:data,
        });
      }
      try {
        let response = await silentFetch(endPoint, {
          method: method || "POST",
          body: requestBody,
        });
        result.current = await response.json();
        // let toResolve = result.current;
        resolve(result.current);
        // if (toResolve) {
        //   resolve(result.current);
        // } else {
        //   reject(result?.code);
        // }
        setInProgress(false);
      } catch (error) {
        console.log(error);
      }
    });
  };

  return {
    invoke,
    result: result.current,
    inProgress,
  };
};

export default useBaseApi;
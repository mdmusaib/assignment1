import React from "react";
import useBaseApi from "./useBaseApi";

const useApi = (props) => {
  let base = useBaseApi();
  let invoke = (service) => {
    let { endPoint, method, data } = service;
    return base.invoke(endPoint, method, data);
  };
  return {
    invoke,
    inProgress: base.inProgress,
  };
};

export default useApi;
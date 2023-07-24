const silentFetch = (url, request) => {
    let call = async (resolve, reject) => {
      try {
        request.headers = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        };
        let response = await fetch(url, request);
        resolve(response);
      } catch (error) {
        reject(error);
      }
    };
  
    let promise = new Promise((resolve, reject) => {
      call(resolve, reject);
    });
    return promise;
  };
  
  export default silentFetch;
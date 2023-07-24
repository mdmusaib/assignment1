import React, { useState, useEffect } from 'react';
import useApi from "../src/core/useApi";
import './App.css';
const WebSocket = require('websocket').w3cwebsocket;
const ws = new WebSocket('ws://localhost:8080'); // Replace with your server URL
// custom hook



const App = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [clicked, setClicked] = useState(false);
  const [apiResult,setApiResult]= useState();
  // api
  let api=useApi();
  useEffect(() => {

    
    // const ws = new WebSocket('ws://localhost:8080'); // Replace with your server URL

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (message) => {
      console.log('Received from server:', message.data);
      setOutputText(message.data);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    // Clean up WebSocket on unmount
    return () => {
      if(inputText !==""){

        // ws.close();
      }
    };

    
  }, []);

  useEffect(()=>{
    if(clicked){

      ws.send(inputText);
      setInputText('');
      setClicked(false);
      // ws.close();

    }
  },[clicked]);
  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSendData = () => {
    if (inputText.trim() !== '') {
      // Send data to the server
      // ws.send(inputText);
      setClicked(true);
      
    }
  };
  const handleRestApiInput= async (event) => {
    if (event.target.value.trim() !== '') {
      // Send data to the server
      // ws.send(inputText);
      // Send new item data to the server
      let response=api.invoke({endPoint:"http://localhost:8080/api/data",method:"post",data:event.target.value})
    console.log('res',response);

      if (response.status === 201) {
        // setInputText('');
        setOutputText('Item added successfully!');
        setApiResult(response);
      }
      
    }
  }

   // Function to fetch inputs from the server
   const fetchItems = async () => {
    let response=api.invoke({endPoint:"http://localhost:8080/api/inputs",method:"get",data:''})
    console.log('res',response);
    // const data = await response.json();
    setApiResult(response);
  };
  // const handleAddItem = async (inputVal) => {
  //   if (inputVal.trim() !== '') {
  //     const newItem = inputVal;

      
  //   }
  // };

  return (
    <div className="App">
      <h1>WebSocket Example</h1>
      <input type="text" value={inputText} onChange={handleInputChange} />
      <button onClick={handleSendData}>Send</button>
      <div>
        {/* Realtime response from node server using websocket */}
        <strong>Server Response:</strong> 
        <p>{outputText}</p>
      </div>

      {/* rest api endpoints */}
      <div>
        <p>get joystick input</p>
      <button onClick={fetchItems}>get</button>
      <p>post API for inputing data from joystick input</p>
      {/* <button onClick={handleAddItem}>send:</button> */}
      </div>
      <input type="text"  onChange={handleRestApiInput} />
      <p><strong>Server Response By Rest API:</strong> </p>
      <p>{apiResult && JSON.stringify(apiResult)}</p>
    </div>
  );
};

export default App;

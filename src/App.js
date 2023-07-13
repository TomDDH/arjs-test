import "./App.css";
import ThreeViewer from "./three";
import React, { useEffect, useRef, useState } from "react";


function App(props) {

  const container = useRef();
  const [needScan, setNeedScan] = useState(true);
  const [videoEnd, setVideoEnd] = useState(false);
  const vieoRef = useRef()
  const tragetUrl = props.url



  
  const startAR = () => {
    ThreeViewer(
      container.current,
      setNeedScan,
      tragetUrl
    );
  };



  useEffect(() => {
    // pass
    startAR()

  }, [])


  const showDirect = () => {
    setVideoEnd(true)
  }

  return (
    <React.Fragment>

      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
        ref={container}
        id="container"
      ></div>
    </React.Fragment>
  );
}

export default App;

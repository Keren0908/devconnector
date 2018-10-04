import React from "react";
import loading from "./Loading.gif";

export default () => {
  return (
    <div>
      <img src={loading} alt="loading..." style={{width:'200px', margin:'auto',display:'block' }}/>
    </div>
  );
};

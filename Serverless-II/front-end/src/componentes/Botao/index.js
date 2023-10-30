import "./Botao.css";
import React from "react";

const Botao = (props) => {
  return (
    <button className='botao' {...props}>
      {props.children}
    </button>
  );
};

export default Botao;

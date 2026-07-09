// Loader.jsx

import "./style/loader.scss";
const Loader = ({ text }) => {
  return (
    <div className="loader">
      <div className="loader-ring">
        <div className="loader-core">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <p>{text}</p>
    </div>
  );
};



export default Loader;
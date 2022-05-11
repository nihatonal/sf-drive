import React, {useContext, useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { ShareContext } from "../../context/share-contex";
import SocialLinks from "./SocialLinks";
import "./MainFooter.css";

const MainFooter = (props) => {
  const auth = useContext(AuthContext);
  
  const { pathname } = useLocation();
  const [carId, setCarId] = useState();

  useEffect(() => {
    const selectedCar = JSON.parse(localStorage.getItem("selectedCar"));
    if (selectedCar) {
      setCarId(selectedCar[0].id)
    }
  }, [carId]);

  if (
    pathname === "/signup" ||
    pathname === `/${auth.userId}/cars` ||
    pathname === "/userphoto" ||
    pathname === "/userdocs" ||
    pathname === `/${auth.userId}/success` ||
    pathname === `/${auth.userId}/addcar` ||
    pathname === `/${auth.userId}/${carId}` ||
    pathname === `/rentacar/${carId}` ||
    pathname === `/cars/${carId}`
  )
    return null;

  const content = (
    <footer className={"footer content_wrapper"}>
      <div className="footer__content">
        <p className="footer__copyright">© SkillDrive Inc. 2020</p>
        <SocialLinks />
      </div>
    </footer>
  );

  return content;
};

export default MainFooter;

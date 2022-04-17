import React, { useContext, useEffect, useState } from "react";
import Button from "../../shared/Components/FormElements/Button";
import SendError from "../../SignUpPage/components/SendError";
import { FaArrowLeft } from "react-icons/fa";
import { options } from "../../assets/options";
import { extraoptions } from "../../assets/extraoptions";
import { useWindowDimensions } from "../../shared/hooks/useWindowDimensions";
import { ShareContext } from "../../shared/context/share-contex";

import "./OptionOfCar.css";

const OptionOfCar = (props) => {
  const share = useContext(ShareContext);
  const [error, SetError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [carinfo, setCarInfo] = useState([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("carData"));
    const storedOptions = JSON.parse(localStorage.getItem("carOptions"));

    if (storedOptions) {
      setCarInfo(storedOptions.options);
     
    }
  }, []);

  const onChangeHandler = (e) => {
    const isChecked = e.target.checked;

    const options = e.target.name;

    if (isChecked && options === "options") {
      setSelectedOptions(...selectedOptions, (oldArray) =>
        oldArray.concat(e.target.value)
      );
    } else {
      setSelectedOptions((oldArray) =>
        oldArray.filter((item) => item !== e.target.value)
      );
    }

    if (isChecked && options === "services") {
      setSelectedServices((oldArray) => oldArray.concat(e.target.value));
    } else {
      setSelectedServices((oldArray) =>
        oldArray.filter((item) => item !== e.target.name)
      );
    }
  };

  console.log(selectedOptions);

  const checkUpdate = (arr, item) => {
    if (arr.includes(item)) {
      return true;
    }
  };

  const backHandler = () => {
    localStorage.setItem(
      "carOptions",
      JSON.stringify({
        options: selectedOptions,
        services: selectedServices,
      })
    );
  };

  const signupFormHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      localStorage.setItem(
        "carData",
        JSON.stringify({
          carinfo,
          options: selectedOptions,
          services: selectedServices,
        })
      );
    } catch (err) {
      SetError(true);
      setIsLoading(false);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    setPositionUp(true);
  };

  //After submit scroll butoon up

  const [positionUp, setPositionUp] = useState(false);
  const { height } = useWindowDimensions();
  const style_button = { top: height - 234, position: "absolute" };

  return (
    <>
      {error ? (
        <SendError sendError="Не удалось продолжить регистрацию. Попробуйте ещё раз" />
      ) : null}
      <form className="form__container-options" onSubmit={signupFormHandler}>
        <div className={"form__container-head"}>
          <p className={"form__container-head-subtitle"}>Шаг 2 из 4</p>
          <h1 className={"form__container-head-title"}>Дополнительно</h1>
        </div>
        <div>
          <div onClick={props.onClick}>
            <p className={"form__container-backArrow"} onClick={backHandler}>
              <i className={"fa"}>
                <FaArrowLeft />
              </i>
              Назад
            </p>
          </div>
          <div className="form-content options-wrapper">
            <h2>Опции автомобиля</h2>

            {options.map((item) => (
              <div key={item.name} className="option-item">
                <label htmlFor={item.name}>
                  <img src={item.image} alt={item.name} />
                  <p>{item.name}</p>
                </label>
                <input
                  className="checkbox"
                  id={item.name}
                  type="checkbox"
                  name="options"
                  value={item.name}
                  //defaultChecked={item.name === "Крепления Iosfix" ? !checked : ""}
                  defaultChecked={checkUpdate(carinfo, item.name)}
                  //checked={checkUpdate(carinfo, item.name)}
                  onChange={onChangeHandler}
                />
                <div className="checkbox-ref">
                  <div className="checkbox-ref-circle"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="form-content extra">
            <h2>Дополнительные услуги</h2>
            {extraoptions.map((item) => (
              <div key={item.name} className="option-item">
                <input
                  className="checkbox"
                  id={item.name}
                  type="checkbox"
                  name="services"
                  value={item.name}
                  onChange={onChangeHandler}
                />
                <label htmlFor={item.name} className="extra-options">
                  <div>
                    <p>{item.name}</p>
                    <p>{item.subname}</p>
                  </div>
                  <p className="price-option">{item.price}</p>
                </label>

                <div className="checkbox-ref">
                  <div className="checkbox-ref-circle"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className={"button-container"}
          style={positionUp ? style_button : null}
        >
          <Button type="submit" inverse disabled={!selectedOptions.length}>
            {!isLoading ? (
              "Продолжить"
            ) : (
              <i className="fa fa-circle-o-notch fa-spin"></i>
            )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default OptionOfCar;
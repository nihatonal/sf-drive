import React, { useContext, useEffect, useState, useCallback } from "react";

import Calender from "../../shared/Components/FormElements/Calender";
import OptionCity from "../components/OptionCity";
import OptionCar from "../components/OptionCar";
import { ShareContext } from "../../shared/context/share-contex";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Button from "../../shared/Components/FormElements/Button";
import { GetUser } from "../../shared/hooks/get-user";
import date_picker from "../../assets/icons/calender.svg";

import "./RentACar.css";
const RentACar = () => {
  const share = useContext(ShareContext);
  const { isLoading, sendRequest } = useHttpClient();
  const [loadedCars, setLoadedCars] = useState();
  const [loadedUser, setLoadedUser] = useState();
  const [dates, setDates] = useState(share.date_ranges);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/cars/`
        );

        setLoadedCars(responseData.cars);
      } catch (err) {}
    };
    fetchCars();
  }, [sendRequest]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/`
        );

        setLoadedUser(responseData.users);
      } catch (err) {}
    };
    fetchCars();
  }, [sendRequest]);

  const getUser = (x) => {
    return loadedUser.filter((user) => user.id === x);
  };

  const getDates = useCallback(() => {
    setDates(share.date_ranges);
  }, [share.date_ranges[0]]);

  useEffect(() => {
    getDates();
  }, [getDates]);

  const test = (e) => {
    e.preventDefault();
    setDates(share.date_ranges);
    console.log(share.date_ranges, share.car, share.city);
  };

  return (
    <div className="usermain-container">
      <h2 className="search-title">Арендуйте автомобиль</h2>
      <form className="search-bar">
        <div className="input_container">
          <OptionCity cityClass="input_city" idCity="city" />

          <Calender className={"calender-fix"} image={date_picker} />

          <OptionCar idCity="car" />
        </div>

        <Button onClick={test} className="search-btn" inverse>
          Найти
        </Button>
      </form>

      <div className="recommended-cars-container">
        <h3>Рекомендуем поблизости</h3>
        {loadedCars && (
          <div className="recommended-cars-wrapper">
            {loadedCars.map((item) => (
              <div className="recommended-car-item" key={item.id}>
                <div className="recommended-car-item_filter"></div>
                <img src={`http://localhost:5000/${item.images[0]}`} />
                <div className="recommended-car-item-content">
                  <p>{`${item.brand} ${item.model}, ${item.year}`}</p>
                  <p>{`от ${item.price} ₽/сутки`}</p>
                </div>
                {loadedUser && (
                  <img
                    className="user_photo"
                    src={`http://localhost:5000/${
                      getUser(item.owner)[0].image
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RentACar;
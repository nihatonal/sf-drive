import React, { useContext, useEffect, useState, useCallback } from "react";

import Calender from "../../shared/Components/FormElements/Calender";
import OptionCity from "../components/OptionCity";
import OptionCar from "../components/OptionCar";
import { ShareContext } from "../../shared/context/share-contex";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Button from "../../shared/Components/FormElements/Button";
import { useNavigate } from "react-router-dom";
import date_picker from "../../assets/icons/calender.svg";
import axios from "axios";  

import "./RentACar.css";
const RentACar = () => {
  const auth = useContext(AuthContext);
  const share = useContext(ShareContext);
  const navigate = useNavigate();
  const { isLoading, sendRequest } = useHttpClient();
  const [loading, setLoading] = useState(false);
  const [loadedCars, setLoadedCars] = useState();
  const [loadedUser, setLoadedUser] = useState();
  const [dates, setDates] = useState(share.date_ranges);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true)
      return axios
        .get(`http://localhost:5000/api/cars/`, {
          headers: {
            Authorization: 'Bearer ' + auth.token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setLoadedCars(res.data.cars);
          setLoading(false)
        });
      // try {
      //   const responseData = await sendRequest(
      //     `http://localhost:5000/api/cars/`,
      //     {
      //       Authorization: "Bearer " + auth.token,
      //       "Content-Type": "application/json",
      //     }
      //   );

      //   setLoadedCars(responseData.cars);
      // } catch (err) {}
    };
    fetchCars();
  }, [auth.token]);

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

  const modalHandler = (e) => {
    e.stopPropagation();
    const selectCar = loadedCars.filter((car) => car.id === e.target.id);
    localStorage.setItem("selectedCar", JSON.stringify(selectCar));

    navigate("/rentacar/rentusercar");
  };

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
              <div
                className="recommended-car-item"
                key={item.id}
                onClick={modalHandler}
              >
                <div className="recommended-car-item_filter" id={item.id}></div>
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

import React from "react";
import moment from 'moment';

import { v4 as uuid_v4 } from "uuid";
import OutsideClickHandler from "../../util/OutsideClickHandler";

import { ShareContext } from '../../context/share-contex';
import 'moment/locale/ru'
import './Calender.css';
import left from '../../../assets/icons/left_arrow.svg';
import right from '../../../assets/icons/right_arrow.svg';

const Heading = ({ date, changeMonth, resetDate, changeYear }) => {
  moment.locale('ru')
  const str = date.format('MMMM');

  return <nav className="calendar--nav">
  <div className="calender-nav-item">
      <img src={left} onClick= {() => changeMonth(date.month() - 1)} />
      <h1 onClick={() => resetDate()}>{str.charAt(0).toUpperCase() + str.slice(1)}</h1>
      <img src={right} onClick= {() => changeMonth(date.month() + 1)} />
  </div>
  <div className="calender-nav-item">
      <img src={left} onClick= {() => changeYear(date.year() - 1)} />
      <h1 style={{width: "45px"}} onClick={() => resetDate()}>{date.format('YYYY')}</h1>
      <img src={right} onClick= {() => changeYear(date.year() + 1)} />
  </div>
  
</nav>
}


const Day = ({ currendate, date, startDate, endDate, onClick }) => {
  let className = [];

  if (moment().isSame(date, 'day')) {
    className.push('active');
  }

  if (date.isSame(startDate, 'day')) {
    className.push('start');
  }

  if (date.isBetween(startDate, endDate, 'day')) {
    className.push('between');
  }

  if (date.isSame(endDate, 'day')) {
    className.push('end');
  }

  if (!date.isSame(currendate, 'month')) {
    className.push('muted');
  }

  
  return /*#__PURE__*/(
    React.createElement("span", { onClick: () => onClick(date), currendate: date, className: className.join(' ') }, date.date()));

};

const Days = ({ date, startDate, endDate, onClick }) => {
  const thisDate = moment(date);
  const daysInMonth = moment(date).daysInMonth();
  const firstDayDate = moment(date).startOf('month');
  const previousMonth = moment(date).subtract(1, 'month');
  const previousMonthDays = previousMonth.daysInMonth();
  const nextsMonth = moment(date).add(1, 'month');
  let days = [];
  let labels = [];

  for (let i = 1; i <= 7; i++) {
    labels.push( /*#__PURE__*/React.createElement("span", {key: uuid_v4(), className: "label" }, moment().day(i).format('ddd')));
  }

  for (let i = firstDayDate.day(); i > 1; i--) {
    previousMonth.date(previousMonthDays - i + 2);

    days.push( /*#__PURE__*/
    React.createElement(Day, { key: moment(previousMonth).format('DD MM YYYY'), onClick: date => onClick(date), currendate: date, date: moment(previousMonth), startDate: startDate, endDate: endDate }));

  }

  for (let i = 1; i <= daysInMonth; i++) {
    thisDate.date(i);

    days.push( /*#__PURE__*/
    React.createElement(Day, { key: moment(thisDate).format('DD MM YYYY'), onClick: date => onClick(date), currendate: date, date: moment(thisDate), startDate: startDate, endDate: endDate }));

  }

  const daysCount = days.length;
  for (let i = 1; i <= 42 - daysCount; i++) {
    nextsMonth.date(i);
    days.push( /*#__PURE__*/
    React.createElement(Day, { key: moment(nextsMonth).format('DD MM YYYY'), onClick: date => onClick(date), currendate: date, date: moment(nextsMonth), startDate: startDate, endDate: endDate }));

  }

  return /*#__PURE__*/(
    React.createElement("nav", { className: "calendar--days" },
    labels.concat(),
    days.concat()));


};


class Calendar extends React.Component {
  static contextType = ShareContext
  constructor(props) {
    super(props);

    this.state = {
      date: moment(),
      startDate:moment().add(1, 'day'),
      endDate: moment().add(5, 'day'),
      date_range: [moment().format("DD/MM/YY"), moment().format("DD/MM/YY")],
      show: false,
    }
    this.showHandler = this.showHandler.bind(this);
    this.closeHandler = this.closeHandler.bind(this);
    
  }
  showHandler () {
    this.setState({show:true});
  }
  closeHandler() {
    this.setState({show:false});
  }

  resetDate() {
    this.setState({
      date: moment() });

  }

  changeMonth(month) {
    const { date } = this.state;
    
    
    date.month(month);

    this.setState(
    date);

  }
  changeYear(year) {
    const { date } = this.state;

    date.year(year);

    this.setState(
    date);

  }

  changeDate(date) {
    
    let { startDate, endDate, date_range, isValid, show } = this.state;

    if (startDate === null || date.isBefore(startDate, 'day') || !startDate.isSame(endDate, 'day')) {
      startDate = moment(date);
      endDate = moment(date);
    } else if (date.isSame(startDate, 'day') && date.isSame(endDate, 'day')) {
      startDate = null;
      endDate = null;
    } else if (date.isAfter(startDate, 'day')) {
      endDate = moment(date);
      date_range = [moment(startDate).format("DD/MM/YY"), moment(endDate).format("DD/MM/YY") ];
      isValid = true;
      show = false;
    }

    this.setState({
      startDate,
      endDate,
      date_range,
      show});
   
  }
  
  

  render() {
    const {date_ranges, error} = this.context;
    const { date, startDate, endDate, date_range, show} = this.state;
    this.context.date_ranges = date_range;

    return (
      <OutsideClickHandler
      onOutsideClick={() => {
        this.setState({show:false});

      }}>
        {React.createElement("div", {  className: !show ? "date_range-wrapper" : "date_range-wrapper date_range-focus" , },

        React.createElement("div", {className: "date_range-picker", onClick: this.showHandler},
        React.createElement("p", {  className: "date_range-picker-subtitle"}, "Период аренды"),
        React.createElement("p", {  className: "date_range-picker-dates"}, `${this.context.date_ranges[0]} - ${this.context.date_ranges[1]}` )),
        React.createElement("img", { src:this.props.image, onClick: this.showHandler}),
        
        show && React.createElement( "div", { className:`calendar ${this.props.className}`},
        React.createElement(Heading, { date: date, changeMonth: month => this.changeMonth(month), changeYear: year => this.changeYear(year), resetDate: () => this.resetDate() }),
        React.createElement(Days, { onClick: date => this.changeDate(date), date: date, startDate: startDate, endDate: endDate }))
        
        )}
      </OutsideClickHandler>
    );


  }}

export default Calendar;
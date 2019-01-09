import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { HeartRateSensor } from "heart-rate";
import userActivity from "user-activity";
import { today } from "user-activity";
import { battery } from "power";
import { me as device } from "device";
import { goals } from "user-activity";
import { today } from "user-activity";

// Update the clock every minute
// We could do this in seconds, but there's really no need.
clock.granularity = "minutes";

// Get a handle on the <text> element
const myLabel = document.getElementById("myLabel");
const clockTime = document.getElementById("clockTime");
const steps = document.getElementById("steps");
const hrate = document.getElementById("hrate");
const progress = document.getElementById("progress");
const todayDate = document.getElementById("todayDate");
const todayDay = document.getElementById("todayDay");
const todayMonth = document.getElementById("todayMonth");
const calProgressBar = document.getElementById("calProgressBar");
const activeProgressBar  = document.getElementById("activeProgressBar");
const distProgressBar = document.getElementById("distProgressBar");
const stairsProgressBar = document.getElementById("stairsProgressBar");
const batteryBar = document.getElementById("batteryBar");
const heartIcon = document.getElementById("heartIcon");
const heartIconBorder = document.getElementById("heartIconBorder");
const batteryText = document.getElementById("battery");

// Get heart rate from watch
const hrm = new HeartRateSensor();

hrm.onreading = function() {
  hrate.text = `${hrm.heartRate}`; 
  
  if (hrm.heartRate > 131) {
    heartIconBorder.style.fill = "#FF0000";
    heartIcon.style.fill = "#FF0000";
  }
  else if (hrm.heartRate > 93){
    heartIconBorder.style.fill = "#17E268";
    heartIcon.style.fill = "#17E268";
  }
  else{
    heartIconBorder.style.fill = "#17E268";
    heartIcon.style.fill = "#01270E";
  }
}

hrm.start();
progress.text = 'S    T    A    T    S';

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  let month = 'NAN';
  let day = 'NANSDAY'
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  clockTime.text = `${hours}:${mins}`;
  //clockTime.text = `12:55`;
  
  let stepsValue = (userActivity.today.adjusted["steps"] || 0);
  steps.text = stepsValue;
  //steps.text = '777777';
  
  let todaydayday = today.getDate();
  //let todaydayday = '31';
  let monthIndex = today.getMonth() + 1;
  
  if (monthIndex === 1 && todaydayday === 18){
    progress.text = 'B    -    D    A    Y';
  }
  else if (monthIndex === 2 && todaydayday === 14){
    progress.text = 'L    O    V    E    U';
  }
  else if (monthIndex === 2 && todaydayday === 22){
    progress.text = 'S    Q    U    I    D';
  }
  else if (monthIndex === 10 && todaydayday === 24){
    progress.text = 'A    D    O    R    E';
  }
  else if (monthIndex === 12 && todaydayday === 3){
    progress.text = 'H    B    B    E    N';
  }
  else if (monthIndex === 12 && todaydayday === 25){
    progress.text = 'X    -    M    A    S';
  }
  else {
    progress.text = 'S    T    A    T    S';
  }
  
  switch (today.getDay()) {
    case 0:
      day = "SUNDAY";
      break;
    case 1:
      day = "MONDAY";
      break;
    case 2:
      day = "TUESDAY";
      break;
    case 3:
      day = "WEDNESDAY";
      break;
    case 4:
      day = "THURSDAY";
      break;
    case 5:
      day = "FRIDAY";
      break;
    case 6:
      day = "SATURDAY";
      break;
  }
  
  switch (today.getMonth()) {
    case 0:
      month = "JAN";
      break;
    case 1:
      month = "FEB";
      break;
    case 2:
      month = "MAR";
      break;
    case 3:
      month = "APR";
      break;
    case 4:
      month = "MAY";
      break;
    case 5:
      month = "JUN";
      break;
    case 6:
      month = "JUL";
      break;
    case 7:
      month = "AUG";
      break;
    case 8:
      month = "SEP";
      break;
    case 9:
      month = "OCT";
      break;
    case 10:
      month = "NOV";
      break;
    case 11:
      month = "DEC";
      break;
  }
  
  todayDay.text = `${day}`;
  todayMonth.text = `${month}`;
  todayDate.text = `${todaydayday}`;
  
  let calsValue = userActivity.today.adjusted["calories"];
  let amValue = userActivity.today.adjusted["activeMinutes"];
  let distValue = userActivity.today.adjusted["distance"];
  let elevValue = userActivity.today.adjusted["elevationGain"];
  let batteryValue = battery.chargeLevel; 
  
  const calGoalPercent  = Math.min(100, Math.round(calsValue / goals.calories * 100));
  calProgressBar.width = Math.round(215 * calGoalPercent / 100);
  
  const amGoalPercent  = Math.min(100, Math.round(amValue / goals.activeMinutes * 100));
  activeProgressBar.width = Math.round(215 * amGoalPercent / 100);
  
  const distGoalPercent  = Math.min(100, Math.round(distValue / goals.distance * 100));
  distProgressBar.width = Math.round(215 * distGoalPercent / 100);
  
  const elevGoalPercent  = Math.min(100, Math.round(elevValue / goals.elevationGain * 100));
  stairsProgressBar.width = Math.round(215 * elevGoalPercent / 100);
  
  batteryBar.width = batteryValue;
  //batteryBar.width = 65;
  
  if (batteryBar.width < 51){
    batteryBar.style.fill = "#FFFF00";  // Yellow if below (or at) 50%
  }
  if (batteryBar.width < 26){
    batteryBar.style.fill = "#FF0000";  // Red if below (or at) 25%
  }
  
  batteryText.text = `${batteryBar.width}/100`;
}

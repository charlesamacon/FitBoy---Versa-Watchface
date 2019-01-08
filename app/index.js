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

// Get heart rate from watch
const hrm = new HeartRateSensor();

hrm.onreading = function() {
  hrate.text = `${hrm.heartRate}`; 
  //hrate.text = '666';
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
  calProgressBar.width = Math.round(100 * calGoalPercent / 100);
  
  const amGoalPercent  = Math.min(100, Math.round(amValue / goals.activeMinutes * 100));
  activeProgressBar.width = Math.round(100 * amGoalPercent / 100);
  
  const distGoalPercent  = Math.min(100, Math.round(distValue / goals.distance * 100));
  distProgressBar.width = Math.round(100 * distGoalPercent / 100);
  
  const elevGoalPercent  = Math.min(100, Math.round(elevValue / goals.elevationGain * 100));
  stairsProgressBar.width = Math.round(100 * elevGoalPercent / 100);
  
  //const batteryPercent  = Math.min(100, Math.round(batteryValue / goals.elevationGain * 100));
  console.log(batteryValue);
  batteryBar.width = batteryValue;
}

/* eslint-disable no-bitwise, radix, no-param-reassign */
/**
 * https://github.com/facebook/react-native/blob/master/Libraries/Utilities/MatrixMath.js
 * */
import MatrixMath from 'react-native/Libraries/Utilities/MatrixMath';

const { createIdentityMatrix } = MatrixMath;
const { multiplyInto } = MatrixMath;
/**
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/PI
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cos
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sin
 *  https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotateX
 * */
function rotateXMatrix(matrix, deg) {
  const rad = (Math.PI / 180) * deg;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const rotate = [
    1, 0, 0, 0,
    0, cos, -sin, 0,
    0, sin, cos, 0,
    0, 0, 0, 1,
  ];
  multiplyInto(matrix, matrix, rotate);
}

/**
 *  https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/perspective
 * */
function perspectiveMatrix(matrix, value) {
  const perspective = createIdentityMatrix();
  MatrixMath.reusePerspectiveCommand(perspective, value);
  multiplyInto(matrix, matrix, perspective);
}

/**
 *  https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate
 * */
function translateMatrix(matrix, origin) {
  const { x, y, z } = origin;
  const translate = createIdentityMatrix();
  MatrixMath.reuseTranslate3dCommand(translate, x, y, z);
  multiplyInto(matrix, translate, matrix);
}

function untranslateMatrix(matrix, origin) {
  const { x, y, z } = origin;
  const unTranslate = createIdentityMatrix();
  MatrixMath.reuseTranslate3dCommand(unTranslate, -x, -y, -z);
  multiplyInto(matrix, matrix, unTranslate);
}

function formatTime(months, days) {
  if (months < 10) { months = `0${months}`; }
  if (days < 10) { days = `0${days}`; }
  return { months, days };
}

function dateDiff(startingDate, endingDate) {
  var startDate = new Date(new Date(startingDate).toISOString().substr(0, 10));
  if (!endingDate) {
    endingDate = new Date().toISOString().substr(0, 10);    // need date in YYYY-MM-DD format
  }
  var endDate = new Date(endingDate);
  if (startDate > endDate) {
    var swap = startDate;
    startDate = endDate;
    endDate = swap;
  }
  var startYear = startDate.getFullYear();
  var february = (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0 ? 29 : 28;
  var daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  var yearDiff = endDate.getFullYear() - startYear;
  var monthDiff = endDate.getMonth() - startDate.getMonth();
  if (monthDiff < 0) {
    yearDiff--;
    monthDiff += 12;
  }
  var dayDiff = endDate.getDate() - startDate.getDate();
  if (dayDiff < 0) {
    if (monthDiff > 0) {
      monthDiff--;
    } else {
      yearDiff--;
      monthDiff = 11;
    }
    dayDiff += daysInMonth[startDate.getMonth()];
  }

  return formatTime((yearDiff * 12)+monthDiff, dayDiff);
}

function addTime(hours, minutes, seconds) {
  hours = parseInt(hours);
  minutes = parseInt(minutes);
  seconds = parseInt(seconds);

  seconds += 1;
  if (seconds >= 60) {
    const m = (seconds / 60) << 0;
    minutes += m;
    seconds -= 60 * m;
  }

  if (minutes >= 60) {
    const h = (minutes / 60) << 0;
    hours += h;
    minutes -= 60 * h;
  }
  return formatTime(hours, minutes, seconds);
}

function dateAnimate(months, monthsAll, days, daysAll) {
  if (months > monthsAll) {
    months -= 1;
  }

  if (days > daysAll) {
    days -= 1;
  }

  return formatTime(months, days);
}


export default {
  createIdentityMatrix,
  multiplyInto,
  rotateXMatrix,
  perspectiveMatrix,
  translateMatrix,
  untranslateMatrix,
  dateDiff,
  dateAnimate,
  addTime,
};

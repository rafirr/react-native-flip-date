import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import FlipNumber from './flip-number';
import Separator from './flip-number/separator';

import TransformUtils from '../utils';

import style from './style';

class Timer extends React.Component {
  state = {
    months: undefined,
    monthsEnd: undefined,
    days: undefined,
    daysEnd: undefined,
  }

  componentDidMount() {
    const { date, play, lastDate } = this.props;
    const { months, days } = TransformUtils.dateDiff(date);
    const lastDateDiff = lastDate ? TransformUtils.dateDiff(date, lastDate) : undefined;

      this.setState({
        months: lastDateDiff ? lastDateDiff.months : parseInt(months) +1,
        days: lastDateDiff ? lastDateDiff.days : parseInt(days) + 1,
        monthsEnd: months,
        daysEnd: days
      }, () => {
        if (play) {
          setTimeout(() => {
          this.timer = setInterval(
            () => this.updateTime(),
            500,
          );
          }, 300);
        }
      });

  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  updateTime = () => {
    const { months, monthsEnd, days, daysEnd } = this.state;
    const newState = TransformUtils.dateAnimate(months, monthsEnd, days, daysEnd);
    this.setState(prevState => ({ ...prevState, ...newState }));

    if (parseInt(newState.months) === parseInt(monthsEnd) && parseInt(newState.days) === parseInt(daysEnd)) {
      clearInterval(this.timer);
    }
  }

  render() {
    const { wrapperStyle, flipNumberProps, mLabel, dLabel, size } = this.props;
    const { months, days } = this.state;
    return (
      <>
        <View style={[style.wrapper, wrapperStyle]}>
          {!!months && <FlipNumber number={months} unit="months" {...flipNumberProps} />}
          {!!days && <FlipNumber number={days} unit="days" {...flipNumberProps} />}
        </View>
        <View style={[style.wrapper, wrapperStyle]}>
          <View style={[style.wrapper, style.flip, { width: 74}]}>{mLabel}</View>
          <View style={[style.wrapper, style.flip, { width: 74}]}>{dLabel}</View>

        </View>
      </>
    );
  }
}

Timer.defaultProps = {
  play: true,
  wrapperStyle: {},
};

Timer.propTypes = {
  time: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  play: PropTypes.bool,
  wrapperStyle: PropTypes.object,
  flipNumberProps: PropTypes.shape({
    size: PropTypes.number,
    perspective: PropTypes.number,
    numberWrapperStyle: PropTypes.object,
    cardStyle: PropTypes.object,
    flipCardStyle: PropTypes.object,
    numberStyle: PropTypes.object,
  }),
};

export default Timer;

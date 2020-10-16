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
    const { date, play } = this.props;
    const { months, days } = TransformUtils.dateDiff('2021-12-12');
      this.setState({
        months:months +1,
        days: days + 1,
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

    if (newState.months === monthsEnd && newState.days === daysEnd) {
      clearInterval(this.timer);
    }
  }

  render() {
    const { wrapperStyle, flipNumberProps } = this.props;
    const { months, days } = this.state;
    return (
      <View style={[style.wrapper, wrapperStyle]}>
        {!!months && <FlipNumber number={months} unit="months" {...flipNumberProps} />}
        {!!days && <FlipNumber number={days} unit="days" {...flipNumberProps} />}
      </View>
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

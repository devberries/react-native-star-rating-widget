"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _StarIcon = _interopRequireDefault(require("./StarIcon"));
var _utils = require("./utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const defaultColor = '#fdd835';
const defaultAnimationConfig = {
  easing: _reactNative.Easing.elastic(2),
  duration: 300,
  scale: 1.2,
  delay: 300
};
const StarRating = _ref => {
  let {
    rating,
    maxStars = 5,
    starSize = 32,
    onChange,
    color = defaultColor,
    emptyColor = color,
    step = 'half',
    enableSwiping = true,
    onRatingStart,
    onRatingEnd,
    animationConfig = defaultAnimationConfig,
    style,
    starStyle,
    StarIconComponent = _StarIcon.default,
    testID,
    accessibilityLabel = 'star rating. %value% stars. use custom actions to set rating.',
    accessabilityIncrementLabel = 'increment',
    accessabilityDecrementLabel = 'decrement',
    accessabilityActivateLabel = 'activate (default)',
    accessibilityAdjustmentLabel = '%value% stars'
  } = _ref;
  const multiplier = step === 'quarter' ? 4 : step === 'half' ? 2 : 1;
  const containerRef = _react.default.useRef(null);
  const width = _react.default.useRef(0);
  const containerX = _react.default.useRef(0);
  const lastResolvedRating = _react.default.useRef(rating);
  const [isInteracting, setInteracting] = _react.default.useState(false);
  const [stagedRating, setStagedRating] = _react.default.useState(rating);
  _react.default.useEffect(() => {
    lastResolvedRating.current = rating;
  }, [rating]);
  const updateContainerMetrics = _react.default.useCallback(() => {
    var _containerRef$current;
    (_containerRef$current = containerRef.current) === null || _containerRef$current === void 0 ? void 0 : _containerRef$current.measureInWindow((x, _y, measuredWidth) => {
      containerX.current = x;
      width.current = measuredWidth;
    });
  }, []);
  const panResponder = _react.default.useMemo(() => {
    const calculateRating = function (pageX) {
      let isRTL = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _reactNative.I18nManager.isRTL;
      if (!width.current) {
        return rating;
      }
      const relativeX = Math.max(0, Math.min(pageX - containerX.current, width.current));
      if (isRTL) {
        return calculateRating(containerX.current + width.current - relativeX, false);
      }
      const newRating = step !== 'full' ? Math.max(0, Math.min(Math.round(relativeX / width.current * maxStars * multiplier + 0.2) / multiplier, maxStars)) : Math.ceil(relativeX / width.current * maxStars);
      return newRating;
    };
    const handleChange = newRating => {
      lastResolvedRating.current = newRating;
      if (newRating !== rating) {
        onChange(newRating);
      }
    };
    return _reactNative.PanResponder.create({
      // Capture from touch start so parent scroll views cannot steal this gesture.
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: e => {
        updateContainerMetrics();
        const newRating = calculateRating(e.nativeEvent.pageX);
        onRatingStart === null || onRatingStart === void 0 ? void 0 : onRatingStart(newRating);
        handleChange(newRating);
        setInteracting(true);
      },
      onPanResponderMove: (_, gestureState) => {
        if (enableSwiping) {
          const newRating = calculateRating(gestureState.moveX);
          handleChange(newRating);
        }
      },
      onPanResponderRelease: e => {
        const newRating = calculateRating(e.nativeEvent.pageX);
        if (enableSwiping) {
          handleChange(newRating);
        }
        onRatingEnd === null || onRatingEnd === void 0 ? void 0 : onRatingEnd(enableSwiping ? newRating : lastResolvedRating.current);
        setTimeout(() => {
          setInteracting(false);
        }, animationConfig.delay || defaultAnimationConfig.delay);
      },
      onPanResponderTerminate: () => {
        // Keep interaction state deterministic even if the system cancels.
        setTimeout(() => {
          setInteracting(false);
        }, animationConfig.delay || defaultAnimationConfig.delay);
      },
      // Keep the responder locked until release (Google Maps style drag).
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true
    });
  }, [updateContainerMetrics, rating, maxStars, onChange, enableSwiping, onRatingStart, onRatingEnd, animationConfig.delay, step, multiplier]);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: style
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, _extends({
    ref: containerRef,
    style: styles.starRating
  }, panResponder.panHandlers, {
    onLayout: e => {
      width.current = e.nativeEvent.layout.width;
      updateContainerMetrics();
    },
    testID: testID,
    accessible: true,
    accessibilityRole: "adjustable",
    accessibilityLabel: accessibilityLabel.replace(/%value%/g, stagedRating.toString()),
    accessibilityValue: {
      min: 0,
      max: maxStars * multiplier,
      now: Math.round(rating * multiplier)
    },
    accessibilityActions: [{
      name: 'increment',
      label: accessabilityIncrementLabel
    }, {
      name: 'decrement',
      label: accessabilityDecrementLabel
    }, {
      name: 'activate',
      label: accessabilityActivateLabel
    }],
    onAccessibilityAction: event => {
      const incrementor = step === 'half' ? 0.5 : step === 'quarter' ? 0.25 : 1;
      switch (event.nativeEvent.actionName) {
        case 'increment':
          if (stagedRating >= maxStars) {
            _reactNative.AccessibilityInfo.announceForAccessibility(accessibilityAdjustmentLabel.replace(/%value%/g, `${maxStars}`));
          } else {
            _reactNative.AccessibilityInfo.announceForAccessibility(accessibilityAdjustmentLabel.replace(/%value%/g, `${stagedRating + incrementor}`));
            setStagedRating(stagedRating + incrementor);
          }
          break;
        case 'decrement':
          if (stagedRating <= 0) {
            _reactNative.AccessibilityInfo.announceForAccessibility(accessibilityAdjustmentLabel.replace(/%value%/g, `${0}`));
          } else {
            _reactNative.AccessibilityInfo.announceForAccessibility(accessibilityAdjustmentLabel.replace(/%value%/g, `${stagedRating - incrementor}`));
            setStagedRating(stagedRating - incrementor);
          }
          break;
        case 'activate':
          onChange(stagedRating);
          break;
      }
    }
  }), (0, _utils.getStars)(rating, maxStars, step).map((starType, i) => {
    return /*#__PURE__*/_react.default.createElement(AnimatedIcon, {
      key: i,
      active: isInteracting && rating - i >= 0.5,
      animationConfig: animationConfig,
      style: starStyle
    }, /*#__PURE__*/_react.default.createElement(StarIconComponent, {
      index: i,
      type: starType,
      size: starSize,
      color: starType === 'empty' ? emptyColor : color
    }));
  })));
};
const AnimatedIcon = _ref2 => {
  let {
    active,
    animationConfig,
    children,
    style
  } = _ref2;
  const {
    scale = defaultAnimationConfig.scale,
    easing = defaultAnimationConfig.easing,
    duration = defaultAnimationConfig.duration
  } = animationConfig;
  const animatedSize = _react.default.useRef(new _reactNative.Animated.Value(active ? scale : 1));
  _react.default.useEffect(() => {
    const animation = _reactNative.Animated.timing(animatedSize.current, {
      toValue: active ? scale : 1,
      useNativeDriver: true,
      easing,
      duration
    });
    animation.start();
    return animation.stop;
  }, [active, scale, easing, duration]);
  return /*#__PURE__*/_react.default.createElement(_reactNative.Animated.View, {
    pointerEvents: "none",
    style: [styles.star, style, {
      transform: [{
        scale: animatedSize.current
      }]
    }]
  }, children);
};
const styles = _reactNative.StyleSheet.create({
  starRating: {
    flexDirection: 'row',
    alignSelf: 'flex-start'
  },
  star: {
    marginHorizontal: 5
  }
});
var _default = StarRating;
exports.default = _default;
//# sourceMappingURL=StarRating.js.map
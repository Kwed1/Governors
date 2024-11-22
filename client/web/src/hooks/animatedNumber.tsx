import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'

interface AnimatedNumberProps {
  value: number;
  duration?: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, duration = 1 }) => {
  const motionValue = useMotionValue(0);
  const animatedValue = useTransform(motionValue, (latest) => Math.round(latest));

  const hasRendered = useRef(false);
  const [initialValueSet, setInitialValueSet] = useState(false);

  useEffect(() => {
    if (!hasRendered.current) {
      
      motionValue.set(value);
      setInitialValueSet(true);
      hasRendered.current = true;
    } else {
      
      const controls = animate(motionValue, value, { duration });
      return controls.stop;
    }
  }, [value, duration, motionValue]);

  return (
    <motion.span>
      {animatedValue}
    </motion.span>
  );
};

export default AnimatedNumber;

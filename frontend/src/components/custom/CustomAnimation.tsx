/**************************************************************************************************
 * This file contains the UI for the custom animation component.                                  *
 * This component is used to animate the children components when they appear on screen.          *
 **************************************************************************************************/

import { ReactNode } from "react";
import { useInView } from "react-intersection-observer";
import { animated, useSpring } from "react-spring";

/** Props for the custom animation component. */
interface CustomAnimationProps {
  child: ReactNode;
  transformAnimation?: string;
}

/** UI for the custom animation component. */
const CustomAnimation = ({ child, transformAnimation }: CustomAnimationProps) => {
  // Set the transform animation to be used.
  const customTransform: string = transformAnimation || "translateY(0%)";

  /* Hook for detecting if the component is in view. */
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  /* Animation for the component when appearing on screen. */
  const fadeInAnimation = useSpring({
    opacity: inView ? 1 : 0,
    from: { opacity: 0 },
    config: { duration: 2000 },
    transform: inView ? "translateY(0%)" : customTransform,
  });

  return (
    <animated.div className="CustomAnimation" ref={ref} style={fadeInAnimation}>
      {child}
    </animated.div>
  );
};

export default CustomAnimation;

"use client";

import { createElement, forwardRef } from "react";

type MotionProps = React.HTMLAttributes<HTMLElement> & {
  animate?: Record<string, string | number>;
  initial?: Record<string, string | number> | boolean;
  transition?: {
    duration?: number;
    type?: string;
    stiffness?: number;
    damping?: number;
  };
};

const styleFromMotion = (props: MotionProps) => {
  const baseStyle = (props.style ?? {}) as React.CSSProperties;
  const initialStyle = (typeof props.initial === "object" ? props.initial : {}) as React.CSSProperties;
  const animateStyle = (props.animate ?? {}) as React.CSSProperties;
  const duration = props.transition?.duration ?? 0.45;

  return {
    ...initialStyle,
    ...baseStyle,
    ...animateStyle,
    transition: baseStyle.transition ?? `all ${duration}s cubic-bezier(0.22, 1, 0.36, 1)`
  } satisfies React.CSSProperties;
};

const createMotionComponent = (tag: "div" | "span" | "p") =>
  forwardRef<HTMLElement, MotionProps>(function MotionComponent({ animate, initial, transition, style, ...rest }, ref) {
    return createElement(tag, {
      ...rest,
      ref,
      style: styleFromMotion({ animate, initial, transition, style })
    });
  });

export const motion = {
  div: createMotionComponent("div"),
  span: createMotionComponent("span"),
  p: createMotionComponent("p")
};

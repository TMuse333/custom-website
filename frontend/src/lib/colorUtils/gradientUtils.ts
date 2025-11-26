import { GradientConfig } from "@/types";
import { animate, useMotionValue, useMotionTemplate } from "framer-motion";
import { useEffect } from "react";
import { darkenHexColor, getLuminance, lightenHexColor } from "./colorMath";
import { DerivedColorPalette } from "./colorPalette";

// export function generateBackgroundStyles(
//     config: GradientConfig,
//     baseBgColor: string,
//     gradientColors: string[]
//   ): string {
//     if (config.type === "solid") {
//       return baseBgColor;
//     }
  
//     //  Build gradient stops dynamically if provided
//     const stops = config.colorStops || []; // e.g. [0, 40, 100]
//     const gradientStops = gradientColors
//       .map((color, i, arr) => {
//         // if user provided stops, use them; otherwise spread evenly
//         const stop:number =
//           stops[i] !== undefined
//             ? stops[i]
//             : Math.round((i / (arr.length - 1)) * 100);
//         return `${color} ${stop}%`;
//       })
//       .join(", ");
  
//     // 🎯 Radial gradients
//     if (config.type === "radial") {
//       const size = config.radialSize || "125% 125%";
//       const position = config.radialPosition || "50% 0%";
//       const baseStop = config.radialBaseStop || 50;
//       return `radial-gradient(${size} at ${position}, ${baseBgColor} ${baseStop}%, ${gradientStops})`;
//     }
  
//     // 🎯 Linear gradients
//     if (config.type === "linear") {
//       const direction = config.direction || "to bottom";
//       return `linear-gradient(${direction}, ${gradientStops})`;
//     }
  
//     return baseBgColor;
//   }


  export function useAnimatedGradient(
    config: GradientConfig,
    colors: DerivedColorPalette
  ) {
    const color = useMotionValue(colors.gradientBg?.[0] || "#ffffff");

    const shouldBrighten = getLuminance(colors.baseBgColor) < 0.5

    const secondColor = shouldBrighten ? 
    lightenHexColor(colors.baseBgColor,50)
    : darkenHexColor(colors.baseBgColor,50)
  
    // Always compute motion templates
    const radialBg = useMotionTemplate`radial-gradient(
      ${config.radialSize || "125% 125%"} at ${config.radialPosition || "50% 0%"},
      ${colors.baseBgColor} ${config.radialBaseStop || 50}%,
      ${color}
    )`;
  
    const linearBg = useMotionTemplate`linear-gradient(
      ${config.direction || "to bottom"},
      ${colors.baseBgColor},
      ${secondColor}
    )`;
  
    const solidBg = useMotionTemplate`${colors.gradientBg[0] || colors.baseBgColor}`;
  
    useEffect(() => {
      const targetColor = colors.gradientBg?.[0] || "#ffffff";
  
      if (config.type === "radial" || config.type === "solid") {
        // Only first color, no looping
        animate(color, targetColor, { ease: "linear", duration: 0 });
      } else if (config.type === "linear" && colors.gradientBg.length > 1) {
        // Animate across multiple stops
        animate(color, targetColor, {
          ease: "easeInOut",
          duration: 2,
          repeat: Infinity,
          repeatType: "mirror",
        });
      }
    }, [
      config.type,
      config.direction,
      config.radialPosition,
      config.radialSize,
      colors.gradientBg,
      color,
    ]);
  
    // Return based on type
    if (config.type === "radial") return radialBg;
    if (config.type === "linear") return linearBg;
    return solidBg;
  }
  
  
  
  
  
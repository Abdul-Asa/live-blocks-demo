export const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * COLORS.length);
  return COLORS[randomIndex];
};

export const getNewRandomColor = (existingColors: [string, string][]) => {
  if (existingColors.length >= COLORS.length) {
    // All colors are taken, return a random pair
    return getRandomColor();
  }

  let newColors: [string, string];
  do {
    newColors = getRandomColor();
  } while (
    existingColors.some(
      (pair) => pair[0] === newColors[0] && pair[1] === newColors[1]
    )
  );

  return newColors;
};

export const containsColor = (
  colors: [string, string][],
  color: [string, string]
) => {
  return colors.some((pair) => pair[0] === color[0] && pair[1] === color[1]);
};

const COLORS: [string, string][] = [
  ["#FF0099", "#FF7A00"],
  ["#002A95", "#00A0D2"],
  ["#6116FF", "#E32DD1"],
  ["#0EC4D1", "#1BCC00"],
  ["#FF00C3", "#FF3333"],
  ["#00C04D", "#00FFF0"],
  ["#5A2BBE", "#C967EC"],
  ["#46BE2B", "#67EC86"],
  ["#F49300", "#FFE600"],
  ["#F42900", "#FF9000"],
  ["#00FF94", "#0094FF"],
  ["#00FF40", "#1500FF"],
  ["#00FFEA", "#BF00FF"],
  ["#FFD600", "#BF00FF"],
  ["#484559", "#282734"],
  ["#881B9A", "#1D051E"],
  ["#FF00F5", "#00FFD1"],
  ["#9A501B", "#1E0505"],
  ["#FF008A", "#FAFF00"],
  ["#22BC09", "#002B1B"],
  ["#FF0000", "#000000"],
  ["#00FFB2", "#000000"],
  ["#0066FF", "#000000"],
  ["#FA00FF", "#000000"],
  ["#00A3FF", "#000000"],
  ["#00FF94", "#000000"],
  ["#AD00FF", "#000000"],
  ["#F07777", "#4E0073"],
  ["#AC77F0", "#003C73"],
];

export function getContrastingColor(col: string) {
  if (typeof window === "undefined") {
    return;
  }
  const useBlack = getColor(hexToRgb(standardizeColor(col)));
  return useBlack ? "#000000" : "#ffffff";
}

type RGB = {
  r: number;
  g: number;
  b: number;
} | null;

function getColor(rgb: RGB) {
  if (!rgb) {
    return;
  }

  const { r, g, b } = rgb;
  if (r && g && b) {
    const isLight = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return isLight < 0.5;
  }
  return false;
}

function standardizeColor(str: string): string {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) {
    return "";
  }

  ctx.fillStyle = str;
  return ctx.fillStyle;
}

function hexToRgb(hex: string): RGB {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

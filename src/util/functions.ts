import { Face } from "../types/types";

export const getRandomDieValue = () =>
  (Math.floor(Math.random() * 6) + 1) as Face;

export const parseSizeToPixels = (
  size: string | number,
  referenceEl?: HTMLElement,
): number => {
  if (typeof size === "number") return size;

  const temp = document.createElement("div");

  temp.style.position = "absolute";
  temp.style.visibility = "hidden";
  temp.style.width = `${size}${/^d+$/.test(size) ? `` : `px`}`;

  (referenceEl || document.body).appendChild(temp);

  const pixels = temp.getBoundingClientRect().width;

  temp.remove();

  return pixels;
};

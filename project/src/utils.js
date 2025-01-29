const colors = ["blue", "red", "yellow", "purple", "green"];

export default function getColor() {
  let randomID = Math.floor(Math.random() * colors.length);
  return `var(--${colors[randomID]})`;
}


function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  let bigint = parseInt(hex, 16);
  return [ (bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255 ];
}

function rgbToHex(r, g, b) {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
}

function adjustColor(color, percent) {
  let [r, g, b] = hexToRgb(color);
  r = Math.round(r * (1 + percent / 100));
  g = Math.round(g * (1 + percent / 100));
  b = Math.round(b * (1 + percent / 100));
  
  return rgbToHex(
      Math.min(255, Math.max(0, r)),
      Math.min(255, Math.max(0, g)),
      Math.min(255, Math.max(0, b))
  );
}

function generateColors() {
  let baseColor = document.getElementById("colorInput").value;
  let lightSource = document.getElementById("lightSource").value;

  if (!baseColor) baseColor = "#000000";
  if (!lightSource) lightSource = "front";

  baseColor = baseColor.startsWith('#') ? baseColor : '#' + baseColor;

  let lightShade = adjustColor(baseColor, -10);
  let darkShade = adjustColor(baseColor, -30);

  let colors = {
      front: baseColor,
      top: lightShade,
      side: darkShade
  };

  if (lightSource === "front") {
      applyColors(colors.front, colors.top, colors.side);
  } else if (lightSource === "side") {
      applyColors(colors.side, colors.top, colors.front);
  } else if (lightSource === "top") {
      applyColors(colors.top, colors.front, colors.side);
  }
}

function applyColors(front, top, side) {
  document.getElementById("front").style.background = front;
  document.getElementById("side").style.background = side;
  document.getElementById("top").style.background = top;

  document.getElementById("hex-front").textContent = front;
  document.getElementById("hex-side").textContent = side;
  document.getElementById("hex-top").textContent = top;
}

function copyColor(face) {
  let color = document.getElementById(`hex-${face}`).textContent;
  navigator.clipboard.writeText(color).then(() => {
      let copiedText = document.querySelector(`#${face} .copied`);
      copiedText.style.display = "block";
      setTimeout(() => copiedText.style.display = "none", 1000);
  });
}
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
  let lightSource = document.getElementById("lightSource").value || "left";

  baseColor = baseColor.replace(/^#/, "").toUpperCase();
  let percent = 0;

  const handleColorLength = {
    0: () => "FFFAFA",
    1: color => color.repeat(6),
    2: color => color.repeat(3),
    3: color => color.split('').map(c => c.repeat(2)).join(''),
    4: color => {
      percent = parseInt(color[3]) * 10;
      return adjustColor(color.slice(0,3).split('').map(c => c.repeat(2)).join(''), percent);
    },
    5: color => {
      percent = parseInt(color[3]) * 10 + parseInt(color[4]);
      return adjustColor(color.slice(0,3).split('').map(c => c.repeat(2)).join(''), percent);
    },
    6: color => color
  };

  if (baseColor.length === 4 || baseColor.length === 5) {
    baseColor = (handleColorLength[baseColor.length] || (x => x))(baseColor);
  } else {
    baseColor = '#' + (handleColorLength[baseColor.length] || (x => x))(baseColor);
  }

  const shades = {
    base: baseColor,
    light: adjustColor(baseColor, -10),
    dark: adjustColor(baseColor, -30)
  };

  const lightSourceMap = {
    left: [shades.base, shades.light, shades.dark],
    top: [shades.light, shades.base, shades.dark],
    right: [shades.dark, shades.light, shades.base],
  };

  applyColors(...lightSourceMap[lightSource]);
}

function applyColors(left, top, right) {
  document.getElementById("left").style.background = left;
  document.getElementById("top").style.background = top;
  document.getElementById("right").style.background = right;

  document.getElementById("hex-left").textContent = left;
  document.getElementById("hex-top").textContent = top;
  document.getElementById("hex-right").textContent = right;

  document.getElementById("cube-left").setAttribute("fill", left);
  document.getElementById("cube-body").setAttribute("fill", top);
  document.getElementById("cube-right").setAttribute("fill", right);
}

function copyColor(face) {
  let color = document.getElementById(`hex-${face}`).textContent;
  navigator.clipboard.writeText(color).then(() => {
    let copiedText = document.querySelector(`#${face} .copied`);
    copiedText.style.display = "block";
    setTimeout(() => copiedText.style.display = "none", 1000);
  });
}
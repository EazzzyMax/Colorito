let red;
let green;
let blue;

let hue;
let saturation;
//form
let hueDifference = 180;
let brightness = 100;
const stepForm = document.getElementById('step');
const brightnessForm = document.getElementById('brightness');
const sectorForm = document.getElementById('colorSector');
const brightnessControl = document.querySelector('.brightness-control');
let brightnessControlTrigger = false;

stepForm.addEventListener('change', changeStep);
sectorForm.addEventListener('change', changeColorWheelSector);
brightnessForm.addEventListener('change', changeBrightness);

const btnsChangeValue = document.querySelectorAll('.form__btn');
btnsChangeValue.forEach(function (item) {
  item.addEventListener('click', changeValueOnClick);
});

function changeValueOnClick(e) {
  e.preventDefault();

  input = e.currentTarget.parentElement.parentElement.children[0];

  const increaseIfTrue = e.currentTarget.classList.contains('increase');
  let newValue = input.value;
  if (increaseIfTrue) {
    newValue = parseInt(newValue) + parseInt(input.step);
  } else {
    newValue = parseInt(newValue) - parseInt(input.step);
  }
  input.value = newValue;

  if (input.id == 'step') {
    changeStep();
  } else if (input.id == 'colorSector') {
    changeColorWheelSector();
  } else if (input.id == 'brightness') {
    changeBrightness();
  }
}

//change step / brightness
function changeStep() {
  if (stepForm.value > 360 / counter) {
    hueDifference = 360 / counter;
    stepForm.value = hueDifference;
  } else if (stepForm.value < 0) {
    stepForm.value = 0;
  }
  hueDifference = stepForm.value;
  sectorForm.value = counter * hueDifference;
  changeExtraColors();
}

function changeColorWheelSector() {
  sectorForm.value = sectorForm.value > 360 ? 360 : sectorForm.value < 0 ? 0 : sectorForm.value;
  hueDifference = sectorForm.value / counter;
  stepForm.value = hueDifference;

  changeExtraColors();
}

function changeBrightness() {
  brightnessForm.value = brightnessForm.value > 100 ? 100 : brightnessForm.value < 0 ? 0 : brightnessForm.value;
  brightness = brightnessForm.value;
  brightnessControl.style.backgroundColor = `#000`;
  brightnessControl.style.opacity = 1 - brightness / 100;
  changeMainColor();
  changeExtraColors();
}

//square
let square = document.querySelector('.square');
let squareLeft = square.offsetLeft;
let squareTop = square.offsetTop;
let squareWidth = square.offsetWidth - 1;
let squareHeight = square.offsetHeight - 1;

//pointer
let pointer = document.querySelector('.pointer-container');
let pointerSize = pointer.offsetHeight;
let pointerX;
let pointerY;

let counter = 2;

//if page resized
window.addEventListener('resize', function () {
  squareLeft = square.offsetLeft;
  squareTop = square.offsetTop;
  pointerSize = pointer.offsetHeight;
  squareWidth = square.offsetWidth - 1;
  squareHeight = square.offsetHeight - 1;
});

//events. start stop dragging!!!!!!!!!!!!!!!!!!!!!!!!!!
square.addEventListener('mousedown', function (e) {
  let hoverButton = document.querySelector('.copy-btn:hover');
  if (!hoverButton) {
    draging(e);
    startDrag();
  }
});
window.addEventListener('mouseup', function () {
  stopDrag();
});

//functions. start stop dragging
function startDrag() {
  window.addEventListener('mousemove', draging);
  document.querySelector('body').classList.add('drag');
  brightnessControl.style.backgroundColor = `#000`;
  brightnessControl.style.opacity = 1 - brightness / 100;
}
function stopDrag() {
  if (document.querySelector('body').classList.contains('drag')) {
    window.removeEventListener('mousemove', draging);
    document.querySelector('body').classList.remove('drag');
    if (!brightnessControlTrigger && hideColorsCheckbox.checked) {
      brightnessControl.style.backgroundColor = `#444`;
      brightnessControl.style.opacity = 1;
    }
  }
}

//square bright control mouseenter / mouseover
const brightnessContainer = document.querySelector('.brightness');
const hideColorsCheckbox = document.getElementById('hideColors');

hideColorsCheckbox.addEventListener('change', function () {
  if (hideColorsCheckbox.checked) {
    hideColors();
    [brightnessControl, brightnessContainer].forEach((item) => {
      item.addEventListener('mouseenter', showColors);
    });
    [brightnessControl, brightnessContainer].forEach((item) => {
      item.addEventListener('mouseleave', hideColors);
    });
  } else {
    showColors();
    [brightnessControl, brightnessContainer].forEach((item) => {
      item.removeEventListener('mouseenter', showColors);
    });
    [brightnessControl, brightnessContainer].forEach((item) => {
      item.removeEventListener('mouseleave', hideColors);
    });
  }
});

function showColors() {
  brightnessControlTrigger = true;
  brightnessControl.style.backgroundColor = `#000`;
  brightnessControl.style.opacity = 1 - brightness / 100;
}

function hideColors() {
  brightnessControlTrigger = false;
  if (!document.querySelector('body').classList.contains('drag')) {
    brightnessControl.style.backgroundColor = `#444`;
    brightnessControl.style.opacity = 1;
  }
}

//drag
function draging(e) {
  movePointer(e);
  changeMainColor();
  changeExtraColors();
}

function movePointer(e) {
  pointerX =
    e.clientX < squareLeft ? squareLeft : e.clientX > squareLeft + squareWidth ? squareLeft + squareWidth : e.clientX;
  pointerY =
    e.clientY < squareTop ? squareTop : e.clientY > squareTop + squareHeight ? squareTop + squareHeight : e.clientY;

  pointer.style.left = `${pointerX - pointerSize / 2}px`;
  pointer.style.top = `${pointerY - pointerSize / 2}px`;
}

//change colors !!!!!!!!!
let hueRange = 360;
function changeRangeSize() {
  hueRange = 360 / counter;
  square.style['background-size'] = `${counter * 100}% 100%`;
}

function changeMainColor() {
  hue = ((pointerX - squareLeft) / squareWidth) * hueRange;
  saturation = ((pointerY - squareTop) / squareHeight) * 50 + 50;

  let rgb = RGBfromHSV(hue, saturation, brightness);
  red = rgb[0];
  green = rgb[1];
  blue = rgb[2];
  document.querySelector('.txt-color').innerHTML = `HSB(${Math.floor(hue)},${Math.floor(saturation)}%,${Math.floor(
    brightness
  )}%)`;
  document.querySelector('.pointer').style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  // document.querySelector('.pointer').style.backgroundColor = `hsl(${hue},${saturation}%,${brightness}%`;
}

function changeExtraColors() {
  const allItems = document.querySelectorAll('.items');
  allItems.forEach(function (items) {
    if (!items.classList.contains('hide-items')) {
      let itemList = items.querySelectorAll('.item');
      let extraMiddleHue = (items.id - 1) * hueDifference + hue;
      let extraHue = extraMiddleHue - 10 * (itemList.length - 1);

      itemList.forEach(function (item) {
        let rgb = RGBfromHSV(extraHue, saturation, brightness);
        item.style.backgroundColor = `rgb(${rgb[0]},${rgb[1]},${rgb[2]}`;
        extraHue += 20;
      });
      // child.style.backgroundColor = `hsl(${extraHue},${saturation}%,${brightness}%`;
    }
  });
}

//copy hex
const copyButton = document.querySelector('.copy-btn');
copyButton.addEventListener('click', function () {
  document.querySelector('.switch-txt').select();
});

//counf of itemS
const minusBtn = document.querySelector('.decreaseCount');
const plusBtn = document.querySelector('.increaseCount');

minusBtn.addEventListener('click', decreaceCountOfItems);
plusBtn.addEventListener('click', increaseCountOfItems);

function decreaceCountOfItems() {
  if (counter > 1) {
    counter--;
    deleteItem(counter);
    document.getElementById(counter + 1).classList.add('hide-items');
    changeColorWheelSector();
  }
}

function increaseCountOfItems() {
  if (counter < 6) {
    counter++;
    createItem();
    changeColorWheelSector();
  }
}

// container and items
const mainContainer = document.querySelector('.rec-container');

function deleteItem(id) {
  setTimeout(() => {
    document.getElementById(id + 2).remove();
  }, 200);
}

function createItem() {
  const item = document.createElement('div');
  item.classList.add('items');
  item.classList.add('hide-items');
  item.id = counter + 1;
  item.innerHTML = `
          <div class="item"></div>
  `;
  mainContainer.appendChild(item);

  document.getElementById(counter).classList.remove('hide-items');
}

//работа с HSV(HSB) более понятен человеческому глазу чем HSL
function RGBfromHSV(Hin, S, V) {
  let H = Hin % 360;
  const Hi = parseInt(H / 60);
  const Vmin = ((100 - S) * V) / 100;
  const a = (V - Vmin) * ((H % 60) / 60);

  const Vinc = Vmin + a;
  const Vdec = V - a;

  let r;
  let g;
  let b;

  switch (Hi) {
    case 0:
      r = V;
      g = Vinc;
      b = Vmin;
      break;
    case 1:
      r = Vdec;
      g = V;
      b = Vmin;
      break;
    case 2:
      r = Vmin;
      g = V;
      b = Vinc;
      break;
    case 3:
      r = Vmin;
      g = Vdec;
      b = V;
      break;
    case 4:
      r = Vinc;
      g = Vmin;
      b = V;
      break;
    case 5:
      r = V;
      g = Vmin;
      b = Vdec;
    default:
      break;
  }

  r = Math.round((r * 255) / 100);
  g = Math.round((g * 255) / 100);
  b = Math.round((b * 255) / 100);

  return [r, g, b];
}

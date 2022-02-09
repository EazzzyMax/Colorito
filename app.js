let hue;
let saturation;
//form
const stepForm = document.getElementById('step');
const brightnessForm = document.getElementById('brightness');
const sectorForm = document.getElementById('colorSector');

stepForm.addEventListener('change', changeStep);
sectorForm.addEventListener('change', changeColorWheelSector);
brightnessForm.addEventListener('change', changeBrightness);


//change step / brightness
function changeStep() {
  if (stepForm.value > 360 / counter) {
    stepForm.value = 360 / counter;
  } else if (stepForm.value < 0) {
    stepForm.value = 0;
  }
  sectorForm.value = counter * stepForm.value;
  changeExtraColors();
}

function changeColorWheelSector() {
  sectorForm.value = sectorForm.value > 360 ? 360 : sectorForm.value < 0 ? 0 : sectorForm.value;
  stepForm.value = sectorForm.value / counter;

  changeExtraColors();
}

const btnsChangeValue = document.querySelectorAll('.form__btn');
btnsChangeValue.forEach(function (item) {
  item.addEventListener('click', changeValueOnClick);
});

function changeValueOnClick(e) {
  e.preventDefault();

  let input = e.currentTarget.parentElement.parentElement.children[0];
  let value = input.value;
  const increaseIfTrue = e.currentTarget.classList.contains('increase');

  if (increaseIfTrue) {
    value = parseInt(value) + parseInt(input.step);
  } else {
    value = parseInt(value) - parseInt(input.step);
  }
  input.value = value;

  if (input.id == 'step') {
    changeStep();
  } else if (input.id == 'colorSector') {
    changeColorWheelSector();
  } else if (input.id == 'brightness') {
    changeBrightness();
  }
}

function changeBrightness() {
  brightnessForm.value = brightnessForm.value > 100 ? 100 : brightnessForm.value < 0 ? 0 : brightnessForm.value;
  darkSquare.style.backgroundColor = `#000`;
  darkSquare.style.opacity = 1 - brightnessForm.value / 100;
  changeMainColor();
  changeExtraColors();
  if (brightnessForm.value <= 45) {
    document.querySelector('.pointer').style.border = `2px solid #c6c6c6`;
    square.classList.add('low-brightness');
  } else {
    document.querySelector('.pointer').style.border = `2px solid #222`;
    square.classList.remove('low-brightness');
  }
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

//if page resized
window.addEventListener('resize', function () {
  squareLeft = square.offsetLeft;
  squareTop = square.offsetTop;
  pointerSize = pointer.offsetHeight;
  squareWidth = square.offsetWidth;
  squareHeight = square.offsetHeight;

  //movePointer
  pointerX = squareLeft + (squareWidth * hue) / 360;
  pointerY = squareTop + (squareHeight * (saturation - 50)) / 50;
  pointer.style.left = `${pointerX - pointerSize / 2}px`;
  pointer.style.top = `${pointerY - pointerSize / 2}px`;
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
  darkSquare.style.backgroundColor = `#000`;
  darkSquare.style.opacity = 1 - brightnessForm.value / 100;
}
function stopDrag() {
  if (document.querySelector('body').classList.contains('drag')) {
    window.removeEventListener('mousemove', draging);
    document.querySelector('body').classList.remove('drag');
    if (!brightnessControlTrigger && hideColorsCheckbox.checked) {
      darkSquare.style.backgroundColor = `#444`;
      darkSquare.style.opacity = 1;
    }
  }
}

//square bright control mouseenter / mouseover

let brightnessControlTrigger = false;
const darkSquare = document.querySelector('.brightness-control');
const brightnessFormContainer = document.querySelector('.brightness');
const hideColorsCheckbox = document.getElementById('hideColors');

hideColorsCheckbox.addEventListener('change', function () {
  if (hideColorsCheckbox.checked) {
    hideColors();
    [darkSquare, brightnessFormContainer].forEach((item) => {
      item.addEventListener('mouseenter', showColors);
    });
    [darkSquare, brightnessFormContainer].forEach((item) => {
      item.addEventListener('mouseleave', hideColors);
    });
  } else {
    showColors();
    [darkSquare, brightnessFormContainer].forEach((item) => {
      item.removeEventListener('mouseenter', showColors);
    });
    [darkSquare, brightnessFormContainer].forEach((item) => {
      item.removeEventListener('mouseleave', hideColors);
    });
  }
});

function showColors() {
  brightnessControlTrigger = true;
  darkSquare.style.backgroundColor = `#000`;
  darkSquare.style.opacity = 1 - brightnessForm.value / 100;
}

function hideColors() {
  brightnessControlTrigger = false;
  if (!document.querySelector('body').classList.contains('drag')) {
    darkSquare.style.backgroundColor = `#444`;
    darkSquare.style.opacity = 1;
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
  pointer.style.top = `${pointerY + window.pageYOffset - pointerSize / 2}px`;
}

//change colors !!!!!!!!!
function changeMainColor() {
  hue = ((pointerX - squareLeft) / squareWidth) * 360;
  saturation = ((pointerY - squareTop) / squareHeight) * 50 + 50;

  let rgb = RGBfromHSV(hue, saturation, brightnessForm.value);
  document.querySelector('.txt-color').innerHTML = `HSB(${Math.floor(hue)},${Math.floor(saturation)}%,${Math.floor(
    brightnessForm.value
  )}%)`;
  document.querySelector('.pointer').style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function changeExtraColors() {
  const allItems = document.querySelectorAll('.items');
  allItems.forEach(function (item) {
    if (!item.classList.contains('hide-items')) {
      let extraHue = (item.id - 1) * stepForm.value + hue;
      let rgb = RGBfromHSV(extraHue, saturation, brightnessForm.value);
      item.style.backgroundColor = `rgb(${rgb[0]},${rgb[1]},${rgb[2]}`;
    }
  });
}

//counf of itemS
let counter = 2;
const minusBtn = document.querySelector('.decreaseCount');
const plusBtn = document.querySelector('.increaseCount');

minusBtn.addEventListener('click', decreaceCountOfItems);
plusBtn.addEventListener('click', increaseCountOfItems);

function decreaceCountOfItems() {
  if (counter > 1) {
    counter--;
    deleteItem(counter + 2);
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
    document.getElementById(id).remove();
  }, 200);
}

function createItem() {
  const item = document.createElement('div');
  item.classList.add('items');
  item.classList.add('hide-items');
  item.id = counter + 1;
  mainContainer.appendChild(item);
  document.getElementById(counter).classList.remove('hide-items');
}

//работа с HSV(HSB) более понятен человеческому глазу чем HSL
function RGBfromHSV(Hfloat, S, V) {
  let H = Hfloat % 360;
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

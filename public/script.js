const modelsOLD = {
  suzuki: ['ignis', 'baleno', 'grand vitara'],
  toyota: ['mark II', 'land cruiser', 'ipsum'],
  nissan: ['juke', 'qashqai', 'almera'],
  bmw: ['m5', 'x3', 'x4', 'x5', 'x6'],
  volvo: ['x90', 'xc70', 'xc60'],
  mitsubishi: ['galant', 'outlander', 'lancer'],
  hyundai: ['porter', 'tucson', 'getz', 'solaris'],
  kia: ['soul', 'rio', 'spectra'],
  volkswagen: ['t2', 't3', 't4', 'polo', 'getta', 'touareg'],
  ваз: ['2106', '2109', '2107'],
}

const models = {
  SUZUKI: ['IGNIS', 'BALENO', 'GRAND VITARA'],
  TOYOTA: ['MARK II', 'LAND CRUISER', 'IPSUM'],
  NISSAN: ['JUKE', 'QASHQAI', 'ALMERA'],
  BMW: ['M5', 'X3', 'X4', 'X5', 'X6'],
  VOLVO: ['X90', 'XC70', 'XC60'],
  MITSUBISHI: ['GALANT', 'OUTLANDER', 'LANCER'],
  HYUNDAI: ['PORTER', 'TUCSON', 'GETZ', 'SOLARIS'],
  KIA: ['SOUL', 'RIO', 'SPECTRA'],
  VOLKSWAGEN: ['T2', 'T3', 'T4', 'POLO', 'GETTA', 'TOUAREG'],
  ВАЗ: ['2106', '2109', '2107'],
}

const brandSelection = document.getElementById("brand-selection");


function removeOptions(selectElement) {
  var i, L = selectElement.options.length - 1;
  for (i = L; i >= 0; i--) {
    selectElement.remove(i);
  }
}

function changeOption() {
  const selectedIndex = brandSelection.options.selectedIndex;
  const modelSelection = document.getElementById("model-selection");
  removeOptions(modelSelection);
  const selectedBrand = brandSelection.options[selectedIndex].value;
  models[selectedBrand].sort().forEach(model => {
    const text = model.toUpperCase();
    const value = model;
    const newOption = new Option(text, value);
    newOption.name = value;
    modelSelection.add(newOption);
  })
}

function changeSizeDivs() {
  const targetDivHeight = document.querySelector('#content-div').clientHeight;
  console.log('size' + targetDivHeight)
  const targetLeftDiv = document.querySelectorAll('#left-div').style.height = targetDivHeight + 'px';
  const targetRightDiv = document.querySelectorAll('#right-div').style.height = targetDivHeight + 'px';
}

function openCity(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the link that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}



const contentDivStyleHeigt = document.querySelector('#content-div').clientHeight;
console.log('size' + contentDivStyleHeigt)

brandSelection.addEventListener('change', changeOption);
contentDivStyleHeigt.addEventListener('change', changeSizeDivs);


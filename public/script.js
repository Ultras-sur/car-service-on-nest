//Functions
async function getCarBrandsAndModels() {
  const responce = await fetch('/carmodel/carbrandsandmodels');
  const result = await responce.json();
  models = result.carModelsAndBrands;
  console.log(models)
}

let models = {}



const models2 = {
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

//Elements
const brandSelection = document.getElementById("brand-selection");

//Listeners
document.addEventListener("DOMContentLoaded", async () => {
  await getCarBrandsAndModels();
});
brandSelection.addEventListener('change', changeOption);


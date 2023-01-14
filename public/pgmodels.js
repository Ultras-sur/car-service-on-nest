//Functions
async function getCarBrandsAndModels() {
  try {
    const responce = await fetch('/pgcarmodel/carbrandsandmodels');
    const result = await responce.json();
    models = result.carModelsAndBrands;
    console.log(models)
  } catch (e) {
    console.log(e);
  }
}

let models = {}

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
  const selectedBrand = brandSelection.options[selectedIndex].text;
  modelSelection.add(new Option());
  models[selectedBrand].forEach(model => {
    const [modelId, modelName] = model;
    const text = modelName.toUpperCase();
    const value = modelId;
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


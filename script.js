url = 'http://localhost:8500/costs/';
headersText = {
  'Content-Type': 'application/json;charset=utf-8',
  'Access-Control-Allow-Origin': '*'
};

const showError = (message) => {
  const error = document.getElementById('errors');

  if (!error) {
    return
  }

  error.innerText = message;
}

const deleteCost = async (id) => {
  try { 
    const response = await fetch (`${url}${id}`, {
      method: "DELETE",
      headers: headersText,
    });
    const resultDelete  = await response.json();
    
    if (resultDelete.deletedCount !== 1) {
      showError('Ошибка удаления записи на сервере');
      return
    } 
    
    allCosts = allCosts.filter(cost => cost._id !== id);
    render();
  } catch(error) {
    showError('Ошибка удаления записи');
  }
}


const addNewCost = async () => {
  const placeInput = document.getElementById('place');
  const amoutInput = document.getElementById('amount');
  
  if (!placeInput.value.trim() || !amoutInput.value.trim()) {
    showError('Введите текст');
    return
  }

  try {
    const response = await fetch (url, {
      method: "POST",
      headers: headersText,
      body: JSON.stringify({
        place: placeInput.value.trim(),
        amount: amoutInput.value.trim()
      })
    });
      console.log("da1");
      const newCost  = await response.json();

      allCosts.push(newCost);
      console.log("da2");
      console.log('newCost=', newCost);
      console.log("da3");
      
      placeInput.value = '';
      amoutInput.value = '';
      render();

  } catch(error) {
    showError('Ошибка при добавлении задачи');
  }
}

const editCost = (id) => {
  const index = allCosts.findIndex(cost => id === cost._id);
  console.log('index=',index);
  allCosts[index].isEdit = true;
  console.log(allCosts);
  render();
}


const applayEditCost = async (id, placeText, amountText, dataValue) => {
  const index = allCosts.findIndex(cost => id === cost._id);
  console.log('index=',index);
  console.log(allCosts);

  if (!placeText.trim() || !amountText.trim() ||  !dataValue.trim()) {// error!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //showError('Введите текст');
    console.log('errorrrr')
    allCosts[index].isEdit = false;
    return
  }
  try {
    console.log('before fetch');
      console.log(`${url}${id}`);
      console.log(placeText,amountText);
      const response = await fetch (`${url}${id}`, {
      method: "PATCH",
      headers: headersText,
      body: JSON.stringify({
         place: placeText,
         amount: amountText
      })
    });
      const editedCost  = await response.json();
      allCosts[index].place = editedCost.place;
      allCosts[index].amount = editedCost.amount;
      allCosts[index].data = editedCost.data
      allCosts[index].isEdit = false;
      
      render();
  } catch(error) {
    showError('Ошибка при добавлении задачи');
  }
}

const cancelEditCost = (id) => {
  const index = allCosts.findIndex(cost => id === cost._id);
  allCosts[index].isEdit = false;
  render();
}

const getAllCosts = async () => {
  try {
    const response = await fetch (url, {
      method: "GET",
      headers: headersText
    });

    const result = await response.json();
    allCosts = result;
    render();
  } catch(error) {
    showError('Ошибка при загрузке списка задач');
  }
  console.log(allCosts);
}


const render = () => {
  let totalAmount = 0;
  const content = document.getElementById('content-page');
  const totalAmountElement = document.getElementById('_total');

  showError('');
  if (!content) {
    return
  }
  
  while(content.firstChild) {
    content.removeChild(content.firstChild);
  }

  allCosts.forEach((cost) => {totalAmount+= cost.amount;})
  totalAmountElement.innerText = totalAmount;

  allCosts.forEach((cost, index) => {
    const {_id: id, place, amount, data, isEdit } = cost;
    const conteiner = document.createElement('div');
    const countCost = document.createElement('p');
    const placeCost = document.createElement('p');
    const amountCost = document.createElement('p');
    const dataCost = document.createElement('p');
    const buttonEditCost = document.createElement('button');
    const buttonDeleteCost = document.createElement('button');

    //---edit
    const placeInput = document.createElement('input');
    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    const dataInput = document.createElement('input');
    dataInput.type = 'data';
    const buttonApplyEdit = document.createElement('button');
    const buttonCancelEdit = document.createElement('button');
    //---edit

    conteiner.id = `task-${id}`;

    conteiner.className = 'conteiner';
    countCost.className = 'conteiner__count-cost';
    placeCost.className = 'conteiner__place-cost';
    amountCost.className = 'conteiner__amount-cost';
    dataCost.className = 'conteiner__data-cost';

    buttonEditCost.className = 'buttonEditCost button-cost';
    buttonDeleteCost.className = 'buttonDeleteCost button-cost';

    //edit---
    buttonApplyEdit.className = 'buttonApplyEdit button-cost';
    buttonCancelEdit.className = 'buttonCancelEdit button-cost';
    //edit


    countCost.innerText = `${index+1})`;
    
    if (isEdit) {
      placeInput.value = allCosts[index].place;
      amountInput.value = allCosts[index].amount;
      dataInput.value = allCosts[index].data;
      buttonApplyEdit.onclick = () => {
        console.log('buttonApply')
        applayEditCost(id, placeInput.value, amountInput.value, dataInput.value);
      }
      buttonCancelEdit.onclick = () => {
        cancelEditCost(id);
      }
      conteiner.append(countCost, placeInput, amountInput, dataInput, buttonApplyEdit, buttonCancelEdit);
    } else { 
      placeCost.innerText = place;
      amountCost.innerText = amount;
      dataCost.innerText = data;
      

      conteiner.append(countCost, placeCost, amountCost, dataCost, buttonEditCost, buttonDeleteCost);

      buttonDeleteCost.onclick = () => {
        deleteCost(id);
      }
      
      buttonEditCost.onclick = () => {
        editCost(id);
      }
    }
    content.appendChild(conteiner);

  })
}

window.onload = function init() {
  getAllCosts();
}
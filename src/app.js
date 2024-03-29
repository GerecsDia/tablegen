const tbody = document.querySelector("#tbody");
const saveButton = document.querySelector("#saveButton");  //rákötöttüka saveButtonra
const nameInput = document.querySelector("#name");  //be kell kötni ezeket is, hogy a gomb reagáljon
const quantityInput = document.querySelector("#quantity");  //be kell kötni ezeket is, hogy a gomb reagáljon
const priceInput = document.querySelector("#price");  //be kell kötni ezeket is, hogy a gomb reagáljon

const editidInput = document.querySelector("#editid");
const editnameInput = document.querySelector("#editname");
const editquantityInput = document.querySelector("#editquantity");
const editpriceInput = document.querySelector("#editprice");

const saveEditButton = document.querySelector('#saveEditButton');


// const gyumolcsok = [
//     { id: 1, name: 'szilva', quantity: 35, price: 8 },
//     { id: 2, name: 'alma', quantity: 45, price: 8.3 },
//     { id: 3, name: 'körte', quantity: 25, price: 9.5 },
//     { id: 4, name: 'barack', quantity: 37, price: 12 }
//   ];

var gyumolcsok = [];
const host = 'http://localhost:8000/';
// http://[::1]:3000

function getFruits() {
    let endpoint = 'fruits';
    let url = host + endpoint;
    console.log(url)

    fetch(url)
    .then( (response) => response.json( ))
    .then( result => {
        console.log(result);
        gyumolcsok = result;
        generateTbody();

    });

}

getFruits();

function generateTbody() {
    gyumolcsok.forEach((gyumolcs) => {
        let tr = document.createElement('tr');
        let tdName = document.createElement('td');
        let tdQuantity = document.createElement('td');
        let tdPrice = document.createElement('td');

        tdName.textContent = gyumolcs.name;
        tdQuantity.textContent = gyumolcs.quantity;
        tdPrice.textContent = gyumolcs.price;

        tbody.append(tr);
        tr.append(tdName);
        tr.append(tdQuantity);
        tr.append(tdPrice);        
        tr.append(generateTdDelete(gyumolcs.id));
        tr.append(generateTdEdit(gyumolcs));
    });
}
generateTbody();

function generateTdDelete(id) {
    let td = document.createElement('td');
    let button = document.createElement('button');
    button.textContent = "Törlés";
    button.classList = "btn btn-warning";
    button.addEventListener('click', () => {
        console.log(id);
        deleteFruit(id);
        // let index = 0;
        // let count = 0;
        // gyumolcsok.forEach((gy) => {
        //     if(gy.id == id) {
        //         index = count;
        //     }
        //     count++;
        // });
        // console.log(index);
        // gyumolcsok.splice(index, 1);
        // tbody.textContent = "";
        // generateTbody();
    });
    td.append(button);
    return td;
}




function generateTdEdit(fruit) {
    let td = document.createElement('td');
    let button = document.createElement('button');
    button.textContent = "Szerkesztés";
    button.classList = "btn btn-secondary";

    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#editModal');


    button.addEventListener('click', () => {
       console.log('működik');
       console.log(fruit.name);
       editidInput.value = fruit.id;
       editnameInput.value = fruit.name;
       editquantityInput.value = fruit.quantity;
       editpriceInput.value = fruit.price;


    });
    td.append(button);
    return td;
}

function createFruit(fruit) {
    let endpoint = 'fruits';
    let url = host + endpoint;

    fetch(url, {                    //a fetch lekérdezésnél átadjuk az url-t
        method: 'post',
        body: JSON.stringify(fruit),                   //át kell adni a body-t is (sztringesítve)
        headers: {
            "Content-Type": "application/json"
        }

    })
    .then(response => response.json())            //ha megkaptuk választ, egy névtelen függvényben futtassa a json-t
    .then(result => {
        console.log(result)
    });


}

function deleteFruit(id) {
    let endpoint = 'fruits';
    let url = host + endpoint + '/'+id;            
    fetch(url, {
        method: 'delete'
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        tbody.textContent = "";
        getFruits();
    });


}

saveButton.addEventListener('click', () => {
    console.log('működik');
    let name = nameInput.value;            // itt legyártjuk az objectumot
    let quantity = quantityInput.value;
    let price = priceInput.value;
    let gyumolcs = {
        name: name,
        quantity: quantity,
        price: price
    };
    createFruit(gyumolcs);                  //meghívjuk, majd átadjuk neki a gyumolcs-ot

    tbody.textContent ='',  
    getFruits();   
    //generateTbody();
    clearFieldOnAddModel();          //itt hívjuk meg 
});

function clearFieldOnAddModel() {    //itt mondjuk meg, ezzel a függvénnyel, hogy törlődjön az adat mentés után az ablakból
    nameInput.value = '';            // itt legyártjuk az objectumot
    quantityInput.value = '';
    priceInput.value = '';

}


saveEditButton.addEventListener('click', () => {
    
    let id = editidInput.value;       //kiszedjük a változásokat (meg tudjuk változtstni az adatokat)
    let name = editnameInput.value;
    let quantity = editquantityInput.value;
    let price = editpriceInput.value;

    let fruit = {
        id: id, 
        name: name,
        quantity: quantity,
        price: price
    }

    updateFruit(fruit);

    gyumolcsok.forEach((gyumolcs)=>{      //megy a gyümölcs lista bejárása... s amikor egyenlő 
        console.log(gyumolcs.name)
        if (gyumolcs.id == id) {
            gyumolcs.name = name;
            gyumolcs.quantity = quantity;
            gyumolcs.price= price;
        }
    });

    tbody.textContent ='',      //töröljük a tbody tartalmát, és újrageneráljuk
    generateTbody();

    
});

function updateFruit(fruit) {
    let endpoint = 'fruits';
    let url = host + endpoint + "/" + fruit.id;
    let headers = {
        "Content-Type": "application/json"
    } 
    fetch(url, {                //átadjuk az url-t
        method: 'PUT',
        body: JSON.stringify(fruit),
        headers: headers
    })
    .then(res => res.json())
    .then(res => {
        console.log(res)
    });        
}


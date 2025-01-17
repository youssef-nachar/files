let title = document.getElementById('title');
let files = document.getElementById("fileInput");
let submit = document.getElementById('submit');
let mood = 'create';
let temp;

let dataPro;
if (localStorage.product != null) {
    dataPro = JSON.parse(localStorage.product)
} else {
    dataPro = []
}

// let dataPro = [];

submit.onclick = function () {
    let newPro = {
        title: title.value,
        files:files.value
    }


    if (mood === 'create') {
        if (newPro.count > 1) {
            for (let i = 0; i < newPro.count; i++) {
                dataPro.push(newPro);
            }
        } else {
            dataPro.push(newPro);
        }

    } else {
        dataPro[temp] = newPro;
        mood = 'create';
        submit.innerHTML = "create";
        count.style.display = "block"

    }
    localStorage.setItem('product', JSON.stringify(dataPro))

    clearData();
    showData();

}





function clearData() {
    title.value = "";
    files.value= "";
}

function showData() {
    let table = "";
    for (let i = 0; i < dataPro.length; i++) {
        table += `
        <tr>
        <td>${dataPro[i].title}</td>
        <td>${dataPro[i].files}</td>
        <td><button onclick="deleteData(${i})" id="delete">delete</button></td>
        <td><button id="update">upload</button></td>
    </tr>`
    }


    document.getElementById('tbody').innerHTML = table;


    let btnDelete = document.getElementById("deleteAll");
    if (dataPro.length > 0) {
        btnDelete.innerHTML = `
            <button onclick="deleteAll()">Delete all(${dataPro.length})</button>
        `
    } else {
        btnDelete.innerHTML = ''
    }
}
showData();





function deleteData(i) {
    dataPro.splice(i, 1);
    localStorage.product = JSON.stringify(dataPro);
    showData()
}


function deleteAll() {
    localStorage.clear();
    dataPro.splice(0);
    showData()
}




function updateData(i) {
    title.value = dataPro[i].title;
    files.value = dataPro[i].files;
    submit.innerHTML = "update";
    mood = 'update';
    temp = i;
    getTotal();
    scroll({
        top: 0,
        behavior: 'smooth'
    })
    
}

let searchMood = 'title';

function getSearchMood(id) {
    let search = document.getElementById('search');

    if (id == 'searchTitle') {
        searchMood = 'title';
        search.placeholder = 'search by Title';
    } else {
        search.placeholder = 'search by Category';
        searchMood = 'category';
    }
    search.focus();
}


function searchData(value) {
    let table = '';
    if (searchMood == 'title') {
        for (let i = 0; i < dataPro.length; i++) {
            if (dataPro[i].title.includes(value)) {
                table += `<tr>
                <td>${dataPro[i].title}</td>
                <td>${dataPro[i].files}</td>
                <td><button onclick="updateData(${i});" id="update">update</button></td>
                <td><button onclick="deleteData(${i})" id="delete">delete</button></td>
            </tr>`

            }
        }
    } else {
        for (let i = 0; i < dataPro.length; i++) {
            if (dataPro[i].category.includes(value)) {
                table += `<tr>
                <td>${dataPro[i].title}</td>
                <td>${dataPro[i].files}</td>
                <td><button onclick="updateData(${i});" id="update">update</button></td>
                <td><button onclick="deleteData(${i})" id="delete">delete</button></td>
            </tr>`

            }
        }
    }

    document.getElementById('tbody').innerHTML = table;
}


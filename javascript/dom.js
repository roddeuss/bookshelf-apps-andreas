const UNCOMPLETED_READ_ID = 'belumDibaca';
const COMPLETED_READ_ID = 'telahDibaca';
const BOOK_ITEM_ID = "itemId";

function addBook() {

    // mengambil nilai data buku dari form input
    const inputJudulBuku = document.getElementById("inputJudulBuku").value;
    const inputPenulisBuku = document.getElementById("inputPenulisBuku").value;
    const inputTahunBuku = document.getElementById("inputTahunBuku").value;
    const inputDibaca = document.getElementById("dibaca").checked;

    // menampilkan data buku yang ditambahkan, ke console
    console.log("Judul: " + inputJudulBuku);
    console.log("Penulis: " + inputPenulisBuku);
    console.log("Tahun: "+ inputTahunBuku);
    console.log("Selesai Dibaca: "+ inputDibaca);

    const book = inputBook(inputJudulBuku, inputPenulisBuku, inputTahunBuku, inputDibaca);
    const bookObject = composeBookObject(inputJudulBuku, inputPenulisBuku, inputTahunBuku, inputDibaca);
  
    book[BOOK_ITEM_ID] = bookObject.id;
    books.push(bookObject);

    if(inputDibaca){
        document.getElementById(COMPLETED_READ_ID).append(book);
    } else {
        document.getElementById(UNCOMPLETED_READ_ID).append(book);
    }
    updateDataToStorage();
}

function inputBook(inputJudul, inputPenulis, inputTahun, inputDibaca){
    // membuat elemen judul buku
    const judulBuku = document.createElement('h3');
    judulBuku.classList.add('book-title');
    judulBuku.innerText = inputJudul;

    // membuat elemen penulis buku
    const penulisBuku = document.createElement('p');
    penulisBuku.classList.add('book-details');
    penulisBuku.innerText = inputPenulis;

    // membuat elemen tahun terbit buku
    const tahunBuku = document.createElement('p');
    tahunBuku.classList.add('book-details');
    tahunBuku.innerText = inputTahun;

    // membuat elemen daftar buku dan menambahkan tombol didalamnya
    const buttons = document.createElement('div');
    buttons.classList.add('book-buttons');
    buttons.append(greenButton(inputDibaca));
    buttons.append(orangeButton());
    buttons.append(redButton());

    // membuat elemen data buku menjadi satu
    const bookContainer = document.createElement('div');
    bookContainer.classList.add('book-card');
    bookContainer.append(judulBuku, penulisBuku, tahunBuku, buttons);

    return bookContainer;
};

function createButton(buttonType, buttonText, eventListener){

    // membuat elemen tombol dan karakteristik masing masing tombol
    const button = document.createElement("button");
    button.innerText = buttonText;
    button.classList.add(buttonType);
    button.addEventListener("click", function (event) {
        eventListener(event); 
    });
    return button;
}

function greenButton(status) {
    // Membuat tombol hapus dengan event
    return createButton('green-button', (status ? 'Belum Selesai' : 'Selesai'), function(event) {
        if(status) {
            undoBookFromCompleted(event.target.parentElement.parentElement);
        } else {
            addBookToCompleted(event.target.parentElement.parentElement);
    }
    });
}

function orangeButton() {
    // membuat tombol hapus dengan event 'editBook()'
    return createButton('orange-button', 'Edit', function(event) {
        editBook(event.target.parentElement.parentElement);
    });
}

function redButton() {
    // mmebuat tombol hapus dengan event 'removeBook()'
    return createButton('red-button', 'Hapus', function(event) {
        removeBook(event.target.parentElement.parentElement);
    });
}

// pindahkan buku ke rak sudah dibaca
function addBookToCompleted(taskElement) {
    const book = findBook(taskElement[BOOK_ITEM_ID]);
    book.isCompleted = true;

    // membuat data buku baru
    const newBook = inputBook(book.judul, book.penulis, book.tahun, inputDibaca=true);
    newBook[BOOK_ITEM_ID] = book.id;

    // tambah buku kedalam rak sudah dibaca
    const bookCompleted = document.getElementById(COMPLETED_READ_ID);
    bookCompleted.append(newBook);

    // hapus buku dari rak
    taskElement.remove();
    updateDataToStorage();
}

// tampilkan tab edit dan data data buku
function editBook(taskElement) {
    const edit = document.querySelector('.edit-section');
    edit.removeAttribute("hidden");

    const book = findBook(taskElement[BOOK_ITEM_ID]);

    // tampilkan data buku pada form edit
    const editJudulBuku = document.getElementById("editJudulBuku");
    editJudulBuku.value = book.judul;
    const editPenulisBuku = document.getElementById("editPenulisBuku");
    editPenulisBuku.value = book.penulis;
    const editTahunBuku = document.getElementById("editTahunBuku");
    editTahunBuku.value = book.tahun;
    const editDibaca = document.getElementById("editBaca");
    editDibaca.checked = book.isCompleted;

    const submitEdit = document.getElementById('edit-submit');
    submitEdit.addEventListener('click', function(event) {

        // membuat data baru pada buku yang diedit
        updateEditBook(editJudulBuku.value, editPenulisBuku.value, editTahunBuku.value, editDibaca.checked, book.id);

        // menutuo tab edit ketika selesai edit buku
        const edit = document.querySelector('.edit-section');
        edit.setAttribute("hidden", '');
    });
}

// memanggil fungsi untuk mengupdate data buku di local storage
function updateEditBook(judul, penulis, tahun, dibaca, id) {

    // ambil data pada local storage dan dikonversi dari String menjadi Objek
    const bookStorage = JSON.parse(localStorage[STORAGE_KEY]);
    const bookIndex = findBookIndex(id);

    // membuat data baru pada buku
    bookStorage[bookIndex] = {
        id: id,
        judul: judul,
        penulis: penulis,
        tahun: tahun,
        isCompleted: dibaca
    };

    // mengubah data menjadi String dan memasukan data baru pada local storage
    const parsed = JSON.stringify(bookStorage);
    localStorage.setItem(STORAGE_KEY, parsed);

    // reload halaman setelah data diubah
    location.reload(true);
}

// hapus buku dari rak buku
function removeBook(taskElement) {
    const hapus = confirm('Yakin ingin menghapus buku?');
    if(hapus) {

        // cari index buku yang dipilih dan menghapus datanya
        const bookPosition = findBookIndex(taskElement[BOOK_ITEM_ID]);
        books.splice(bookPosition, 1);

        // hapus buku dari rak
        taskElement.remove();
        updateDataToStorage();
    }
}

// kembalikan buku ke rak belum dibaca
function undoBookFromCompleted(taskElement){
    const book = findBook(taskElement[BOOK_ITEM_ID]);
    book.isCompleted = false;

    // membuat data buku baru
    const newBook = inputBook(book.judul, book.penulis, book.tahun, book.isCompleted);
    newBook[BOOK_ITEM_ID] = book.id;

    // tambah buku ke rak belum dibaca
    const uncompletedRead = document.getElementById(UNCOMPLETED_READ_ID);
    uncompletedRead.append(newBook);

    // hapus buku lama dari rak
    taskElement.remove();
    updateDataToStorage();
}

// memanggil fungsi untuk mencari buku
function searchBook(keyword) {
    const bookList = document.querySelectorAll('.book-card');
    for(let book of bookList){
        const judul = book.childNodes[0];
        if(!judul.innerText.toLowerCase().includes(keyword)){
            // tampilkan 'none' pada buku apabila judul tidak menganduk keyword yang dicari
            judul.parentElement.style.display = 'none';
        } else {
            // tampilkan buku apabila mengandung keyword
            judul.parentElement.style.display = '';
        }
    }
}
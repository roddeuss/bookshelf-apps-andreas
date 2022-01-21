document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('input-buku');
    submitForm.addEventListener('submit', function(){
        addBook();
    });

    // close tab edit
    const closeForm = document.getElementById('closeForm');
    closeForm.addEventListener('click', function() {
        const edit = document.querySelector('.edit-section');
        edit.setAttribute("hidden", '');
    })

    // Memanggil fungis mencari buku
    const searchButton = document.getElementById('cari');
    searchButton.addEventListener('click', function(){
        const keyword = document.getElementById('inputCariBuku').value;
        searchBook(keyword.toLowerCase());
    });


    if(isStorageExist()){ loadDataFromStorage() }
    
});

document.addEventListener("ondatasaved", () => {
    console.log("Data disimpan.");
});
document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
});
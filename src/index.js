const url = 'http://localhost:3000/dogs';
let idOfDogToEdit;

document.addEventListener('DOMContentLoaded', () => {
  const dogInputs = Array.from(document.getElementById('dog-form').getElementsByTagName('input')); 

  fetch(url)
    .then(response => response.json())
    .then(dogs => {
      dogs.forEach(dog => {
        const row = document.createElement('tr');
        row.className = 'padding';

        const idColumn = document.createElement('th');
        idColumn.setAttribute('id', dog.id);
        idColumn.style = 'display: none';

        const nameColumn = document.createElement('th');
        nameColumn.innerHTML = dog.name;
        
        const breedColumn = document.createElement('th');
        breedColumn.innerHTML = dog.breed;
        
        const sexColumn = document.createElement('th');
        sexColumn.innerHTML = dog.sex;
        
        const editColumn = document.createElement('th');
        const edit = document.createElement('button');
        edit.innerText = 'Edit';
        editColumn.appendChild(edit);

        row.appendChild(idColumn);
        row.appendChild(nameColumn);
        row.appendChild(breedColumn);
        row.appendChild(sexColumn);
        row.appendChild(editColumn);

        Array.from(row.querySelectorAll('th')).forEach(element => element.className = 'padding center');

        document.getElementById('table-body').appendChild(row);
   
        edit.addEventListener('click', () => {
          idOfDogToEdit = dog.id;
          dogInputs.forEach(dogInput => {
            switch(dogInput.name) {
              case 'name':  dogInput.value = dog.name; break;
              case 'breed': dogInput.value = dog.breed; break;
              case 'sex':   dogInput.value = dog.sex; break;
            }
          })
        });
      });
    });

    document.getElementById('dog-form').addEventListener('submit', event => {
      event.preventDefault();

      if (idOfDogToEdit) {
        fetch(`${url}/${idOfDogToEdit}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: dogInputs[0].value,
            breed: dogInputs[1].value,
            sex: dogInputs[2].value
          })
        }).then(res => res.json())
          .then(result => {
            const dogRows = document.getElementById('table-body').getElementsByTagName('tr');

            for (let i = 0; i < dogRows.length; i++) {
              if (dogRows[i].getElementsByTagName('th')[0].id == idOfDogToEdit) {
                const columns = dogRows[i].getElementsByTagName('th');

                columns[1].innerHTML = result.name;
                columns[2].innerHTML = result.breed;
                columns[3].innerHTML = result.sex;
                break;
              }
            }

            dogInputs[0].value = '';
            dogInputs[1].value = '';
            dogInputs[2].value = '';
          });
      };
    });
});
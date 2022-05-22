const url = 'http://localhost:3000/pups';
let filter = false;

function loadDogBar(dogs) {
    // Clear dog-bar
    const dogBar = document.querySelector('div#dog-bar');
    dogBar.innerHTML = '';
    dogs.map((dog) => {
        const span = document.createElement('span');
        span.innerText = `${dog.name}`;
        span.addEventListener('click', (e) => {
            e.preventDefault();
            loadDog(dog);
        })
        dogBar.appendChild(span);
    });
};

function loadDog(dog) {
    // Clear dog-info
    const dogInfo = document.querySelector('div#dog-info');
    dogInfo.innerHTML = '';

    // Create elements
    const img = document.createElement('img');
    const h2 = document.createElement('h2');
    const button = document.createElement('button');

    // Add attributes
    img.src = `${dog.image}`;
    h2.innerText = `${dog.name}`;
    button.innerText = dog.isGoodDog?`Good Dog!`:`Bad Dog!`;
    button.addEventListener('click', (e) => {
        e.preventDefault();
        updateDog(dog, button);
    })

    // Append
    dogInfo.append(img, h2, button);
};

function updateDog(dog, button) {
    fetch(url+`/${dog.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            "isGoodDog": !dog.isGoodDog
        })
    })
    .catch((error) => console.log(error))
    .then((res) => res.json())
    .then((data) => {
        dog.isGoodDog = data.isGoodDog;
        button.innerText = dog.isGoodDog?`Good Dog!`:`Bad Dog!`;
    })
};

function applyFilter() {
    fetch(url).then((res) => res.json()).then((data) => {
        loadDogBar(data.filter(function (dog) {
            return dog.isGoodDog === true;
        }));
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fetch(url).then((res) => res.json()).then((data) => {
        loadDogBar(data);
    });

    const filterButton = document.querySelector('button#good-dog-filter');
    filterButton.addEventListener('click', (e) => {
        e.preventDefault();
        filter = !filter;
        filterButton.innerText = filter?`Filter good dogs: ON`:`Filter good dogs: OFF`
        if(filter) {
            applyFilter();
        } else {
            fetch(url).then((res) => res.json()).then((data) => {
                loadDogBar(data);
            });
        }
    })
});
// selecting nessecary classes and store them into variables
const wrapper = document.querySelector('.wrapper'),
inputPart = wrapper.querySelector('.input-sec'),
infoTxt = inputPart.querySelector('.info-txt'),
inputField = inputPart.querySelector('input'),
locationBtn = inputPart.querySelector('button'),
weatherIcon = document.querySelector('.weather-part img'),
arrowBack = wrapper.querySelector('header i');
let api;

// calling request api when enter is pressed
inputField.addEventListener('keyup', e => {
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

// if the user browser supports geolocation then onSucces will be called else onError
locationBtn.addEventListener('click',() => {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    }else{
        alert("your browser does not support geolocation api");
    }
} );

function onSuccess(position){
    const {latitude, longitude}= position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=c1aaf060377e63686336e9657dab62bb`
    fetchData()
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add('error');
}


// api url 
function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=c1aaf060377e63686336e9657dab62bb`
    fetchData()
    
}

// fetching info from api
function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add('pending');
    // getting api response and returning it with parsing into js object and in another
    // then function calling weatherDetails function with passing api result as an argument.
    fetch(api)
    .then(response => response.json())
    .then(result => weatherDetails(result));

}

// showing weather information 
function weatherDetails(info){
    if(info.cod == '404'){
        infoTxt.classList.replace('pending','error');
        infoTxt.innerText =`${inputField.value} is not a valid city name`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        if(id == 800){
            weatherIcon.src = 'icons/day.svg';
        }else if(id >= 200 && id <= 232){
            weatherIcon.src = 'icons/thunder.svg';
        }else if(id >= 500 && id <= 531){
            weatherIcon.src = 'icons/rainy-1.svg';
        }else if(id >=600 && id <= 622){
            weatherIcon.src = 'icons/snowy-1.svg';
        }else if(id >=801 && id <= 804){
            weatherIcon.src = 'icons/cloudy.svg';
        }

        wrapper.querySelector('.temp .numb').innerText = Math.floor(temp);
        wrapper.querySelector('.weather').innerText = description;
        wrapper.querySelector('.location span').innerText = `${city}, ${country}`;
        wrapper.querySelector('.temp .numb-2').innerText = Math.floor(feels_like);
        wrapper.querySelector('.humidity span').innerText = `${humidity}%`;

        infoTxt.classList.remove('pending', 'error');
        wrapper.classList.add("active");
        console.log(info);
    }
}

arrowBack.addEventListener('click', () => {
    wrapper.classList.remove("active");
    inputField.value = ""
})

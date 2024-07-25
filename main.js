const wrapper = document.querySelector('.wrapper'),
inputPart = wrapper.querySelector('.input-sec'),
infoTxt = inputPart.querySelector('.info-txt'),
inputField = inputPart.querySelector('input'),
locationBtn = inputPart.querySelector('button');
let api;


inputField.addEventListener('keyup', e => {
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

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


function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=c1aaf060377e63686336e9657dab62bb`
    fetchData()
    
}

function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add('pending');
    // getting api response and returning it with parsing into js object and in another
    // then function calling weatherDetails function with passing api result as an argument.
    fetch(api)
    .then(response => response.json())
    .then(result => weatherDetails(result));

}
function weatherDetails(info){
    if(info.cod == '404'){
        infoTxt.classList.replace('pending','error');
        infoTxt.innerText =`${inputField.value} is not a valid city name`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

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


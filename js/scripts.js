/*!
* Start Bootstrap - Business Casual v7.0.9 (https://startbootstrap.com/theme/business-casual)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-business-casual/blob/master/LICENSE)
*/
// Highlights current date on contact page
window.addEventListener('DOMContentLoaded', event => {
    const listHoursArray = document.body.querySelectorAll('.list-hours li');

    // Verifica si hay elementos en listHoursArray
    if (listHoursArray.length > 0) {
        // Asegúrate de que el índice no exceda la longitud del array
        const todayIndex = new Date().getDay();
        if (todayIndex < listHoursArray.length) {
            // Accede al elemento correspondiente y agrega la clase 'today'
            listHoursArray[todayIndex].classList.add('today');
        } else {
            console.error('El índice del día actual excede la longitud del array.');
        }
    } else {
        console.error('No se encontraron elementos con la clase ".list-hours li".');
    }
});

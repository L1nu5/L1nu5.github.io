(
    function() {
        window.addEventListener('load', () => {
            getAge();
        })
    }
)()

function getAge() {
    console.log("Executed");
    let today = moment();
    let birthdate = moment('1995-03-29');
    let duration = moment.duration(today.diff(birthdate));
    const years = duration.years();
    const months = duration.months();
    const weeks = duration.weeks();
    const days = duration.subtract(weeks, "w").days();
    
    let text = years + " years " + months + " months " + days + " days ";
    document.getElementById("ageText").innerHTML = text;
}
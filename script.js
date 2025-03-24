//todo
// randomly generate cost for college in range and add 7% intrest rate 
// add debt affecting stress exponential scale | set hard limit for debt at 700,000
// add debt growth rate 
// update job to add function to be vairable 
// housing 
//job experience

class Player
{
    constructor(name,age, wealth,stress,education, job,debt,job_experience){
        this.name = name;
        this.age = age;
        this.wealth = wealth;
        this.stress = stress; // percent from 0 -100
        this.education = education;
        this.job = job;// ['job_name', yearly income]
        this.debt = debt;
        this.job_experience = job_experience;//years 
    }
    chapter(){
        if (this.job == null) return;
        console.log(`pre chapter - Debt: ${this.debt}, Wealth: ${this.wealth}`);
        this.age = this.age + 4;
        this.debt *= 1.07;
        console.log(this.job[1]);
        this.wealth = parseFloat(this.wealth) + ( 4 * parseInt(this.job[1]));
        if (this.education == "Trade School"){
            this.stress = 70;
        }else if (this.education == "4 Year College"){
            this.stress = 90;
        }else{
            this.stress = 60;
        }
        console.log(`post chapter - Debt: ${this.debt}, Wealth: ${this.wealth}`);
        display_stats();
        // add debt affecting stress exponential scale | set hard limit for debt at 700,000
    }
    get_job() {
        const jobs = {
            "High School": [
                { title: "Walmart", baseSalary: 28000 },
                { title: "Construction ", baseSalary: 32000 },
                { title: "McDonalds Worker", baseSalary: 25000 }
            ],
            
            "Trade School": [
                { title: "Electrician", baseSalary: 50000 },
                { title: "Plumber", baseSalary: 48000 },
                { title: "Technician", baseSalary: 47000 }
            ],
            
            "4 Year College": [
                { title: "Software Manager", baseSalary: 70000 },
                { title: "Financial Analyst", baseSalary: 65000 },
                { title: "Marketing Manager", baseSalary: 60000 }
            ]
        };

        const experienceMultiplier = 1 + (this.job_experience / 10); 
        const educationLevel = this.education || "None";
        console.log(educationLevel);
        console.log(jobs);
        const availableJobs = jobs[educationLevel];
        console.log(availableJobs);

        
        const jobOptionsDiv = document.createElement("div");
        jobOptionsDiv.innerHTML = ""; 
        for (const {title, baseSalary} of availableJobs) {
            const adjustedSalary = Math.round(baseSalary * 1);
            const jobButton = document.createElement("button");
            jobButton.innerText = `${title} - $${adjustedSalary}/year`;
            //console.log("inital setting: " + title + " | " + adjustedSalary);
            jobButton.onclick = () => this.select_job(title, adjustedSalary);
            jobOptionsDiv.appendChild(jobButton);
            jobOptionsDiv.appendChild(document.createElement("br"));
        }

        display_gameplay("Select a Job", jobOptionsDiv);
    }
    select_job(jobTitle, salary) {
        this.job = [jobTitle, salary];
        //console.log("selection setting: " + this.job[0] + " | " + this.job[1]);
        hide_gameplay();
        display_stats();
        show("continue");
    }
    buy(x){
        if( this.wealth >= x){
            this.wealth = this.wealth - x[0];
        }else{
            alert('your too broke to afford this');
            }
        }
    college(){
        // randomly generate cost for college in range and add 7% intrest rate 
        collegeCost = (int)(Math.random * 20000) + 10000;
        setStress();
        this.debt += collegeCost;
    }
    set_stress() {
        this.stress = 0.000001* Math.pow(Math.E, this.debt);
    }
    add_debt(amount) {
        this.debt += amount;
        if (this.debt > 700000) debt = 700000;
    }
}
            
function display_stats()
{
    console.log(player.wealth)
    document.getElementById("debt").innerHTML = `Debt: ${player.debt}`;
    document.getElementById("wealth").innerHTML = `Wealth: ${player.wealth}`;
    document.getElementById("age").innerHTML = `Age: ${player.age}`;
}

function run(){
    //player.set_stress();
    document.getElementById("continue").onclick = () => player.chapter()//.addEventListener("onclick", , false);
    //player.chapter();
    display_stats(player);
    player.get_job();
}

function hide(id){
    document.getElementById(id).style.display = "none";
}

function show(id){
    document.getElementById(id).style.display = "block";
}

function display_gameplay(prompt, options)
{
    hide("continue");
    promptDiv = document.getElementById("prompt");
    promptDiv.style.display = "block";
    promptDiv.innerHTML = prompt;
    optionsDiv = document.getElementById("options");
    promptDiv.style.display = "block";
    optionsDiv.appendChild(options);
    show("gameplay");
}

function hide_gameplay(){
    document.getElementById("options").style.display = "none";
    document.getElementById("prompt").style.display = "none";
}

const player = new Player('setup_name_later', 18, 10000, 0 , 'High School', "", 0, 0);
run();
//player.chapter();

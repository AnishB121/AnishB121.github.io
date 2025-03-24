//todo
// fix trade school path since its 2 years so we will have to add 2 years extra of income
// Also debt is growing kinda slow so maybe make intrest rate higher 
class Player {
    constructor(name, age, wealth, stress, education, job, debt, job_experience) {
        this.name = name;
        this.age = age;
        this.wealth = wealth;
        this.stress = stress; // percent from 0 -100
        this.education = education;
        this.job = job; // ['job_name', yearly income]
        this.debt = debt;
        this.job_experience = job_experience; //years 
        this.car = null; // [car_name, value, monthly_payment]
        this.housing = null; // [housing_type, value, monthly_payment]
        this.monthly_expenses = 0;
    }

    chapter() {
        if (this.age === 18 && this.education == "wait") {
            this.education_choice();
            return;
        }

        if (this.job === null) {
            this.get_job();
            return;
        }
        
        if (!this.housing && !this.car) {
            this.life_decisions();
            return;
        } else if (!this.housing) {
            this.housing_options();
            return;
        } else if (!this.car) {
            this.car_options();
            return;
        }

        console.log(`pre chapter - Debt: ${this.debt}, Wealth: ${this.wealth}`);
        
        const monthlyExpenses = this.monthly_expenses * 48; 
        this.wealth -= monthlyExpenses;
        
        this.age = this.age + 4;
        this.debt *= 1.07;
        
        if (this.job) {
            console.log(this.job[1]);
            let raw_income = job[1] * (1 - calculate_income_tax(job[1]));
            this.wealth = parseFloat(this.wealth) + (4 * parseInt(raw_income));
        }
        
        if (this.education == "Trade School") {
            this.stress = 70;
        } else if (this.education == "4 Year College") {
            this.stress = 90;
        } else {
            this.stress = 60;
        }
        
        this.set_stress();
        
        console.log(`post chapter - Debt: ${this.debt}, Wealth: ${this.wealth}`);
        display_stats();
        
        show("continue");
    }
    
    life_decisions() {
        const messageDiv = document.createElement("div");
        const message = document.createElement("p");
        message.innerHTML = `You're earning $${Number(this.job[1]).toLocaleString()}/year.<br>It's time to make some important life decisions.`;
        
        const housingBtn = document.createElement("button");
        housingBtn.innerText = "Look for Housing";
        housingBtn.onclick = () => {
            this.housing_options();
        };
        
        const carBtn = document.createElement("button");
        carBtn.innerText = "Shop for a Car";
        carBtn.onclick = () => {
            this.car_options();
        };
        
        const skipBtn = document.createElement("button");
        skipBtn.innerText = "Skip Both (Continue Living with Parents)";
        skipBtn.onclick = () => {
            const skipMessage = document.createElement("div");
            const skipText = document.createElement("p");
            skipText.innerText = "You decide to continue living with your parents and use public transportation, saving money but possibly increasing stress.";
            
            const continueBtn = document.createElement("button");
            continueBtn.innerText = "Continue to Next Chapter";
            continueBtn.onclick = () => {
                this.stress += 10; 
                this.housing = ["Parents' House", 0, 300];
                this.car = ["Public Transportation", 0, 100];
                this.monthly_expenses += 400; 
                hide_gameplay();
                display_stats();
                show("continue");
            };
            
            skipMessage.appendChild(skipText);
            skipMessage.appendChild(continueBtn);
            display_gameplay("Living Freely", skipMessage);
        };
        
        messageDiv.appendChild(message);
        messageDiv.appendChild(housingBtn);
        messageDiv.appendChild(document.createElement("br"));
        messageDiv.appendChild(carBtn);
        messageDiv.appendChild(document.createElement("br"));
        messageDiv.appendChild(skipBtn);
        
        display_gameplay("Life Decisions", messageDiv);
    }
    
    housing_options() {
        const housingDiv = document.createElement("div");
        const introduction = document.createElement("p");
        introduction.innerText = "Where would you like to live?";
        housingDiv.appendChild(introduction);
        
        const options = [
            {type: "Studio Apartment", value: 80000, monthly: 900, stress: -5},
            {type: "1-Bedroom Apartment", value: 120000, monthly: 1200, stress: -10},
            {type: "Shared House (with roommates)", value: 180000, monthly: 700, stress: 0},
            {type: "Parents' House", value: 0, monthly: 300, stress: 15}
        ];
        
        for (const option of options) {
            const button = document.createElement("button");
            button.innerText = `${option.type} - $${option.monthly}/month`;
            button.onclick = () => {
                this.select_housing(option);
            };
            housingDiv.appendChild(button);
            housingDiv.appendChild(document.createElement("br"));
            
            const description = document.createElement("p");
            description.innerText = this.get_housing_description(option);
            description.style.fontSize = "0.9em";
            description.style.marginLeft = "20px";
            description.style.marginBottom = "15px";
            housingDiv.appendChild(description);
        }
        
        display_gameplay("Housing Options", housingDiv);
    }
    
    get_housing_description(option) {
        switch(option.type) {
            case "Studio Apartment":
                return "Small but all yours. Modest living with privacy and independence.";
            case "1-Bedroom Apartment":
                return "More space and comfort, but higher cost. Good for work-life balance.";
            case "Shared House (with roommates)":
                return "Save money with roommates. Social living but less privacy.";
            case "Parents' House":
                return "Cheapest option but high stress. Save money quickly but limited independence.";
            default:
                return "";
        }
    }
    
    select_housing(option) {
        this.housing = [option.type, option.value, option.monthly];
        this.monthly_expenses += option.monthly;
        this.stress += option.stress;
        
        const resultDiv = document.createElement("div");
        const message = document.createElement("p");
        message.innerHTML = `You chose to live in a ${option.type}.<br>Monthly payment: $${option.monthly}<br>`;
        
        if (this.car) {
            const continueBtn = document.createElement("button");
            continueBtn.innerText = "Continue to Next Chapter";
            continueBtn.onclick = () => {
                hide_gameplay();
                display_stats();
                show("continue");
            };
            resultDiv.appendChild(message);
            resultDiv.appendChild(continueBtn);
        } else {
            const carBtn = document.createElement("button");
            carBtn.innerText = "Now Let's Shop for a Car";
            carBtn.onclick = () => {
                this.car_options();
            };
            resultDiv.appendChild(message);
            resultDiv.appendChild(carBtn);
        }
        
        display_gameplay("Housing Selected", resultDiv);
    }
    
    car_options() {
        const carDiv = document.createElement("div");
        const introduction = document.createElement("p");
        introduction.innerText = "What kind of car would you like to buy?";
        carDiv.appendChild(introduction);
        
        const options = [
            {name: "Used Economy Car", value: 8000, monthly: 150, reliability: "Fair", stress: 5},
            {name: "New Economy Car", value: 20000, monthly: 350, reliability: "Good", stress: 0},
            {name: "Used Luxury Car", value: 25000, monthly: 450, reliability: "Poor", stress: 10},
            {name: "New SUV", value: 35000, monthly: 550, reliability: "Excellent", stress: -5},
            {name: "Public Transportation", value: 0, monthly: 100, reliability: "N/A", stress: 8}
        ];
        
        for (const option of options) {
            const button = document.createElement("button");
            if (option.name === "Public Transportation") {
                button.innerText = `${option.name} - $${option.monthly}/month`;
            } else {
                button.innerText = `${option.name} - $${option.value.toLocaleString()} ($${option.monthly}/month)`;
            }
            button.onclick = () => {
                this.select_car(option);
            };
            carDiv.appendChild(button);
            carDiv.appendChild(document.createElement("br"));
            
            const description = document.createElement("p");
            description.innerText = this.get_car_description(option);
            description.style.fontSize = "0.9em";
            description.style.marginLeft = "20px";
            description.style.marginBottom = "15px";
            carDiv.appendChild(description);
        }
        
        display_gameplay("Transportation Options", carDiv);
    }
    
    get_car_description(option) {
        switch(option.name) {
            case "Used Economy Car":
                return "Affordable but might need repairs. Reliability: Fair";
            case "New Economy Car":
                return "Good value and reliable. No unexpected repairs for a few years.";
            case "Used Luxury Car":
                return "Looks impressive but expensive maintenance. High risk of costly repairs.";
            case "New SUV":
                return "Expensive but versatile and reliable. Comfortable but high fuel costs.";
            case "Public Transportation":
                return "Most economical option but least convenient. Limited flexibility.";
            default:
                return "";
        }
    }
    
    select_car(option) {
        if (option.name !== "Public Transportation") {
            if (option.value > 0) {
                const downPayment = option.value * 0.1;
                if (this.wealth < downPayment) {
                    alert("You can't afford the down payment for this car!");
                    this.car_options();
                    return;
                }
                this.wealth -= downPayment;
                this.debt += (option.value - downPayment); 
            }
            this.car = [option.name, option.value, option.monthly];
        } else {
            this.car = ["Public Transportation", 0, option.monthly];
        }
        
        this.monthly_expenses += option.monthly;
        this.stress += option.stress;
        
        const resultDiv = document.createElement("div");
        const message = document.createElement("p");
        
        if (option.name !== "Public Transportation") {
            message.innerHTML = `You chose a ${option.name}.<br>Value: $${option.value.toLocaleString()}<br>Monthly payment: $${option.monthly}<br>Reliability: ${option.reliability}`;
        } else {
            message.innerHTML = `You chose to use ${option.name}.<br>Monthly cost: $${option.monthly}<br>`;
        }
        
        const expenseSummary = document.createElement("p");
        expenseSummary.innerHTML = `<strong>Your monthly expenses:</strong> $${this.monthly_expenses.toLocaleString()}<br>
                                   <strong>This equals:</strong> $${(this.monthly_expenses * 12).toLocaleString()} per year`;
        
        const continueBtn = document.createElement("button");
        continueBtn.innerText = "Continue to Next Chapter";
        continueBtn.onclick = () => {
            hide_gameplay();
            display_stats();
            show("continue");
        };
        
        resultDiv.appendChild(message);
        resultDiv.appendChild(document.createElement("br"));
        resultDiv.appendChild(expenseSummary);
        resultDiv.appendChild(document.createElement("br"));
        resultDiv.appendChild(continueBtn);
        
        display_gameplay("Transportation Selected", resultDiv);
    }

    education_choice() {
        const choicesDiv = document.createElement("div");
        
        const jobButton = document.createElement("button");
        jobButton.innerText = "Get a Job";
        jobButton.onclick = () => {
            this.education = "High School";
            hide_gameplay();
            this.get_job();
        };
        
        const tradeSchoolButton = document.createElement("button");
        tradeSchoolButton.innerText = "Go to Trade School";
        tradeSchoolButton.onclick = () => {
            this.attend_trade_school();
        };
        
        const collegeButton = document.createElement("button");
        collegeButton.innerText = "Go to College";
        collegeButton.onclick = () => {
            this.attend_college();
        };
        
        choicesDiv.appendChild(jobButton);
        choicesDiv.appendChild(document.createElement("br"));
        choicesDiv.appendChild(tradeSchoolButton);
        choicesDiv.appendChild(document.createElement("br"));
        choicesDiv.appendChild(collegeButton);
        
        display_gameplay("You're 18! What would you like to do?", choicesDiv);
    }
    
    attend_trade_school() {
        const tradeCost = Math.floor(Math.random() * 20000) + 10000;
        this.add_debt(tradeCost);
        this.education = "Trade School";
        this.age += 2; 
        
        const messageDiv = document.createElement("div");
        const message = document.createElement("p");
        message.innerText = `You attended Trade School for 2 years and incurred $${tradeCost.toLocaleString()} in debt.`;
        
        const continueBtn = document.createElement("button");
        continueBtn.innerText = "Continue";
        continueBtn.onclick = () => {
            hide_gameplay();
            this.get_job();
        };
        
        messageDiv.appendChild(message);
        messageDiv.appendChild(continueBtn);
        
        display_gameplay("Trade School Complete!", messageDiv);
    }
    
    attend_college() {
        const collegeCost = Math.floor(Math.random() * 70000) + 30000;
        this.add_debt(collegeCost);
        this.education = "4 Year College";
        this.age += 4; 
        
        const messageDiv = document.createElement("div");
        const message = document.createElement("p");
        message.innerText = `You graduated from college after 4 years and incurred $${collegeCost.toLocaleString()} in debt.`;
        
        const continueBtn = document.createElement("button");
        continueBtn.innerText = "Continue";
        continueBtn.onclick = () => {
            hide_gameplay();
            this.get_job();
        };
        
        messageDiv.appendChild(message);
        messageDiv.appendChild(continueBtn);
        
        display_stats();
        display_gameplay("College Complete!", messageDiv);
    }

    get_job() {
        const jobs = {
            "High School": [
                { title: "Walmart", baseSalary: 28000 },
                { title: "Construction", baseSalary: 32000 },
                { title: "McDonalds", baseSalary: 25000 }
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
        const educationLevel = this.education || "High School";
        console.log(educationLevel);
        console.log(jobs);
        const availableJobs = jobs[educationLevel];
        console.log(availableJobs);

        const jobOptionsDiv = document.createElement("div");
        for (const {title, baseSalary} of availableJobs) {
            const adjustedSalary = Math.round(baseSalary * experienceMultiplier);
            const jobButton = document.createElement("button");
            jobButton.innerText = `${title} - $${adjustedSalary.toLocaleString()}/year`;
            jobButton.onclick = () => this.select_job(title, adjustedSalary);
            jobOptionsDiv.appendChild(jobButton);
            jobOptionsDiv.appendChild(document.createElement("br"));
        }

        display_gameplay("Select a Job", jobOptionsDiv);
    }

    select_job(jobTitle, salary) {
        this.job = [jobTitle, salary];
        this.job_experience += 4; 
        hide_gameplay();
        display_stats();
        
        if (!this.housing || !this.car) {
            this.life_decisions(); 
        } else {
            show("continue");
        }
    }

    buy(x) {
        if (this.wealth >= x[0]) {
            this.wealth = this.wealth - x[0];
        } else {
            alert('You\'re too broke to afford this');
        }
    }

    set_stress() {
        if (this.debt > 0) {
            this.stress = Math.min(100, 40 + 0.000001 * Math.pow(Math.E, this.debt/10000));
        }
    }

    add_debt(amount) {
        this.debt += amount;
        if (this.debt > 700000) this.debt = 700000; 
    }

    calculate_income_tax(income) {
        if (income > 721314) return 0.123;
        else if (income > 432787) return 0.113;
        else if (income > 360659) return 0.103;
        else if (income > 70606) return 0.093;
        else if (income > 55866) return 0.08;
        else if (income > 40245) return 0.06;
        else if (income > 25499) return 0.04;
        else if (income > 10756) return 0.02;
        else return 0.01;
    }
}
            
function display_stats() {
    console.log(player.wealth);
    
    document.getElementById("debt").innerHTML = `Debt: $${Math.round(player.debt).toLocaleString()}`;
    document.getElementById("wealth").innerHTML = `Wealth: $${Math.round(player.wealth).toLocaleString()}`;
    document.getElementById("age").innerHTML = `Age: ${player.age}`;
    
    let housingEl = document.getElementById("housing");
    let carEl = document.getElementById("car");
    let expenseEl = document.getElementById("expenses");
    let gameplay = document.getElementById("gameplay");
    
    if (!housingEl && player.housing) {
        housingEl = document.createElement("p");
        housingEl.id = "housing";
        gameplay.appendChild(housingEl);
    }
    
    if (!carEl && player.car) {
        carEl = document.createElement("p");
        carEl.id = "car";
        gameplay.appendChild(carEl);
    }
    
    if (!expenseEl && player.monthly_expenses > 0) {
        expenseEl = document.createElement("p");
        expenseEl.id = "expenses";
        gameplay.appendChild(expenseEl);
    }
    
    if (housingEl && player.housing) {
        housingEl.innerHTML = `Housing: ${player.housing[0]} ($${player.housing[2]}/month)`;
    }
    
    if (carEl && player.car) {
        carEl.innerHTML = `Transportation: ${player.car[0]} ($${player.car[2]}/month)`;
    }
    
    if (expenseEl && player.monthly_expenses > 0) {
        expenseEl.innerHTML = `Monthly Expenses: $${player.monthly_expenses.toLocaleString()}`;
    }
}

function run() {
    document.getElementById("continue").onclick = () => player.chapter();
    display_stats();
    player.chapter();
}

function hide(id) {
    document.getElementById(id).style.display = "none";
}

function show(id) {
    document.getElementById(id).style.display = "block";
}

function display_gameplay(prompt, options) {
    hide("continue");
    const promptDiv = document.getElementById("prompt");
    promptDiv.style.display = "block";
    promptDiv.innerHTML = prompt;
    
    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";
    optionsDiv.style.display = "block";
    optionsDiv.appendChild(options);
    
    show("gameplay");
}

function hide_gameplay() {
    document.getElementById("options").innerHTML = "";
    document.getElementById("prompt").style.display = "none";
    document.getElementById("options").style.display = "none";
}

const player = new Player('Player', 18, 10000, 0, 'wait', null, 0, 0);
run();
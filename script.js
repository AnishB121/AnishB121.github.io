//todo
// fix trade school path since its 2 years so we will have to add 2 years extra of income
// Also debt is growing kinda slow so maybe make intrest rate higher 
function fetchSalary(jobTitle) {
    const apiToken = 'WXbtyt0meTcNlRcEThuSOJGaP8XKRUn0009mB79Gaitx8/cln5SfS1VxF2XlgC7uAbHQSLEBVed96/MClAUYug==';      
    const userId = 'cx5ugVoCSXKRe7u';           
    const location = 'US';                    
    const enableMetaData = false;             
    const endpoint = `https://api.careeronestop.org/v1/comparesalaries/${userId}/wage?keyword=${encodeURIComponent(jobTitle)}&location=${encodeURIComponent(location)}&enableMetaData=${enableMetaData}`;
    
    return fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('API request failed');
      }
      return response.json();
    })
    .then(data => {
      if (
        data &&
        data.OccupationDetail &&
        data.OccupationDetail.Wages &&
        Array.isArray(data.OccupationDetail.Wages.NationalWagesList)
      ) {
        const annualWageObj = data.OccupationDetail.Wages.NationalWagesList.find(wage => wage.RateType === "Annual");
        if (annualWageObj && annualWageObj.Median) {
          return parseInt(annualWageObj.Median, 10);
        }
      }
      return undefined; 
    })
    .catch(err => {
      console.error(`Error fetching salary for ${jobTitle}:`, err);
      return undefined;
    });
}
class Player {
    constructor(name, age, wealth, stress) {
        this.stats = {
            'name': name,
            'age': age, 
            'wealth': wealth,
            'stress': stress,
            'debt': 0
        }
        this.objects = {

        }
        /*
        job_experience: years 
        car: [car_name, value, monthly_payment]
        housing: [housing_type, value, monthly_payment]
        */
    }

    get_stat(stat)
    {
        if (stat in this.stats)
        {
            return this.stats[stat];
        }
        else
        {
            return null;
        }
    }

    get_stat(stat, fallback)
    {
        if (stat in this.stats)
        {
            return this.stats[stat];
        }
        else
        {
            return fallback;
        }
    }

    set_stat(stat, value)
    {
        this.stats[stat] = value;
    }

    change_stat(stat, value)
    {
        this.set_stat(stat, this.get_stat(stat, 0) + value);
    }

    set_object(object, data)
    {
        this.objects[object] = data;
    }

    get_object(object)
    {
        return this.objects[object];
    }

    chapter() {
        if (this.get_stat('age') === 18 && !this.get_stat('education')) {
            this.education_choice();
            return;
        }

        if (this.get_object('job') === null) {
            this.get_job();
            return;
        }
        
        if (!this.get_object('housing') && !this.get_object('car')) {
            this.life_decisions();
            return;
        } else if (!this.get_object('car') && !this.get_object('housing')) {
            this.life_decisions();
            return;
        } else if (this.get_object('housing') === null) {
            this.housing_options();
            return;
        } else if (this.get_object('car') === null) {
            this.car_options();
            return;
        }

        console.log(`pre chapter - Debt: ${this.get_stat('debt')}, Wealth: ${this.get_stat('wealth')}`);
        
        const monthlyExpenses = this.get_stat('monthly_expenses') * 48; 
        this.change_stat('wealth', -monthlyExpenses);
        console.log(this.get_stat('wealth'));
        
        this.change_stat('age', 4);
        this.set_stat('debt', this.get_stat('debt') * 1.07);
        
        if (this.get_object('job')) {
            let job = this.get_object('job');
            console.log(job[1]);
            let raw_income = job[1] * (1 - this.calculate_income_tax(job[1]));
            this.change_stat('wealth', 4 * parseInt(raw_income));
        }
        
        let education = this.get_stat('education');
        if (education == "Trade School") {
            this.set_stat('stress', 70);
        } else if (education == "4 Year College") {
            this.set_stat('stress', 90);
        } else {
            this.set_stat('stress', 60);
        }
        
        this.set_stress();
        
        console.log(`post chapter - Debt: ${this.get_stat('debt')}, Wealth: ${this.get_stat('wealth')}`);
        display_stats();
        
        show("continue");
        if (this.get_stat('age') >= 42) this.end_game();
    }
    
    life_decisions() {
        const messageDiv = document.createElement("div");
        const message = document.createElement("p");
        message.innerHTML = `You're earning $${Number(this.get_object('job')[1]).toLocaleString()}/year.<br>It's time to make some important life decisions.`;
        
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
                this.change_stat('stress', 10); 
                this.set_object('housing', ["Parents' House", 0, 300]);
                this.set_object('car', ["Public Transportation", 0, 100]);
                this.change_stat('monthly_expenses', 400); 
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
        this.set_object('housing', [option.type, option.value, option.monthly]);
        this.change_stat('monthly_expenses', option.monthly);
        this.change_stat('stress', option.stress);
        
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
            {name: "Used Economy Car", value: 8000, monthly: 150, reliability: 25, stress: 5},
            {name: "New Economy Car", value: 20000, monthly: 350, reliability: 50, stress: 0},
            {name: "Used Luxury Car", value: 25000, monthly: 450, reliability: 75, stress: 10},
            {name: "New SUV", value: 35000, monthly: 550, reliability: 100, stress: -5},
            {name: "Public Transportation", value: 0, monthly: 100, reliability: 0, stress: 8}
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
                if (this.get_stat('wealth') < downPayment) {
                    alert("You can't afford the down payment for this car!");
                    this.car_options();
                    return;
                }
                this.change_stat('wealth', downPayment);
                this.change_stat('debt', (option.value - downPayment)); 
            }
            this.set_object('car', [option.name, option.value, option.monthly, option.reliability]);
        } else {
            this.car = ["Public Transportation", 0, option.monthly,option.reliability];
        }
        
        this.change_stat('monthly_expenses', option.monthly);
        this.change_stat('stress', option.stress);
        
        const resultDiv = document.createElement("div");
        const message = document.createElement("p");
        
        if (option.name !== "Public Transportation") {
            message.innerHTML = `You chose a ${option.name}.<br>Value: $${option.value.toLocaleString()}<br>Monthly payment: $${option.monthly}<br>Reliability: ${option.reliability}`;
        } else {
            message.innerHTML = `You chose to use ${option.name}.<br>Monthly cost: $${option.monthly}<br>`;
        }
        
        const expenseSummary = document.createElement("p");
        let monthly_expenses = this.get_stat('monthly_expenses', 0);
        expenseSummary.innerHTML = `<strong>Your monthly expenses:</strong> $${monthly_expenses}<br>
                                   <strong>Your yearly expernses:</strong> $${monthly_expenses * 12}`;
        
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
            this.set_stat('education', "High School");
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
        this.set_stat('education', "Trade School");
        this.change_stat('age', 2); 
        
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
        this.set_stat('education', "4 Year College");
        this.change_stat('age', 4); 
        
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

    async get_job() {
        const jobs = {
            "High School": [
                { title: "Walmart", baseSalary: 28000,onet: "41-2031.00" },
                { title: "Construction", baseSalary: 32000,onet: "47-2061.00"},
                { title: "McDonalds", baseSalary: 25000, onet: "35-9031.00" }
            ],
            
            "Trade School": [
                { title: "Electrician", baseSalary: 50000,onet: "47-2111.00" },
                { title: "Plumber", baseSalary: 48000, onet: "47-2152.00" },
                { title: "Technician", baseSalary: 47000, onet: "49-9022.00" }
            ],
            
            "4 Year College": [
                { title: "Software Manager", baseSalary: 70000, onet: "11-3021.00" },
                { title: "Financial Analyst", baseSalary: 65000, onet: "13-2051.00" },
                { title: "Marketing Manager", baseSalary: 60000, onet: "11-2021.00" }
            ]
        };

        const experienceMultiplier = 1 + (this.get_stat('job_experience', 0) / 10); 
        const educationLevel = this.get_stat('education', "High School");
        console.log(educationLevel);
        console.log(jobs);
        const availableJobs = jobs[educationLevel];
        console.log(availableJobs);

        const jobOptionsDiv = document.createElement("div");
        for (const {title, baseSalary,onet} of availableJobs) {
            console.log(`${title}: ${baseSalary}`);
            let salary = await fetchSalary(onet);
            if (!salary) {
                salary = baseSalary;
            }
            const adjustedSalary = Math.round(salary * experienceMultiplier);
            const jobButton = document.createElement("button");
            jobButton.innerText = `${title} - $${adjustedSalary.toLocaleString()}/year`;
            jobButton.onclick = () => this.select_job(title, adjustedSalary);
            jobOptionsDiv.appendChild(jobButton);
            jobOptionsDiv.appendChild(document.createElement("br"));
        }

        display_gameplay("Select a Job", jobOptionsDiv);
    }

    select_job(jobTitle, salary) {
        this.set_object('job', [jobTitle, salary]);
        this.change_stat('job_experience', 4); 
        hide_gameplay();
        display_stats();
        
        if (!this.housing || !this.car) {
            this.life_decisions(); 
        } else {
            show("continue");
        }
    }

    buy(item) {
        if (this.get_stat('wealth') >= item[0]) {
            this.change_stat('wealth', -item[0]);
        } else {
            alert('You\'re too broke to afford this');
        }
    }

    set_stress() {
        if (this.get_stat('debt') > 0) {
            this.set_stat('stress', Math.min(100, 40 + 0.000001 * Math.pow(Math.E, this.stats.debt/10000)));
        }
    }

    add_debt(amount) {
        this.change_stat('debt', amount);
        if (this.get_stat('debt') > 700000) this.set_stat('debt', 700000); 
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

    end_game()
    {
        hide("continue");
        display_gameplay("You made it to 42!", document.createElement("div"));
    }
}





class EventChain
{
    constructor (events)
    {
        this.events = events;
    }
}

class Event
{
    constructor (prompt, actions)
    {
        this.prompt = prompt;
        this.actions = actions;
    }
}

class Action
{
    constructor (description, change_type, stress, initial_cost, continuous_cost, debt, duration)
    {
        this.description = description;
        this.change_type = change_type;
        this.stress = stress;
        this.initial_cost = initial_cost;
        this.continuous_cost = continuous_cost;
        this.debt = debt;
        this.duration = duration;
    }

    apply_changes()
    {
        player.change_stat('stress', this.stress);
        let new_wealth = player.get_stat('wealth');
        if (this.change_type == "percentage") new_wealth *= this.initial_cost;
        else if (this.change_type == "flat") new_wealth += this.initial_cost;
        player.set_stat('wealth', new_wealth);
    }

    apply_continuous_change()
    {
        let new_wealth = player.stats.wealth;
        if (this.change_type == "percentage") new_wealth *= this.continuous_cost;
        else if (this.change_type == "flat") new_wealth += this.continuous_cost;
        player.set_stat('wealth', new_wealth);
    }
}

class TimeKeeper
{
    constructor ()
    {

    }
}
            
function display_stats() {
    console.log(player.get_stat('wealth'));
    
    document.getElementById("debt").innerHTML = `Debt: $${Math.round(player.get_stat('debt')).toLocaleString()}`;
    document.getElementById("wealth").innerHTML = `Wealth: $${Math.round(player.get_stat('wealth')).toLocaleString()}`;
    document.getElementById("age").innerHTML = `Age: ${player.get_stat('age')}`;
    
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
        let house = player.get_object('housing');
        housingEl.innerHTML = `Housing: ${house[0]} ($${house[2]}/month)`;
    }
    
    if (carEl && player.car) {
        let car = player.get_object('car');
        carEl.innerHTML = `Transportation: ${car[0]} ($${car[2]}/month)`;
    }
    
    if (expenseEl && player.monthly_expenses > 0) {
        expenseEl.innerHTML = `Monthly Expenses: $${player.get_stat('monthly_expenses').toLocaleString()}`;
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
//TODO: finish game
/// Add gambling(important )
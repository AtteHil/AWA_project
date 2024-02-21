const randomstring = require("randomstring")

// Tests to run and test different functions of the site
// can be run with command node test.js in /test folder

const populateDatabase = async (numberOfUsers) => {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');


    const registrationdate = `${year}-${month}-${day}`;

    for (let i = 0; i < numberOfUsers; i++) {
        let email = `user${randomstring.generate()}@email.com`;
        let password = "Test123!";
        let username = `user${i}`;
        let information = randomstring.generate();
        const response = await fetch("http://localhost:3000/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, username, password, information, registrationdate }),
        });

        if (response.status !== 200) {
            return -1
        }
        if (response.ok) {
            console.log(`Account ${i} created`);
        }

    }
    return 0
}
const tryCorrectLogin = async () => {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');


    const registrationdate = `${year}-${month}-${day}`;
    let email = `TestLogin}@email.com`;
    let password = "Test123!";
    let username = `TestLogin`;
    let information = "Testing login function";
    try {
        const response = await fetch("http://localhost:3000/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, username, password, information, registrationdate }),
        });
        if (response.ok) {
            console.log("Test Login user made")
        }
    } catch (err) {
        console.log(err)
    }
    try {
        const loginResponse = await fetch("http://localhost:3000/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        if (loginResponse.status !== 200) {
            return -1
        } else {
            return 0
        }
    } catch (err) {
        console.log(err)
    }

}

const tryIncorrectLogin = () => {

}

const tryIncorrectRegtration = () => {

}

const tryIncorrectToken = () => {

}


const runTests = async () => {
    let resultArray = []
    const tests = ["populateDatabase", "tryCorrectLogin", "tryIncorrectLogin", "tryIncorrectRegtration", "tryIncorrectToken"]
    // resultArray.push(await populateDatabase(10))
    resultArray.push(tryCorrectLogin());
    for (let i = 0; i < resultArray.length; i++) {
        if (resultArray[i] === -1) {
            console.log(`Test ${tests[i]} failed`)
        }
    }
}


runTests();
const Employee = require('./Employee');
const test1 = new Employee(4);

async function testFunction() {
    await test1.popInfoById();
    console.log(test1);
}

testFunction();


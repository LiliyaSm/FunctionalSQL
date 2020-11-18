// {
//   select: ...,
//   from: ...,
//   where: ...,
//   orderBy: ...,
//   groupBy: ...,
//   having: ...,
//   execute: ...
// }

var persons = [
    { name: "Peter", profession: "teacher", age: 20, maritalStatus: "married" },
    {
        name: "Michael",
        profession: "teacher",
        age: 50,
        maritalStatus: "single",
    },
    { name: "Peter", profession: "teacher", age: 20, maritalStatus: "married" },
    {
        name: "Anna",
        profession: "scientific",
        age: 20,
        maritalStatus: "married",
    },
    {
        name: "Rose",
        profession: "scientific",
        age: 50,
        maritalStatus: "married",
    },
    {
        name: "Anna",
        profession: "scientific",
        age: 20,
        maritalStatus: "single",
    },
    {
        name: "Anna",
        profession: "politician",
        age: 50,
        maritalStatus: "married",
    },
];

// SELECT * FROM numbers
var numbers = [1, 2, 3];

var query = function () {
    this.selectFunction = null;
    this.res = [];
    this.filterFunctions = [];

    this.select = function (...args) {
        // take function
        if (args[0]) {
            this.selectFunction = args[0];
        } else {
            this.selectFunction = (...args) => {
                return args[0];
            };
        }
        return this;
    };

    this.from = function (...args) {
        this.res = args[0];

        return this;
    };

    this.where = function (...args) {
        this.filterFunctions.push(args[0]);

        return this;
    };

    this.execute = function (...args) {
        //where call

        for (func of this.filterFunctions) {
            let res = this.res.filter(   func);
            this.res = res;
        }

        // call select
        if (this.selectFunction) {
            let res= [];
            this.res.forEach((el) => {
                res.push(this.selectFunction.call(null, el));
            });
            this.res = res;        
        } 

        return this.res;
    };

    return this;
};

function isTeacher(person) {
    return person.profession === "teacher";
}

function profession(person) {
    return person.profession;
}

// query().select().from(numbers).execute(); //[1, 2, 3]
// console.log(query().select(profession).from(persons).execute());
// console.log(
//     query().select(profession).from(persons).where(isTeacher).execute()
// );

console.log(query().from(numbers).execute());

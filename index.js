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

    this.select = function (...args) {
        // take function
        this.selectFunction = args[0];
        return this;
    };

    this.from = function (...args) {
        args[0].forEach((el) => {
            this.res.push(this.selectFunction.call(null, el));
        });

        return this;
    };

    this.execute = function (...args) {
        return this.res;
    };

    return this;
};

query.prototype = {
    select: function (...args) {
        // take function
        this.selectFunction = args[0];
        return this;
    },

    from: function (...args) {
        this.res = this.selectFunction.apply(this, args);
        return this;
    },

    execute: function (...args) {
        return this.res;
    },
};

function profession(person) {
    return person.profession;
}

// query().select().from(numbers).execute(); //[1, 2, 3]
console.log(query().select(profession).from(persons).execute());

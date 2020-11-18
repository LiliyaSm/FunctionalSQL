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

    this.groupBy = function (...args) {
        this.groupFunctions = args;
        return this;
    };

    this.execute = function (...args) {
        //where call
        for (func of this.filterFunctions) {
            let res = this.res.filter(func);
            this.res = res;
        }

        // call select
        if (this.selectFunction) {
            let res = [];
            this.res.forEach((el) => {
                res.push(this.selectFunction.call(null, el));
            });
            this.res = res;
        }

        // groupBy call
        if (this.groupFunctions.length > 0) {
            // let res = [[[]], [clause2, []]];
            let arr = [];
            let arr2 = [];


            function findAns(res, ans) {
                for (r of res) {
                    if (ans === r[0]) {
                        return true;
                    }
                }
                return false;
            }

            function groupArray(func, arrayToGroup) {
                let res = [];

                arrayToGroup.forEach((el) => {
                    let ans = func.call(null, el);
                    if (res.length === 0 || !findAns(res, ans)) {
                        res.push([ans]);
                    }

                    for (r of res) {
                        if (ans === r[0]) {
                            r[1] ? r[1].push(el) : r.push([el]);
                        }
                    }
                });
                this.res = res;
            }

            for (func of this.groupFunctions) {
                groupArray(func, this.res);
            }
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

function isEven(number) {
    return number % 2 === 0;
}

function parity(number) {
    return isEven(number) ? "even" : "odd";
}

var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function prime(number) {
    return isPrime(number) ? "prime" : "divisible";
}
// query().select().from(numbers).execute(); //[1, 2, 3]
// console.log(query().select(profession).from(persons).execute());
// console.log(
//     query().select(profession).from(persons).where(isTeacher).execute()
// );

// console.log(query().from(numbers).execute());

//SELECT * FROM numbers
// console.log(query().select().from(numbers).execute()); //[1, 2, 3, 4, 5, 6, 7, 8, 9]

//SELECT * FROM numbers GROUP BY parity
console.log(query().select().from(numbers).groupBy(parity).execute()); //[["odd",[1,3,5,7,9]],["even",[2,4,6,8]]]
// console.log(query().select().from(numbers).execute()); ///??????????????????????????????????

// query().select().from(numbers).groupBy(parity, prime).execute(),
    [
        [
            "odd",
            [
                ["divisible", [1, 9]],
                ["prime", [3, 5, 7]],
            ],
        ],
        [
            "even",
            [
                ["prime", [2]],
                ["divisible", [4, 6, 8]],
            ],
        ],
    ];

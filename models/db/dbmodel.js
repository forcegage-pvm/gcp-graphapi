const person = require('./person')
const session = require('./session')
const exercise = require('./exerciseType')
const faker = require('faker')

person.Person.hasMany(person.BodyWeight);
person.Person.hasMany(session.Session);
person.BodyWeight.belongsTo(person.Person);
session.Session.belongsTo(person.Person);
session.Session.hasOne(exercise.Exercise);


SeedData = async function SeedData() {
    var i;
    for (i = 0; i < 5; i++) {
        var d = faker.date.past()
        var year = d.getFullYear();
        var month = d.getMonth();
        var day = d.getDate();
        var date = new Date(year - (Math.random(35) * 35 + 15), month, day)
        pers = await person.Person.create({
            name: faker.name.firstName(),
            surname: faker.name.lastName(),
            gender: "MALE",
            DOB: date,
            bodyWeight: { weight: Math.random(60) * 60 + 65 }
        }, { include: [person.BodyWeight] })
        bodyweight = await person.BodyWeight.create({
            weight: Math.random(60) * 60 + 65
        })
        await pers.setBodyWeights(bodyweight)
        sess = await session.Session.create({
            timestamp: Date.now(),
            weight: parseInt(Math.random(60) * 100),
            duration: parseInt(Math.random(600) * 1000),
            exerciseCd: 1
        })
        await pers.setSessions(sess)
    }
}

exports.BodyWeight = person.BodyWeight;
exports.Person = person.Person;
exports.Session = session.Session;
exports.Exercise = exercise.Exercise;
exports.seedPersonData = function () { SeedData(); };
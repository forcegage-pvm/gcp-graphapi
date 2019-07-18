const person = require('./person')
const session = require('./session')
const exerciseType = require('./exerciseType')
const statistic = require('./statistic')
const exercises = require('./exercises')
const faker = require('faker')

// person has a history of body weights.
// the lastest one is his current body weight
person.Person.hasMany(person.BodyWeight);
person.BodyWeight.belongsTo(person.Person);
// person can have multiple sessions.
person.Person.hasMany(session.Session);
session.Session.belongsTo(person.Person);
// session can only be for one exercise type
session.Session.hasOne(exerciseType.Exercise);
// a session can have 1 or more sets of exercises
session.Session.hasMany(exercises.ExerciseSet);
exercises.ExerciseSet.belongsTo(session.Session);
// a exercise set can have 1 or more reps
exercises.ExerciseSet.hasMany(exercises.ExerciseRep);
exercises.ExerciseRep.belongsTo(exercises.ExerciseSet);
// a set and a rep can have many statistics
exercises.ExerciseRep.hasMany(statistic.Statistic);
//
session.Session.hasMany(exercises.ExerciseRep);
exercises.ExerciseRep.belongsTo(session.Session);




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
            timestamp: new Date().toISOString(),
            weight: parseInt(Math.random(60) * 100),
            duration: parseInt(Math.random(600) * 1000),
            exerciseCd: 1
        })
        await pers.setSessions(sess)
        stat = await statistic.Statistic.create({
            cd: 1,
            description: "Power",
            class: "Eccentric",
            aggregation: "avg",
            value: 451.25
        })
        stat = await statistic.Statistic.create({
            cd: 1,
            description: "Power",
            class: "Concentric",
            aggregation: "avg",
            value: 224.65
        })
        await sess.setStatistics(stat)
    }
}

exports.BodyWeight = person.BodyWeight;
exports.Person = person.Person;
exports.Session = session.Session;
exports.Exercise = exerciseType.Exercise;
exports.Statistic = statistic.Statistic;
exports.ExerciseRep = exercises.ExerciseRep;
exports.ExerciseSet = exercises.ExerciseSet;
exports.seedPersonData = function () { SeedData(); };
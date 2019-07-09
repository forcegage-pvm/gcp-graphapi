const { Exercise } = require('./models/db/exerciseType')

var _exerciseTypes = undefined;

exerciseTypes = async function(cd) {
    if (_exerciseTypes) {
    } else {
        _exerciseTypes = await Exercise.findAll();
    }
    theExercise = _exerciseTypes.filter((exercise) => { return exercise.cd == cd});
    return theExercise[0].description
}

initGlobals = async function(){
    _exerciseTypes = await Exercise.findAll();
}

exports.exerciseTypes = exerciseTypes
exports.initGlobals = initGlobals

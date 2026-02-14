const yargs = require('yargs/yargs'); 
const { hideBin } = require('yargs/helpers'); 

function getArgv(argType){
    const defaultValue = argType === 'number' ? 0 : false;
    const argv = yargs(hideBin(process.argv))
            .option("year", {
                alias: "y",
                type: argType,
                default: defaultValue
            })
            .option("month", {
                alias: "m",
                type: argType,
                default: defaultValue
            })
            .option("date", {
                alias: "d",
                type: argType,
                default: defaultValue
            })
            .argv; 
    return {argv, argType}
}

function getDate({argv, argType, operation}){
    let resultDate = new Date();
    if (argType === 'boolean') {
        const data = Object.entries(argv).filter(([key, value ]) => typeof value === 'boolean' && value);
        if (data.length > 2) {
            throw new Error('Only one argument can be accepted')
        }
        const dataObj = Object.fromEntries(data)
        if (dataObj.date) return resultDate.getDate();
        if (dataObj.month) return resultDate.getMonth() + 1;
        if (dataObj.year) return resultDate.getFullYear();
        return new Date();
    }
    if (Object.values(argv).filter(Number).reduce((acc, cur) => acc + cur, 0) === 0) {
        return new Date();
    } else {
        const year = operation === 'add' ? Math.abs(argv.year) : -Math.abs(argv.year)
        const month = operation === 'add' ? Math.abs(argv.month) : -Math.abs(argv.month)
        const date = operation === 'add' ? Math.abs(argv.date) : -Math.abs(argv.date)
        resultDate.setMonth(resultDate.getMonth() + month)
        resultDate.setDate(resultDate.getDate() + date)
        resultDate.setFullYear(resultDate.getFullYear() + year)
        return resultDate
    }
}

module.exports = {
    getArgv,
    getDate
}
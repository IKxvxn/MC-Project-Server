function normaliceUsername(string) {
    if (string==''){
        return ''
    } 
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

function getRandom(num) {
    return Math.floor(Math.random() * num)
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function compareAbsolute(stringA, stringB, addedValues) {
    stringA = stringA.replace(/[^A-Za-z0-9]/gi,"").toLowerCase()
    stringB = stringB.replace(/[^A-Za-z0-9]/gi,"").toLowerCase()

    for(const index in addedValues) {
        copy = addedValues[index].replace(/[^A-Za-z0-9]/gi,"").toLowerCase()
        if(stringB.includes(copy)) {return true}
    }

    return (stringA.includes(stringB))
}

function getRandomItem(set) {
    let items = Array.from(set);
    return items[Math.floor(Math.random() * items.length)];
}

module.exports = {
    normaliceUsername, getRandom, shuffle, compareAbsolute, getRandomItem
}
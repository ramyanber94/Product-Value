import fs from 'fs';

const getUnique = () => {
    const data = fs.readFileSync('./balancedData.csv', 'utf8');
    const lines = data.split('\n');
    const unique = new Set();
    // get unique makes
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].split(',');
        unique.add(line[1]);
    }

    fs.writeFileSync('./unique.csv', 'make\n');
    unique.forEach(make => {
        fs.appendFileSync('./unique.csv', `${make}\n`);
    });
}

getUnique();
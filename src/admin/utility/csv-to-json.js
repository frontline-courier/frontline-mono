// Node.js version
const fs = require('fs');

async function csvToJsonFromFile(filePath) {
    try {
        const csvString = fs.readFileSync(filePath, 'utf8'); // Read file synchronously
        return csvToJson(csvString); // Use the csvToJson function from the previous responses
    } catch (error) {
        console.error("Error reading or processing the file:", error);
        return null; // Or throw the error, depending on your error handling strategy
    }
}

function csvToJson(csvString) {
    const lines = csvString.trim().split('\n');
    const headers = lines[0].split(',');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(',');
        // Skip empty rows
        if (currentLine.every(cell => cell.trim() === '')) {
            continue; // Skip to the next iteration
        }

        const obj = {};
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentLine[j].trim();
        }
        result.push(obj);
    }

    return JSON.stringify(result, null, 2); // Convert to JSON string with indentation
}

async function writeJsonToFile(jsonString, outputPath) {
    try {
        fs.writeFileSync(outputPath, jsonString, 'utf8');
        console.log(`JSON data written to ${outputPath}`);
    } catch (error) {
        console.error("Error writing JSON to file:", error);
    }
}

const inputFilePath = '/Users/aravind_appadurai/Downloads/ZONE.csv'; // Replace with your actual file path
const outputFilePath = 'zone.json'; // Replace with your desired output file path

csvToJsonFromFile(inputFilePath)
    .then(jsonData => {
        if (jsonData) {
            return writeJsonToFile(jsonData, outputFilePath); // Write to file
        }
    })
    .catch(err => {
        console.error("Error processing CSV:", err);
    });

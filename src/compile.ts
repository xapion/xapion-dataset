/**
 This script performs these tasks:
 1. Loads data/index.json for available datasets.
 2. Iterates through all datasets and performs available transformations.
 3. Saves the transformed datasets to the output directory.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import {sortPlain} from "./transformers/sort";

const compile = async () => {
    // Get data directory path

    const dataDir = path.join(__dirname, '../data');

    // Load index.json
    const index: { datasets: string[] } = require(path.join(dataDir, 'index.json'));

    // Load all datasets
    const datasets = index.datasets?.map((dataset: string) => require(path.join(dataDir, dataset))) ?? [];

    // Perform transformations
    datasets.forEach((dataset: { file: string, exclusions: string }) => {
        // Perform transformations here
        const datasetItems = fs.readFileSync(path.join(dataDir, dataset.file))
            .toString()
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
        const exclusionsItems = fs.readFileSync(path.join(dataDir, dataset.exclusions))
            .toString()
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

        let datasetTransformed = datasetItems;
        datasetTransformed = datasetTransformed.filter((line) => !exclusionsItems.includes(line));
        datasetTransformed = datasetTransformed.sort();

        fs.writeFileSync(path.join(dataDir, dataset.file), datasetTransformed.join('\n'));
    });
}

compile().catch(console.error).then(() => console.log('Done!'));

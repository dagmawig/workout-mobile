import Fuse from 'fuse.js';
import exerLocal from '../assets/ExerData/exercisesLocal.json';

const bodyParts = [
    "back",
    "cardio",
    "chest",
    "lower arms",
    "lower legs",
    "neck",
    "shoulders",
    "upper arms",
    "upper legs",
    "waist"
];

const muscleGroups = [
    "abductors",
    "abs",
    "biceps",
    "calves",
    "cardiovascular system",
    "delts",
    "forearms",
    "glutes",
    "hamstrings",
    "lats",
    "levator scapulae",
    "pectorals",
    "quads",
    "serratus anterior",
    "spine",
    "traps",
    "triceps"
];

// defines fuzzy/approximate string matching search parameters
const options = {
    includeScore: true,
    shouldSort: true,
    findAllMatches: true,
    useExtendedSearch: true,
    ignoreLocation: true,
    threshold: 0.06,
    keys: ['name']
}

// defines the FuseJS search object using the given input array and search options
const exerFuse = new Fuse(exerLocal, options);

// returns elements approximately matching the input text 
const Search = (text) => {
    if(text=== '') return SortExer(exerFuse.search("!0123456789"));
    else return exerFuse.search("'" + text.trim());
}

// filters exercises based on selected body parts and muscle group filter parameters
const Filter = (eArr, activeB, activeM) => {
    const bList = bodyParts.filter((body, i) => {
        return activeB[i]
    });

    const mList = muscleGroups.filter((muscle, i) => {
        return activeM[i];
    })

    if (mList.length !== 0 || bList.length !== 0) return eArr.filter(exer => {
        return bList.includes(exer.item.bodyPart) || mList.includes(exer.item.target);
    })
    else return eArr;
}

// sorts exercises based on exercise name
const SortExer = (exerArr) => {
    return exerArr.sort((a, b) => {

        return a.item.name < b.item.name ? -1 : a.item.name > b.item.name ? 1 : 0;
    });
}

export default { search: Search, filter: Filter, sort: SortExer }
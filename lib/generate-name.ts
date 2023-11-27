import {
  animals,
  adjectives,
  uniqueNamesGenerator,
} from "unique-names-generator";

export const generateRandomName = () => {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: "-",
  });
};

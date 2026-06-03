import { faker } from '@faker-js/faker';

/**
 * Generates dynamic mock data based on naming conventions within the key and the parent context.
 * * @param key - The property/field name needing a random value.
 * @param parentKey - Optional. The parent object key name to apply specific business rules.
 */
export function getRandomDataValue(key: string, parentKey?: string): string {
  const lowerKey = key.toLowerCase();
  const lowerParent = parentKey?.toLowerCase();

  // ContentBlockCreation
  if (lowerParent === 'contentblockcreation' && lowerKey === 'timeestimateinminutes') {
    return faker.number.int({ min: 5, max: 15 }).toString();
  }

 
  if (lowerKey.includes('assetname') || lowerKey.includes('name')) {
    return `CB - ${faker.commerce.productName()} ${faker.number.int(999)}`;
  } 
  
  if (lowerKey.includes('description')) {
    return faker.lorem.sentence();
  } 
  
  if (lowerKey.includes('timeestimateinminutes')) {
    return faker.number.int({ min: 5, max: 60 }).toString();
  } 

  // Fallback string if it doesn't match hints
  return faker.word.noun();
}
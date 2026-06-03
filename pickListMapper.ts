import { faker } from '@faker-js/faker';

// mapping of allowed Picklist values 
export const picklistMaps: Record<string, string[]> = {
  ContentOwnerOrganization: ['Employee Learning', 'Employee Success', 'Finance'],
  Status: ['Draft', 'Active', 'Archived']
};


export function getPicklistValue(key: string): string {
  const options = picklistMaps[key];
  if (!options) {
    throw new Error(`No picklist options array defined for key: "${key}"`);
  }
  return faker.helpers.arrayElement(options);
}

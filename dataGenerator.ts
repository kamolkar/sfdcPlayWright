import * as fs from 'fs';
import * as path from 'path';
import { getRandomDataValue } from '../utils/randomDataGenerator';
import { getPicklistValue } from '../utils/pickListMapper';

export function generateDynamicTestData(filePath: string): any[] {
  const absolutePath = path.resolve(filePath);
  
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`JSON file not found at path: "${absolutePath}"`);
  }
  
  const fileContent = fs.readFileSync(absolutePath, 'utf-8');
  let JSONTestDataArray: any[];

  try {
    const parsed = JSON.parse(fileContent);
    JSONTestDataArray = Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    throw new Error(`Invalid JSON in file "${absolutePath}"`);
  }

  // 1. Generate timestamp 
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const randomNumber = String(Math.floor(Math.random() * 100)).padStart(2, '0');
  //const seconds = String(now.getSeconds()).padStart(2, '0');
  const systemDateTime = `${year}${month}${day}_${hours}${minutes}${randomNumber}`;

  
  const processValue = (value: any, currentKey: string = '', parentKey: string = ''): any => {
    
  
    if (Array.isArray(value)) {
      return value.map((item) => processValue(item, currentKey, parentKey));
    }

  
    if (typeof value === 'object' && value !== null) {
      const copy = { ...value };
      for (const key in copy) {
        
        copy[key] = processValue(copy[key], key, currentKey); 
      }
      return copy;
    }

    
    if (value === 'RandomData') {
      return getRandomDataValue(currentKey, parentKey); 
    } 
    if (value === 'Picklist') {
      return getPicklistValue(currentKey);
    }

   
    if (typeof value === 'string' && value.includes('DateTime')) {
      return value.replace(/DateTime/g, systemDateTime);
    }

    // Return static primitives (booleans, numbers, unmatched strings) as-is
    return value;
  };

  return JSONTestDataArray.map((record) => processValue(record));
}
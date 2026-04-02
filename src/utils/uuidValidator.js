import { v4 as uuidv4 } from 'uuid';

export const isValidUUID = (uuid) => {
  if (!uuid) return false;
  // Validates UUID v4 format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const generateUUID = () => {
  return uuidv4();
};
export function removeFromList(list, itemToRemove) {
  let index = list.indexOf(itemToRemove);
  if (index > -1) {
    list.splice(index, 1);
  }
}

export const cls = (input) =>
  input
    .replace(/\s+/gm, " ")
    .split(" ")
    .filter((cond) => typeof cond === "string")
    .join(" ")
    .trim();

export function validateLRN(LRN) {
  let validationStr = "";
  const trimmedLRN = LRN.trim();
  if (/[^\d]/.test(trimmedLRN)) {
    validationStr += `"${LRN}" contains non-integer characters.`;
    return validationStr;
  }
  if (trimmedLRN.length !== 12) {
    validationStr += `"${LRN}" is not a 12-digit value.`;
    return validationStr;
  }
}

export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // you can also set this to "auto" or "instant"
  });
}

export function generateCode(name) {
  return name.substr(0, 2).toUpperCase();
}

export function sanitizeString(str) {
  return str.replace(/[^a-zA-Z0-9]/g, "");
}

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}

export function isSameDate(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function getUniqueFilename(filename, collection) {
  let count = 0;
  let newFilename = filename;

  while (collection.includes(newFilename)) {
    count++;
    newFilename = filename.replace(/(\.[^/.]+)$/, `_${count}$1`);
  }

  return newFilename;
}

export function isValidObjectIdString(str) {
  return /^[0-9a-fA-F]{24}$/.test(str);
}

export function validatePhoneNumber(phoneNumber) {
  const digitsOnly = phoneNumber.replace(/\D/g, "");

  return /^09\d{9}$/.test(digitsOnly) ? digitsOnly : false;
}

export function isValidUrl(url) {
  const pattern =
    /^((http|https):\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
  return pattern.test(url) ? url : false;
}

export function isValidNumber(value) {
  if (isNaN(Number(value))) {
    return false;
  }

  if (!isFinite(value)) {
    return false;
  }

  return true;
}

export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function average(numbers) {
  const total = numbers.reduce((sum, num) => sum + num, 0);
  return total / numbers.length;
}

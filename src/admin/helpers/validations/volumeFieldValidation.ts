export const volumeFieldValidation = async (field: string) => {

  // non-mandatory field
  if (field === '') return true;

  if (field.toLowerCase().split('x').length !== 3) return false;

  const [ l, b, h ] = field.toLowerCase().split('x');
  if (isNaN(parseInt(l, 10)) || isNaN(parseInt(b, 10)) || isNaN(parseInt(h, 10))) return false; 

  return true;
};

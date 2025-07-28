export const convertStr = (input: string) => {
  function removeVietnameseTones(str: string): string {
    return (
      str
        .normalize("NFD") // split characters with diacritics
        .replace(/[\u0300-\u036f]/g, "") // remove diacritics
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D") // replace 'đ' with 'd' and 'Đ' with 'D'
        // .replace(/[^a-zA-Z0-9\s]/g, "") // remove special characters
        .trim() // remove leading and trailing whitespace
        .replace(/\s+/g, " ") // replace multiple spaces with a single space
        .toLowerCase()
    ); // convert to lowercase
  }

  return removeVietnameseTones(input);
};

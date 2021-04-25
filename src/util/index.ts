import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.log(e);
  }
};

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? JSON.parse(value) : null;
  } catch (e) {
    console.log(e);
  }
};

export const deleteData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
};

export const capitalize = (text: string) => {
  const words = text.split(" ");
  const capitalizedWords = words.map((word) => {
    return word[0].toUpperCase() + word.substr(1);
  });
  return capitalizedWords.join(" ");
};

export const isValidEmail = (email: string) => {
  const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return re.test(email) && email.length > 1;
};

export const isValidPassword = (
  password: string,
  confirmPassword: string | null = null
) => {
  const re = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
  if (!confirmPassword) {
    return re.test(password) && password.length > 5;
  }
  return (
    re.test(password) && password.length > 5 && confirmPassword === password
  );
};

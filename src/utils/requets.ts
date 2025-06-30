/* eslint-disable @typescript-eslint/no-explicit-any */

export const BASE_URL = `http://localhost:3001`;
const API_URL = `${BASE_URL}`;

export const get = async (path: string, token?: string) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  if (token) {
    myHeaders.append("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(API_URL + path, {
      credentials: "include",
      headers: myHeaders,
    });
    const result = await response.json();
    if (result.code > 300) {
      throw Error(result.message);
    }
    return result;
  } catch (error: any) {
    throw new Error(error.message || error);
  }
};

export const post = async (path: string, options: any, token?: string) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  if (token) {
    myHeaders.append("Authorization", `Bearer ${token}`);
  }
  try {
    const response = await fetch(`${API_URL}${path}`, {
      credentials: "include",
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(options),
    });
    const result = await response.json();
    if (result.code > 300) {
      throw Error(result.message);
    }
    return result;
  } catch (error: any) {
    throw new Error(error.message || error);
  }
};

export const patch = async function (
  path: string,
  options: any,
  token?: string
) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  if (token) {
    myHeaders.append("Authorization", `Bearer ${token}`);
  }
  try {
    const response = await fetch(`${API_URL}${path}`, {
      credentials: "include",
      method: "PATCH",
      headers: myHeaders,
      body: JSON.stringify(options),
    });
    const result = await response.json();
    if (result.code > 300) {
      throw Error(result.message);
    }
    return result;
  } catch (error: any) {
    throw new Error(error.message || error);
  }
};

export const del = async function (path: string, id: string, token?: string) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  if (token) {
    myHeaders.append("Authorization", `Bearer ${token}`);
  }
  try {
    const response = await fetch(`${API_URL}${path}/${id}`, {
      credentials: "include",
      method: "DELETE",
      headers: myHeaders,
    });
    const result = await response.json();
    if (result.code > 300) {
      throw Error(result.message);
    }
    return result;
  } catch (error: any) {
    throw new Error(error.message || error);
  }
};

export const postImage = async (
  path: string,
  key: string,
  options: any,
  token?: string
) => {
  const myHeaders = new Headers();
  // myHeaders.append("Content-Type", "multipart/form-data");
  if (token) {
    myHeaders.append("Authorization", `Bearer ${token}`);
  }
  const formdata = new FormData();
  formdata.append(key, options);
  try {
    const response = await fetch(`${API_URL}/upload/${path}`, {
      credentials: "include",
      method: "POST",
      headers: myHeaders,
      body: formdata,
    });
    const result = await response.json();
    if (result.code > 300) {
      throw Error(result.message);
    }
    return result;
  } catch (error: any) {
    throw new Error(error.message || error);
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */

import FileResizer from "react-image-file-resizer";

export const BASE_URL = `https://api.kakrist.site`;
// export const BASE_URL = `http://localhost:3001`;
const API_URL = `${BASE_URL}`;

export const fetcher = (url: string) =>
  fetch(`${API_URL}${url}`, { credentials: "include" }).then((res) =>
    res.json()
  );

export const get = async (path: string, token?: string, config?: any) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  if (token) {
    myHeaders.append("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(API_URL + path, {
      credentials: "include",
      headers: myHeaders,
      ...config,
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
    if (response.status === 429) {
      window.location.href = "/error/429";
    }
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

export const postImage = async (key: string, options: any, token?: string) => {
  const myHeaders = new Headers();
  // myHeaders.append("Content-Type", "multipart/form-data");
  if (token) {
    myHeaders.append("Authorization", `Bearer ${token}`);
  }
  const formdata = new FormData();
  const newOptions: any = await resizeFile(options);
  formdata.append(key, newOptions);
  try {
    const response = await fetch(`${API_URL}/upload`, {
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

export const postImageMulti = async (
  key: string,
  options: any,
  token?: string
) => {
  const myHeaders = new Headers();
  if (token) {
    myHeaders.append("Authorization", `Bearer ${token}`);
  }
  const formdata = new FormData();
  for (const file of options) {
    const newFile: any = await resizeFile(file);
    formdata.append(`${key}`, newFile);
  }
  try {
    const response = await fetch(`${API_URL}/upload/multi`, {
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

const resizeFile = (file: any) =>
  new Promise((resolve) => {
    FileResizer.imageFileResizer(
      file,
      1024,
      720,
      "JPEG",
      80,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });

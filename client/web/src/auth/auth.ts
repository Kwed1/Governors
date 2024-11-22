export const saveToken = (token: string) => {
    console.log(token);
    localStorage.setItem('authToken', token);
};

export const getToken = () => {
    return localStorage.getItem('authToken');
};

export const clearToken = () => {
    localStorage.removeItem('authToken');
};
export const generateUserErrorInfo =(user)=>{
    return `one or more preopeerties were imcomplete or invalis.
    list of required properties:
    *first_name: needs to be a String, received ${user.first_name}
    *last_name: needs to be a String, received ${user.last_name}
    *email: needs to be a valid email address, received ${user.email}`;
};

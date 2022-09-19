const  addUser = (name, last_name) => {
   
   
    let initial = name.charAt(0);
 
    let result1 = initial.concat(last_name);

    return result1.toLowerCase();
}

module.exports = addUser;
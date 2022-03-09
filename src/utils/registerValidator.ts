import validator from 'validator';
interface IData {
    email: string,
    fullname: string,
    password: string,
}

const registerValidator = (data: IData) => {
    if (validator.isEmail(data.email) === false ||
        validator.isLength(data.fullname, {min: 3}) === false ||
        validator.isLength(data.password, {min: 6}) === false){
            return false
        } else {
            return true;
        }
}

export default registerValidator;
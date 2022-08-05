export const emailValidate = (value) => {
  if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
   return true
  } else {
    return false
  }
}

export const nameValidate = (value) => {
  if (/^[A-Za-z\s]+$/.test(value)) {
   return true
  } else {
    return false
  }
}

export const usernameValidate = (value) => {
  if (/^[a-zA-Z0-9]+$/.test(value)) {
   return true
  } else {
    return false
  }
}

export const specialCharsValidate = (value) => {
  if(/^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g.test(value)) {
    return true
  } else {
    return false
  }
}

export const phoneValidate = (value) => {
  if(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(value)) {
    return true
  } else {
    return false
  }
}
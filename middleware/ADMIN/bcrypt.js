import bcrypt from 'bcrypt';

// Hash password
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Compare password
const comparePassword = async (password, hashedPasswords) => {
  console.log({password,hashedPasswords});
  
  return await bcrypt.compare(password, hashedPasswords);
};

export { hashPassword, comparePassword };

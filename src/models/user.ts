export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone: string;
  passwordHash: string;
}

// Mock DB
const users: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    username: "john",
    phone: "123-456-7890",
    passwordHash: "$2b$10$examplehash...",
  },
];


/**
 * Checks if the given username exists in DB
 * @param username
 * @returns user
 */
export const findUserByUsername = async (
  username: string
): Promise<User | undefined> => {
  return users.find((user) => user.username === username);
};

/**
 * Checks if the given id exists in DB
 * @param id
 * @returns user
 */
export const findUserById = async (id: string): Promise<User | undefined> => {
  return users.find((user) => user.id === id);
};

/**
 * Adds a new user to the mock database
 * @param newUser
 */
export const addUser = async (newUser: User): Promise<void> => {
  const userExists = await findUserByUsername(newUser.username);
  if (userExists) {
    throw new Error('Username already exists');
  }

  const userWithId = await findUserById(newUser.id);
  if (userWithId) {
    throw new Error('User with this ID already exists');
  }
  users.push(newUser);
};

/**
 * Gets all users in the mock database
 * @returns list of users
 */
export const getAllUsers = async (): Promise<User[]> => {
  return users;
};
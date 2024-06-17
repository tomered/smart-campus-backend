export interface User {
  id: string;
  username: string;
  passwordHash: string;
}

// Mock DB
const users: User[] = [
  {
    id: "1",
    username: "john",
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

import bcrypt from "bcrypt";

export const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try{
    const result = 
  }
};

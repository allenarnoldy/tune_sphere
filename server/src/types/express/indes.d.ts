declare namespace Express {
    interface Request {
      user?: {
        user_name: string;
      };
    }
  }
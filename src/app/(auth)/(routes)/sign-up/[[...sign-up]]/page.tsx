import { SignUp } from "@clerk/nextjs";
const signUp = () => {
  return (
    <div className="h-screen  flex  items-center">
      <SignUp />
    </div>
  );
};

export default signUp;

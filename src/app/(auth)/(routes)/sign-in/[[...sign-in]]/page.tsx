import { SignIn } from "@clerk/nextjs";
const signUp = () => {
  return (
    <div className="h-screen  flex  items-center">
      <SignIn />
    </div>
  );
};

export default signUp;

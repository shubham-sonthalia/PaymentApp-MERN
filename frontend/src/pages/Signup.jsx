import { Card } from "./../components/Card";

export const Signup = ({ user, setUser }) => {
  return (
    <div className="bg-background_gray h-screen flex items-center justify-center">
      <Card
        signIn={false}
        message={"Enter your information to create an account"}
        user={user}
        setUser={setUser}
      ></Card>
    </div>
  );
};

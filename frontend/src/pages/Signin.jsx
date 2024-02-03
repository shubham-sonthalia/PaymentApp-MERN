import { Card } from "./../components/Card";
export const Signin = ({ user, setUser }) => {
  return (
    <div className="bg-background_gray h-screen flex items-center justify-center">
      <Card
        signIn={true}
        message={"Enter your credentials to access your account"}
        user={user}
        setUser={setUser}
      ></Card>
    </div>
  );
};

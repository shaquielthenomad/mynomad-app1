import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useUser();
  const { toast } = useToast();

  const handleLogin = async (data: { username: string; password: string }) => {
    setIsLoading(true);
    try {
      const result = await login(data);
      if (!result.ok) {
        throw new Error(result.message);
      }
      toast({
        title: "Success",
        description: "Successfully logged in",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: { username: string; email: string; password: string }) => {
    setIsLoading(true);
    try {
      const result = await register(data);
      if (!result.ok) {
        throw new Error(result.message);
      }
      toast({
        title: "Success",
        description: "Successfully registered and logged in",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to register",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-lg py-10">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Welcome to MyNomad</CardTitle>
          <CardDescription>
            Your AI-powered travel companion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
